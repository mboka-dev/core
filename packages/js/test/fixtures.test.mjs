// Runs every active file in /fixtures against the built package.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lib from '../dist/esm/index.js';

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '../../../fixtures');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.json') ? [path] : [];
  });
}

function assertPartial(actual, expected, path = 'result') {
  if (expected !== null && typeof expected === 'object' && !Array.isArray(expected)) {
    assert.ok(actual !== null && typeof actual === 'object', `${path}: expected an object, got ${JSON.stringify(actual)}`);
    for (const [key, value] of Object.entries(expected)) assertPartial(actual[key], value, `${path}.${key}`);
  } else {
    assert.deepStrictEqual(actual, expected, path);
  }
}

for (const file of walk(fixturesDir)) {
  const fixture = JSON.parse(readFileSync(file, 'utf8'));
  const label = `${relative(fixturesDir, file)} — ${fixture.function}`;
  const [moduleName, fnName] = fixture.function.split('.');

  describe(label, { skip: fixture.status === 'pending' ? 'pending fixture' : false }, () => {
    const fn = lib[moduleName]?.[fnName];
    test('function exists', () => assert.equal(typeof fn, 'function', `${fixture.function} is not exported`));

    for (const c of fixture.cases) {
      test(c.name, () => {
        const call = () => ('options' in c ? fn(c.input, c.options) : fn(c.input));
        if (c.expectedError) assert.throws(call);
        else assertPartial(call(), c.expected);
      });
    }
  });
}
