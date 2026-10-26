import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geo } from '../dist/esm/index.js';

test('lists are arrays', () => {
  assert.ok(Array.isArray(geo.departements()));
  assert.ok(Array.isArray(geo.communes()));
  assert.ok(Array.isArray(geo.arrondissements()));
});

test('returned data cannot mutate the shipped data', () => {
  const first = geo.departements();
  first.push({ id: 'fake', nom: 'Fake', aliases: [], verification: { status: 'a_verifier' } });
  assert.notEqual(geo.departements().length, first.length);
});

test('unknown or empty names return null', () => {
  assert.equal(geo.find('Atlantis'), null);
  assert.equal(geo.find('   '), null);
  assert.equal(geo.normalizeName('Atlantis'), null);
});
