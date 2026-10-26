import copy
from typing import Any, Literal, Optional

from ._data import load
from .text import normalize

Level = Literal["departement", "commune", "arrondissement"]
_FILES: dict[str, str] = {
    "departement": "geo/departements.json",
    "commune": "geo/communes.json",
    "arrondissement": "geo/arrondissements.json",
}


def _items(level: str) -> list[dict[str, Any]]:
    return load(_FILES[level])["items"]


def departements() -> list[dict[str, Any]]:
    return copy.deepcopy(_items("departement"))


def communes(departement_id: Optional[str] = None) -> list[dict[str, Any]]:
    items = _items("commune")
    if departement_id:
        items = [c for c in items if c["departement"] == departement_id]
    return copy.deepcopy(items)


def arrondissements(commune_id: Optional[str] = None) -> list[dict[str, Any]]:
    items = _items("arrondissement")
    if commune_id:
        items = [a for a in items if a["commune"] == commune_id]
    return copy.deepcopy(items)


def find_all(name: str, level: Optional[Level] = None) -> list[dict[str, Any]]:
    """All entries whose official name or alias matches, in order: départements, communes, arrondissements."""
    needle = normalize(name)
    if not needle:
        return []
    results = []
    for lvl in _FILES:
        if level and level != lvl:
            continue
        for entry in _items(lvl):
            if any(normalize(n) == needle for n in [entry["nom"], *entry["aliases"]]):
                results.append({"level": lvl, **copy.deepcopy(entry)})
    return results


def find(name: str, level: Optional[Level] = None) -> Optional[dict[str, Any]]:
    """First exact match after normalization, or None. Fuzzy matching is planned for v0.3."""
    matches = find_all(name, level)
    return matches[0] if matches else None


def normalize_name(name: str) -> Optional[str]:
    """Official name for a free-text input, or None if unknown. Handy to clean a data column."""
    match = find(name)
    return match["nom"] if match else None
