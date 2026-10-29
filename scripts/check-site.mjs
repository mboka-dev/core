import { lstat, readFile, readdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultDirectory = fileURLToPath(new URL('../site/', import.meta.url));
const requiredFiles = ['index.html', 'styles.css', 'app.js', 'demos.js'];
const maximumBytes = 200_000;

function isOutside(root, target) {
  const path = relative(root, target);
  return path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path);
}

function isDocumentation(filename) {
  return /\.md$/i.test(filename) || /^(?:license|ofl)(?:\.[^.]*)?$/i.test(filename);
}

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Site files cannot be symbolic links: ${path}`);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function references(filename, source) {
  if (/\.html?$/i.test(filename)) {
    return [...source.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  }
  if (/\.css$/i.test(filename)) {
    const urls = [...source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)].map(match => (match[1] ?? match[2] ?? match[3]).trim());
    const imports = [...source.matchAll(/@import\s+["']([^"']+)["']/gi)].map(match => match[1]);
    return [...urls, ...imports];
  }
  if (/\.[cm]?js$/i.test(filename)) {
    const imports = /\b(?:import\s*\(\s*|(?:import|export)\s+(?:[^;]*?\s+from\s+)?)["']([^"']+)["']/g;
    return [...source.matchAll(imports)].map(match => match[1]).filter(reference => /^[./]/.test(reference));
  }
  return [];
}

function localTarget(root, filename, reference) {
  if (/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return null;
  const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  if (!pathname) return null;
  const target = resolve(dirname(filename), pathname);
  if (isOutside(root, target)) throw new Error(`Reference leaves site/: ${relative(root, filename)} → ${reference}`);
  return target;
}

/** Check the unbuilt site's local dependencies and complete static transfer budget. */
export async function checkSite(directory = defaultDirectory) {
  const root = resolve(directory);
  const files = await collectFiles(root);
  const fileSet = new Set(files);
  const errors = [];
  for (const filename of requiredFiles) {
    if (!fileSet.has(resolve(root, filename))) errors.push(`Missing site entry: ${filename}`);
  }

  let bytes = 0;
  let runtimeFiles = 0;
  for (const filename of files) {
    if (isDocumentation(filename.split(sep).at(-1))) continue;
    bytes += (await lstat(filename)).size;
    runtimeFiles += 1;
    if (!/\.(?:html?|css|[cm]?js)$/i.test(filename)) continue;
    const source = await readFile(filename, 'utf8');
    for (const reference of references(filename, source)) {
      try {
        const target = localTarget(root, filename, reference);
        if (target && !fileSet.has(target)) errors.push(`Missing local file: ${relative(root, filename)} → ${reference}`);
      } catch (error) {
        errors.push(error.message);
      }
    }
  }
  if (bytes > maximumBytes) errors.push(`Site exceeds 200000-byte budget: ${bytes} bytes (${bytes - maximumBytes} over).`);
  if (errors.length) throw new Error(errors.join('\n'));
  return { bytes, runtimeFiles };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkSite(process.argv[2]);
    console.log(`✓ Site valid: ${result.bytes} / ${maximumBytes} bytes in ${result.runtimeFiles} runtime files.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
