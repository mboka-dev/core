# mboka

*« Le pays, chez soi » en lingala.* Données et utilitaires locaux pour les développeurs qui construisent des applications au Congo-Brazzaville : numéros de téléphone +242, découpage territorial, montants en FCFA.

Un seul jeu de données sourcé, deux paquets : **JavaScript/TypeScript** (`@mboka-dev/core`) et **Python** (`mboka`).

> Projet initié et maintenu par **Euloge, Akieni Academy**, ouvert à tous les contributeurs. Statut : **pré-version (v0.x)**, l'API peut encore changer.

**Démonstration :** [essayer Mboka dans le navigateur](https://mboka-dev.github.io/core/) — adresse de publication du dossier `site/`, après activation de GitHub Pages. Le [guide du site](site/README.md) explique comment le lancer localement et le publier.

## Pourquoi

Chaque site marchand, formulaire d'inscription ou application de paiement recode les mêmes briques : accepter « 06 123 45 67 » comme « +242061234567 », proposer la bonne liste d'arrondissements, écrire un montant en lettres sur une facture. Ce projet les fournit une fois, testées, avec des données dont chaque ligne cite sa source.

## Installation

```bash
npm install @mboka-dev/core
pip install mboka
```

## Exemples

### JavaScript / TypeScript

```ts
import { phone, money, geo, text } from '@mboka-dev/core';

phone.parse('06 123 45 67');
// { valid: true, e164: '+242061234567', national: '06 123 45 67',
//   international: '+242 06 123 45 67', operator: 'MTN', reason: null }

money.format(125000);            // '125 000 FCFA' (espace fine insécable)
money.format(125000, { label: 'XAF' }); // '125 000 XAF'

geo.departements();              // liste des départements
geo.find('Pte-Noire');           // entrée correspondante, variantes tolérées

text.normalize('Pointe-Noire');  // 'pointe noire'
```

### Python

```python
from mboka import phone, money, geo, text

phone.parse("+242 06 123 45 67")["e164"]   # '+242061234567'
money.format(125000)                        # '125 000 FCFA'
df["ville"] = df["ville_saisie"].map(geo.normalize_name)
```

## Ce qui est disponible

| Module | Fonction | Statut |
|---|---|---|
| `phone` | `parse`, `isValid`, `format` | v0.1 |
| `money` | `format` | v0.1 |
| `money` | `toWords` (montant en lettres) | en cours, voir les issues |
| `geo` | `departements`, `communes`, `arrondissements`, `find` | v0.1 (exact), recherche floue en cours |
| `text` | `normalize` | v0.1 |

La feuille de route complète est dans [ROADMAP.md](ROADMAP.md).

## Fiabilité des données

Chaque entrée de `data/` porte un bloc `verification` :

```json
"verification": { "status": "verifie", "source": "…", "verifiedAt": "2026-11-02" }
```

- `verifie` : la source et la date sont obligatoires, la CI le contrôle.
- `a_verifier` : l'entrée est provisoire. Elle est utilisable, mais une release stable (v1.0) ne peut pas être publiée tant qu'il en reste.

Une erreur dans les données ? Ouvrez une issue **Correction de données** en citant votre source. Voir [docs/sourcing-des-donnees.md](docs/sourcing-des-donnees.md).

## Contribuer

Les contributions sont bienvenues, quel que soit votre niveau. Commencez par [CONTRIBUTING.md](CONTRIBUTING.md) puis choisissez une issue étiquetée `good first issue`.

## Licences

- Code : [MIT](LICENSE)
- Données (`data/`) : [CC BY 4.0](DATA_LICENSE.md), attribution « mboka, Euloge, Akieni Academy et contributeurs »
