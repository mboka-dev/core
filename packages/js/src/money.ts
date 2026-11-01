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

const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const TENS = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
const MAX_WORDS_AMOUNT = 999_999_999_999;

/** 0–99 in words. `final` is true when nothing but a noun follows (it decides "quatre-vingts"). */
function belowHundred(n: number, final: boolean): string {
  if (n <= 16) return UNITS[n]!;
  if (n < 20) return `dix-${UNITS[n - 10]}`;
  if (n >= 80) {
    const rest = n - 80;
    if (rest === 0) return final ? 'quatre-vingts' : 'quatre-vingt';
    return `quatre-vingt-${belowHundred(rest, false)}`;
  }
  let ten = Math.floor(n / 10);
  let rest = n % 10;
  // 70–79 is "soixante" + 10–19
  if (ten === 7) {
    ten = 6;
    rest += 10;
  }
  const word = TENS[ten]!;
  if (rest === 0) return word;
  if (rest === 1 || rest === 11) return `${word} et ${UNITS[rest]}`;
  return `${word}-${belowHundred(rest, false)}`;
}

/** 0–999 in words. `final` works as in belowHundred and also decides "cents". */
function belowThousand(n: number, final: boolean): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 0) return belowHundred(rest, final);
  const head = hundreds === 1 ? 'cent' : `${UNITS[hundreds]} cent`;
  if (rest === 0) return hundreds > 1 && final ? `${head}s` : head;
  return `${head} ${belowHundred(rest, final)}`;
}

/**
 * Amount in words: toWords(125000) === 'cent vingt-cinq mille francs CFA'.
 * Specified by fixtures/money/to-words.json. Supports 0 to 999 999 999 999.
 */
export function toWords(amount: number, options: ToWordsOptions = {}): string {
  assertAmount(amount, 'toWords');
  if (amount < 0 || amount > MAX_WORDS_AMOUNT) {
    throw new RangeError(`money.toWords expects an amount between 0 and ${MAX_WORDS_AMOUNT}`);
  }
  const { currency = true, orthographe = 'traditionnelle' } = options;
  // 1990 spelling links every numeral with hyphens; "million" and "milliard" are nouns and stay apart.
  const numeral = (words: string) => (orthographe === '1990' ? words.replace(/ /g, '-') : words);

  const billions = Math.floor(amount / 1_000_000_000);
  const millions = Math.floor(amount / 1_000_000) % 1000;
  const thousands = Math.floor(amount / 1000) % 1000;
  const units = amount % 1000;

  const parts: string[] = [];
  if (billions > 0) parts.push(`${numeral(belowThousand(billions, true))} milliard${billions > 1 ? 's' : ''}`);
  if (millions > 0) parts.push(`${numeral(belowThousand(millions, true))} million${millions > 1 ? 's' : ''}`);
  const small: string[] = [];
  if (thousands === 1) small.push('mille');
  else if (thousands > 1) small.push(`${belowThousand(thousands, false)} mille`);
  if (units > 0 || amount === 0) small.push(belowThousand(units, true));
  if (small.length > 0) parts.push(numeral(small.join(' ')));

  const words = parts.join(' ');
  if (!currency) return words;
  // "un million de francs": a round amount ending with a noun takes "de".
  const de = amount >= 1_000_000 && amount % 1_000_000 === 0 ? ' de' : '';
  return `${words}${de} ${amount <= 1 ? 'franc' : 'francs'} CFA`;
}
