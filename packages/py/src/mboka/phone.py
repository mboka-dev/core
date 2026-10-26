import re
from typing import Any, Literal, Optional, TypedDict

from ._data import load

InvalidReason = Literal["empty", "invalid_characters", "foreign_number", "length", "unknown_prefix"]
FormatStyle = Literal["national", "international", "e164"]

_SEPARATORS = re.compile(r"[\s().\-/]")
_DIGITS = re.compile(r"^\+?[0-9]+$")


class ParsedPhone(TypedDict):
    input: str
    valid: bool
    e164: Optional[str]
    national: Optional[str]
    international: Optional[str]
    operator: Optional[str]
    type: Optional[str]
    reason: Optional[InvalidReason]


def _plan() -> Any:
    return load("phone/numerotation.json")


def _group(digits: str) -> str:
    sizes = _plan().get("nationalGrouping") or [len(digits)]
    parts, i = [], 0
    for size in sizes:
        if i >= len(digits):
            break
        parts.append(digits[i : i + size])
        i += size
    if i < len(digits):
        parts.append(digits[i:])
    return " ".join(parts)


def _invalid(value: str, reason: InvalidReason) -> ParsedPhone:
    return ParsedPhone(input=value, valid=False, e164=None, national=None, international=None,
                       operator=None, type=None, reason=reason)


def parse(value: str) -> ParsedPhone:
    """Parse any common way of writing a Congo-Brazzaville number. Only raises on non-strings."""
    if not isinstance(value, str):
        raise TypeError("phone.parse expects a string")

    plan = _plan()
    cc, length = plan["countryCode"], plan["nationalNumberLength"]

    compact = _SEPARATORS.sub("", value)
    if compact == "":
        return _invalid(value, "empty")
    if not _DIGITS.match(compact):
        return _invalid(value, "invalid_characters")

    if compact.startswith("+") or compact.startswith("00"):
        rest = compact[1:] if compact.startswith("+") else compact[2:]
        if not rest.startswith(cc):
            return _invalid(value, "foreign_number")
        national = rest[len(cc):]
    elif compact.startswith(cc) and len(compact) == len(cc) + length:
        national = compact[len(cc):]
    else:
        national = compact

    if len(national) != length:
        return _invalid(value, "length")

    prefix = next((p for p in plan["prefixes"] if national.startswith(p["prefix"])), None)
    if prefix is None:
        return _invalid(value, "unknown_prefix")

    grouped = _group(national)
    return ParsedPhone(input=value, valid=True, e164=f"+{cc}{national}", national=grouped,
                       international=f"+{cc} {grouped}", operator=prefix.get("operator"),
                       type=prefix["type"], reason=None)


def is_valid(value: str) -> bool:
    return isinstance(value, str) and parse(value)["valid"]


def format(value: str, style: FormatStyle = "national") -> str:  # noqa: A001 - mirrors the JS API
    """Format a number in the requested style. Raises ValueError if the number is invalid."""
    parsed = parse(value)
    if not parsed["valid"]:
        raise ValueError(f'Invalid +242 number ({parsed["reason"]}): "{value}"')
    if style == "national":
        return parsed["national"]  # type: ignore[return-value]
    if style == "international":
        return parsed["international"]  # type: ignore[return-value]
    if style == "e164":
        return parsed["e164"]  # type: ignore[return-value]
    raise ValueError(f'Unknown format style "{style}". Use national, international or e164.')
