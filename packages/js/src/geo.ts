import { departements as depFile, communes as comFile, arrondissements as arrFile } from './generated/data.js';
import type { Arrondissement, Commune, Departement } from './types.js';
import { normalize } from './text.js';

export type Level = 'departement' | 'commune' | 'arrondissement';
export type GeoMatch =
  | ({ level: 'departement' } & Departement)
  | ({ level: 'commune' } & Commune)
  | ({ level: 'arrondissement' } & Arrondissement);

// Data is plain JSON, so a JSON round-trip is a safe deep copy in every runtime.
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function departements(): Departement[] {
  return clone(depFile.items);
}

export function communes(departementId?: string): Commune[] {
  const items = departementId ? comFile.items.filter((c) => c.departement === departementId) : comFile.items;
  return clone(items);
}

export function arrondissements(communeId?: string): Arrondissement[] {
  const items = communeId ? arrFile.items.filter((a) => a.commune === communeId) : arrFile.items;
  return clone(items);
}

function matches(entry: { nom: string; aliases: string[] }, needle: string): boolean {
  return [entry.nom, ...entry.aliases].some((n) => normalize(n) === needle);
}

/** All entries whose official name or alias matches, in order: départements, communes, arrondissements. */
export function findAll(name: string, options: { level?: Level } = {}): GeoMatch[] {
  const needle = normalize(name);
  if (!needle) return [];
  const results: GeoMatch[] = [];
  const want = (level: Level) => !options.level || options.level === level;
  if (want('departement')) for (const d of depFile.items) if (matches(d, needle)) results.push({ level: 'departement', ...clone(d) });
  if (want('commune')) for (const c of comFile.items) if (matches(c, needle)) results.push({ level: 'commune', ...clone(c) });
  if (want('arrondissement')) for (const a of arrFile.items) if (matches(a, needle)) results.push({ level: 'arrondissement', ...clone(a) });
  return results;
}

/** First match (exact, after normalization), or null. Fuzzy matching is planned for v0.3. */
export function find(name: string, options: { level?: Level } = {}): GeoMatch | null {
  return findAll(name, options)[0] ?? null;
}

/** Official name for a free-text input, or null if unknown. Handy to clean a data column. */
export function normalizeName(name: string): string | null {
  return find(name)?.nom ?? null;
}
