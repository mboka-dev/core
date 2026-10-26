export interface FormatOptions {
  /** Text after the amount. Default 'FCFA'. Use 'XAF' for the ISO code, '' for none. */
  label?: string;
  /** Thousands separator. Default U+202F (narrow no-break space). */
  separator?: string;
}

export interface ToWordsOptions {
  /** Append "franc(s) CFA". Default true. */
  currency?: boolean;
  /** 'traditionnelle' (default) or '1990' (hyphens between all numerals). */
  orthographe?: 'traditionnelle' | '1990';
}

function assertAmount(amount: unknown, fn: string): asserts amount is number {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new TypeError(`money.${fn} expects a finite number`);
  }
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`money.${fn} expects an integer amount: the CFA franc has no subunit`);
  }
}

/** money.format(125000) === '125 000 FCFA' (with non-breaking spaces) */
export function format(amount: number, options: FormatOptions = {}): string {
  assertAmount(amount, 'format');
  const { label = 'FCFA', separator = ' ' } = options;
  const sign = amount < 0 ? '-' : '';
  const grouped = Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return label ? `${sign}${grouped} ${label}` : `${sign}${grouped}`;
}

/**
 * Amount in words: toWords(125000) === 'cent vingt-cinq mille francs CFA'.
 * Specified by fixtures/money/to-words.json. Not implemented yet: see the open issue.
 */
export function toWords(amount: number, _options: ToWordsOptions = {}): string {
  assertAmount(amount, 'toWords');
  throw new Error('money.toWords is not implemented yet. Contributions welcome: see fixtures/money/to-words.json');
}
