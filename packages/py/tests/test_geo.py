from mboka import geo


def test_lists_are_lists():
    assert isinstance(geo.departements(), list)
    assert isinstance(geo.communes(), list)
    assert isinstance(geo.arrondissements(), list)


def test_returned_data_cannot_mutate_shipped_data():
    first = geo.departements()
    first.append({"id": "fake"})
    assert len(geo.departements()) != len(first)


def test_unknown_or_empty_names_return_none():
    assert geo.find("Atlantis") is None
    assert geo.find("   ") is None
    assert geo.normalize_name("Atlantis") is None
