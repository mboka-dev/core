import { numerotation as plan } from './generated/data.js';
import type { PhonePrefix } from './types.js';

export type InvalidReason = 'empty' | 'invalid_characters' | 'foreign_number' | 'length' | 'unknown_prefix';
export type FormatStyle = 'national' | 'international' | 'e164';

export interface ParsedPhone {
  input: string;
  valid: boolean;
  /** +242061234567 */
  e164: string | null;
  /** 06 123 45 67 */
  national: string | null;
  /** +242 06 123 45 67 */
  international: string | null;
  operator: string | null;
  type: PhonePrefix['type'] | null;
  reason: InvalidReason | null;
}

const SEPARATORS = /[\s().\-/]/g;

function group(digits: string): string {
  const sizes = plan.nationalGrouping ?? [digits.length];
  const parts: string[] = [];
  let i = 0;
  for (const size of sizes) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(' ');
}

function invalid(input: string, reason: InvalidReason): ParsedPhone {
  return { input, valid: false, e164: null, national: null, international: null, operator: null, type: null, reason };
}

/** Parses any common way of writing a Congo-Brazzaville number. Never throws on bad numbers, only on non-strings. */
export function parse(input: string): ParsedPhone {
  if (typeof input !== 'string') throw new TypeError('phone.parse expects a string');

  const compact = input.replace(SEPARATORS, '');
  if (compact === '') return invalid(input, 'empty');
  if (!/^\+?[0-9]+$/.test(compact)) return invalid(input, 'invalid_characters');

  const cc = plan.countryCode;
  const length = plan.nationalNumberLength;
  let national: string;

  if (compact.startsWith('+') || compact.startsWith('00')) {
    const rest = compact.startsWith('+') ? compact.slice(1) : compact.slice(2);
    if (!rest.startsWith(cc)) return invalid(input, 'foreign_number');
    national = rest.slice(cc.length);
  } else if (compact.startsWith(cc) && compact.length === cc.length + length) {
    national = compact.slice(cc.length);
  } else {
    national = compact;
  }

  if (national.length !== length) return invalid(input, 'length');

  const prefix = plan.prefixes.find((p) => national.startsWith(p.prefix));
  if (!prefix) return invalid(input, 'unknown_prefix');

  const grouped = group(national);
  return {
    input,
    valid: true,
    e164: `+${cc}${national}`,
    national: grouped,
    international: `+${cc} ${grouped}`,
    operator: prefix.operator ?? null,
    type: prefix.type,
    reason: null,
  };
}

export function isValid(input: string): boolean {
  return typeof input === 'string' && parse(input).valid;
}

/** Formats a number in the requested style. Throws if the number is invalid. */
export function format(input: string, style: FormatStyle = 'national'): string {
  const parsed = parse(input);
  if (!parsed.valid) throw new Error(`Invalid +242 number (${parsed.reason}): "${input}"`);
  switch (style) {
    case 'national':
      return parsed.national!;
    case 'international':
      return parsed.international!;
    case 'e164':
      return parsed.e164!;
    default:
      throw new Error(`Unknown format style "${String(style)}". Use national, international or e164.`);
  }
}
