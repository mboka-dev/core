const LIGATURES: Record<string, string> = { œ: 'oe', Œ: 'OE', æ: 'ae', Æ: 'AE' };

/**
 * Normalizes free text for comparison: lowercase, no accents,
 * any run of non-alphanumeric characters becomes a single space.
 *
 * normalize('Pointe-Noire') === 'pointe noire'
 */
export function normalize(input: string): string {
  if (typeof input !== 'string') throw new TypeError('text.normalize expects a string');
  return input
    .replace(/[œŒæÆ]/g, (c) => LIGATURES[c] ?? c)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
