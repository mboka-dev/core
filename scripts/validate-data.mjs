#!/usr/bin/env node
// Validates every file in data/ against its JSON schema, then applies
// project rules that a schema cannot express.
//
//   node scripts/validate-data.mjs            # errors fail, "a_verifier" entries are reported
//   node scripts/validate-data.mjs --strict   # also fails on any "a_verifier" entry (v1.0+ releases)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
const schemaDir = join(dataDir, 'schema');
const strict = process.argv.includes('--strict');

const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
for (const file of readdirSync(schemaDir)) {
  ajv.addSchema(JSON.parse(readFileSync(join(schemaDir, file), 'utf8')));
}

const errors = [];
const pending = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path === schemaDir) return [];
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.json') ? [path] : [];
  });
}

function collectVerifications(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectVerifications(item, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    if (node.verification) out.push({ path, label: node.nom ?? node.prefix ?? node.id ?? path, v: node.verification });
    for (const [key, value] of Object.entries(node)) {
      if (key !== 'verification') collectVerifications(value, `${path}.${key}`, out);
    }
  }
}

const loaded = {};
for (const file of walk(dataDir)) {
  const rel = relative(root, file);
  let doc;
  try {
    doc = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${rel}: invalid JSON (${e.message})`);
    continue;
  }
  const schemaId = `${basename(file, '.json')}.schema.json`;
  const validate = ajv.getSchema(schemaId);
  if (!validate) {
    errors.push(`${rel}: no schema named ${schemaId} in data/schema/`);
    continue;
  }
  if (!validate(doc)) {
    for (const err of validate.errors) errors.push(`${rel}${err.instancePath}: ${err.message}`);
    continue;
  }
  loaded[basename(file, '.json')] = doc;

  const verifs = [];
  collectVerifications(doc, '$', verifs);
  for (const { path, label, v } of verifs) {
    if (v.status === 'a_verifier') pending.push(`${rel} ${path} (${label})`);
  }

  // Ids must be unique within a file.
  if (Array.isArray(doc.items)) {
    const seen = new Set();
    for (const item of doc.items) {
      if (seen.has(item.id)) errors.push(`${rel}: duplicate id "${item.id}"`);
      seen.add(item.id);
    }
  }
}

// Cross-file references.
const ids = (name) => new Set((loaded[name]?.items ?? []).map((i) => i.id));
const depIds = ids('departements');
const communeIds = ids('communes');
for (const c of loaded.communes?.items ?? []) {
  if (!depIds.has(c.departement)) errors.push(`data/geo/communes.json: "${c.id}" points to unknown departement "${c.departement}"`);
}
for (const a of loaded.arrondissements?.items ?? []) {
  if (!communeIds.has(a.commune)) errors.push(`data/geo/arrondissements.json: "${a.id}" points to unknown commune "${a.commune}"`);
}
const prefixes = (loaded.numerotation?.prefixes ?? []).map((p) => p.prefix);
for (const p of prefixes) {
  if (prefixes.some((other) => other !== p && other.startsWith(p))) {
    errors.push(`data/phone/numerotation.json: prefix "${p}" overlaps a longer prefix; keep prefixes unambiguous`);
  }
}

if (pending.length) {
  const log = strict ? console.error : console.warn;
  log(`\n${pending.length} entr${pending.length > 1 ? 'ies' : 'y'} still "a_verifier":`);
  for (const p of pending) log(`  - ${p}`);
  if (strict) errors.push('strict mode: "a_verifier" entries are not allowed');
}

if (errors.length) {
  console.error(`\n✗ Data validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✓ Data valid');
