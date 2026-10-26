#!/usr/bin/env node
// Sets the same version in both packages: node scripts/set-version.mjs 0.2.0
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
  console.error('Usage: npm run version:set -- <x.y.z>');
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const pkgPath = join(root, 'packages/js/package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const pyPath = join(root, 'packages/py/pyproject.toml');
writeFileSync(pyPath, readFileSync(pyPath, 'utf8').replace(/^version = ".*"$/m, `version = "${version}"`));

const initPath = join(root, 'packages/py/src/mboka/__init__.py');
writeFileSync(initPath, readFileSync(initPath, 'utf8').replace(/^__version__ = ".*"$/m, `__version__ = "${version}"`));

console.log(`✓ version set to ${version} (npm + PyPI)`);
