"""Loads the JSON files shipped in the package (copied from /data by `npm run sync`)."""

import json
from functools import cache
from importlib.resources import files
from typing import Any


@cache
def load(relative_path: str) -> Any:
    resource = files("mboka").joinpath("data", *relative_path.split("/"))
    content = json.loads(resource.read_text(encoding="utf-8"))
    content.pop("$schema", None)
    return content
