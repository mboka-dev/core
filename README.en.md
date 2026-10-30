[🇫🇷 Français](README.md) · [🇬🇧 English](README.en.md)

# mboka

*"The country, at home"* in Lingala. Data and local utilities for developers building applications in Congo-Brazzaville: +242 phone numbers, territorial divisions, amounts in CFA francs.

A single source of data, two packages: **JavaScript/TypeScript** (`@mboka-dev/core`) and **Python** (`mboka`).

> Project initiated and maintained by **Euloge, Akieni Academy**, open to all contributors. Status: **pre-release (v0.x)**, the API may still change.

## Why

Every online store, registration form, or payment application reimplements the same building blocks: accepting "06 123 45 67" as well as "+242061234567", offering the correct list of arrondissements, or writing an amount in words on an invoice. This project provides them once, tested, with data where each line cites its source.

## Installation

```bash
npm install @mboka-dev/core
pip install mboka
```

## Examples

### JavaScript / TypeScript

```ts
import { phone, money, geo, text } from '@mboka-dev/core';

phone.parse('06 123 45 67');
// { valid: true, e164: '+242061234567', national: '06 123 45 67',
//   international: '+242 06 123 45 67', operator: 'MTN', reason: null }

money.format(125000);            // '125 000 FCFA' (thin non-breaking space)
money.format(125000, { label: 'XAF' }); // '125 000 XAF'

geo.departements();              // list of departments
geo.find('Pte-Noire');           // matching entry, variants accepted

text.normalize('Pointe-Noire');  // 'pointe noire'
```

### Python

```python
from mboka import phone, money, geo, text

phone.parse("+242 06 123 45 67")["e164"]   # '+242061234567'
money.format(125000)                        # '125 000 FCFA'
df["ville"] = df["ville_saisie"].map(geo.normalize_name)
```

## What's available

| Module | Function | Status |
|---|---|---|
| `phone` | `parse`, `isValid`, `format` | v0.1 |
| `money` | `format` | v0.1 |
| `money` | `toWords` (amount in words) | in progress, see issues |
| `geo` | `departements`, `communes`, `arrondissements`, `find` | v0.1 (exact), fuzzy search in progress |
| `text` | `normalize` | v0.1 |

The full roadmap is in [ROADMAP.md](ROADMAP.md).

## Data reliability

Each entry in `data/` has a `verification` block:

```json
"verification": { "status": "verifie", "source": "…", "verifiedAt": "2026-11-02" }
```

- `verifie`: source and date are required, enforced by CI.
- `a_verifier`: entry is provisional. It is usable, but a stable release (v1.0) cannot be published as long as any remain.

Found an error in the data? Open a **Data correction** issue citing your source. See [docs/sourcing-des-donnees.md](docs/sourcing-des-donnees.md).

## Contributing

Contributions are welcome, no matter your skill level. Start with [CONTRIBUTING.md](CONTRIBUTING.md) then pick an issue labeled `good first issue`.

## Licenses

- Code: [MIT](LICENSE)
- Data (`data/`): [CC BY 4.0](DATA_LICENSE.md), attribution "mboka, Euloge, Akieni Academy and contributors"
