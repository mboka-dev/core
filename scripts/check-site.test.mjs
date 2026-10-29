import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkSite } from './check-site.mjs';

async function fixture(t, files = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'mboka-site-check-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [filename, contents] of Object.entries({ 'index.html': '', 'styles.css': '', 'app.js': '', 'demos.js': '', ...files })) {
    const path = join(directory, filename);
    await mkdir(join(path, '..'), { recursive: true });
    await writeFile(path, contents);
  }
  return directory;
}

test('checks local HTML, CSS and module dependencies while allowing remote URLs', async t => {
  const directory = await fixture(t, {
    'index.html': '<link href="styles.css"><script src="app.js"></script><a href="#telephone">Téléphone</a>',
    'styles.css': '@font-face { src: url("assets/font.woff2?v=1#latin"); }',
    'app.js': "import { initDemos } from './demos.js'; import('https://cdn.example.test/library.js'); const example = `import { phone } from '@mboka-dev/core';`;",
    'assets/font.woff2': Buffer.from([0, 1, 2]),
  });
  const result = await checkSite(directory);
  assert.equal(result.runtimeFiles, 5);
  assert.ok(result.bytes > 0);
});

test('rejects a broken local dependency in each source format', async t => {
  for (const [filename, source] of [
    ['index.html', '<img src="missing.svg">'],
    ['styles.css', 'body { background: url(missing.svg); }'],
    ['styles.css', '@import "missing.css";'],
    ['app.js', "import './missing.js';"],
    ['app.js', "import {\n  missing\n} from './missing.js';"],
    ['demos.js', "const library = await import('./missing.js');"],
  ]) {
    const directory = await fixture(t, { [filename]: source });
    await assert.rejects(checkSite(directory), /Missing local file/);
  }
});

test('rejects references outside the deployable site, including encoded paths', async t => {
  const directory = await fixture(t, { 'index.html': '<img src="%2e%2e/private.svg">' });
  await assert.rejects(checkSite(directory), /Reference leaves site/);
});

test('counts binary assets at their uncompressed size and rejects an oversized site', async t => {
  const directory = await fixture(t, { 'assets/font.woff2': Buffer.alloc(200_001) });
  await assert.rejects(checkSite(directory), /exceeds 200000-byte budget/);
});

test('excludes public documentation and license text from runtime transfer size', async t => {
  const directory = await fixture(t, { 'README.md': 'x'.repeat(200_001), 'assets/OFL.txt': 'license' });
  assert.deepEqual(await checkSite(directory), { bytes: 0, runtimeFiles: 4 });
});

test('requires all entry modules even when nothing links to one yet', async t => {
  const directory = await fixture(t);
  await rm(join(directory, 'demos.js'));
  await assert.rejects(checkSite(directory), /Missing site entry: demos.js/);
});
