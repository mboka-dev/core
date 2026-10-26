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


def to_words(amount: int, currency: bool = True,
             orthographe: Literal["traditionnelle", "1990"] = "traditionnelle") -> str:
    """Amount in words: to_words(125000) == 'cent vingt-cinq mille francs CFA'.

    Specified by fixtures/money/to-words.json. Not implemented yet: see the open issue.
    """
    _check_amount(amount, "to_words")
    raise NotImplementedError(
        "money.to_words is not implemented yet. Contributions welcome: see fixtures/money/to-words.json"
    )
