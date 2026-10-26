"""Runs every active file in /fixtures against the Python package."""

import importlib
import json
import re
from pathlib import Path

import pytest

FIXTURES = Path(__file__).resolve().parents[3] / "fixtures"


def snake(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def collect():
    for path in sorted(FIXTURES.rglob("*.json")):
        fixture = json.loads(path.read_text(encoding="utf-8"))
        module_name, fn_name = fixture["function"].split(".")
        marks = [pytest.mark.skip(reason="pending fixture")] if fixture["status"] == "pending" else []
        for case in fixture["cases"]:
            yield pytest.param(module_name, snake(fn_name), case,
                               id=f'{path.relative_to(FIXTURES)}::{case["name"]}', marks=marks)


def assert_partial(actual, expected, path="result"):
    if isinstance(expected, dict):
        assert isinstance(actual, dict), f"{path}: expected an object, got {actual!r}"
        for key, value in expected.items():
            assert_partial(actual.get(key), value, f"{path}.{key}")
    else:
        assert actual == expected, f"{path}: {actual!r} != {expected!r}"
        assert type(actual) is type(expected) or expected is None, f"{path}: type {type(actual)} != {type(expected)}"


@pytest.mark.parametrize("module_name, fn_name, case", list(collect()))
def test_fixture(module_name, fn_name, case):
    module = importlib.import_module(f"mboka.{module_name}")
    fn = getattr(module, fn_name, None)
    assert callable(fn), f"mboka.{module_name}.{fn_name} is missing"

    def call():
        if "options" not in case:
            return fn(case["input"])
        options = case["options"]
        if isinstance(options, dict):
            return fn(case["input"], **{snake(k): v for k, v in options.items()})
        return fn(case["input"], options)

    if case.get("expectedError"):
        with pytest.raises(Exception):
            call()
    else:
        assert_partial(call(), case["expected"])
