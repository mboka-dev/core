import re
import unicodedata

_LIGATURES = str.maketrans({"œ": "oe", "Œ": "OE", "æ": "ae", "Æ": "AE"})
_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def normalize(value: str) -> str:
    """Lowercase, no accents, any run of non-alphanumeric characters becomes one space.

    >>> normalize("Pointe-Noire")
    'pointe noire'
    """
    if not isinstance(value, str):
        raise TypeError("text.normalize expects a string")
    decomposed = unicodedata.normalize("NFD", value.translate(_LIGATURES))
    stripped = "".join(c for c in decomposed if not unicodedata.combining(c))
    return _NON_ALNUM.sub(" ", stripped.lower()).strip()
