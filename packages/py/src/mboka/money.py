from typing import Literal

NARROW_NBSP = " "
NBSP = " "


def _check_amount(amount: object, fn: str) -> int:
    if isinstance(amount, bool) or not isinstance(amount, (int, float)):
        raise TypeError(f"money.{fn} expects a number")
    if isinstance(amount, float):
        raise ValueError(f"money.{fn} expects an integer amount: the CFA franc has no subunit")
    return amount


def format(amount: int, label: str = "FCFA", separator: str = NARROW_NBSP) -> str:  # noqa: A001
    """format(125000) == '125 000 FCFA' (non-breaking spaces)."""
    value = _check_amount(amount, "format")
    sign = "-" if value < 0 else ""
    grouped = f"{abs(value):,}".replace(",", separator)
    return f"{sign}{grouped}{NBSP}{label}" if label else f"{sign}{grouped}"


_UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
          "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"]
_TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"]
_MAX_WORDS_AMOUNT = 999_999_999_999


def _below_hundred(n: int, final: bool) -> str:
    """0–99 in words. `final` is True when nothing but a noun follows (it decides "quatre-vingts")."""
    if n <= 16:
        return _UNITS[n]
    if n < 20:
        return f"dix-{_UNITS[n - 10]}"
    if n >= 80:
        rest = n - 80
        if rest == 0:
            return "quatre-vingts" if final else "quatre-vingt"
        return f"quatre-vingt-{_below_hundred(rest, False)}"
    ten, rest = divmod(n, 10)
    # 70–79 is "soixante" + 10–19
    if ten == 7:
        ten, rest = 6, rest + 10
    word = _TENS[ten]
    if rest == 0:
        return word
    if rest in (1, 11):
        return f"{word} et {_UNITS[rest]}"
    return f"{word}-{_below_hundred(rest, False)}"


def _below_thousand(n: int, final: bool) -> str:
    """0–999 in words. `final` works as in _below_hundred and also decides "cents"."""
    hundreds, rest = divmod(n, 100)
    if hundreds == 0:
        return _below_hundred(rest, final)
    head = "cent" if hundreds == 1 else f"{_UNITS[hundreds]} cent"
    if rest == 0:
        return f"{head}s" if hundreds > 1 and final else head
    return f"{head} {_below_hundred(rest, final)}"


def to_words(amount: int, currency: bool = True,
             orthographe: Literal["traditionnelle", "1990"] = "traditionnelle") -> str:
    """Amount in words: to_words(125000) == 'cent vingt-cinq mille francs CFA'.

    Specified by fixtures/money/to-words.json. Supports 0 to 999 999 999 999.
    """
    value = _check_amount(amount, "to_words")
    if value < 0 or value > _MAX_WORDS_AMOUNT:
        raise ValueError(f"money.to_words expects an amount between 0 and {_MAX_WORDS_AMOUNT}")

    # 1990 spelling links every numeral with hyphens; "million" and "milliard" are nouns and stay apart.
    def numeral(words: str) -> str:
        return words.replace(" ", "-") if orthographe == "1990" else words

    billions = value // 1_000_000_000
    millions = value // 1_000_000 % 1000
    thousands = value // 1000 % 1000
    units = value % 1000

    parts = []
    if billions > 0:
        parts.append(f"{numeral(_below_thousand(billions, True))} milliard{'s' if billions > 1 else ''}")
    if millions > 0:
        parts.append(f"{numeral(_below_thousand(millions, True))} million{'s' if millions > 1 else ''}")
    small = []
    if thousands == 1:
        small.append("mille")
    elif thousands > 1:
        small.append(f"{_below_thousand(thousands, False)} mille")
    if units > 0 or value == 0:
        small.append(_below_thousand(units, True))
    if small:
        parts.append(numeral(" ".join(small)))

    words = " ".join(parts)
    if not currency:
        return words
    # "un million de francs": a round amount ending with a noun takes "de".
    de = " de" if value >= 1_000_000 and value % 1_000_000 == 0 else ""
    return f"{words}{de} {'franc' if value <= 1 else 'francs'} CFA"
