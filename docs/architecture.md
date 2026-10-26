# Architecture

## Vue d'ensemble

```
core/  (github.com/mboka-dev/core)
├── data/                     ← SOURCE DE VÉRITÉ (JSON, licence CC BY 4.0)
│   ├── schema/               ← schémas JSON qui décrivent chaque fichier
│   ├── geo/                  ← départements, communes, arrondissements
│   └── phone/                ← plan de numérotation +242
├── fixtures/                 ← cas de test partagés : entrée → sortie attendue
│   ├── phone/  money/  text/  geo/
├── packages/
│   ├── js/                   ← @mboka-dev/core (TypeScript)
│   │   ├── src/              ← code
│   │   │   └── generated/data.ts ← GÉNÉRÉ depuis /data (ne pas éditer)
│   │   └── test/             ← lance les fixtures
│   └── py/                   ← mboka (Python, PyPI)
│       ├── src/mboka/
│       │   └── data/         ← COPIE générée de /data (ne pas éditer)
│       └── tests/            ← lance les mêmes fixtures
├── scripts/
│   ├── validate-data.mjs     ← schémas + règle « verifie ⇒ source et date »
│   ├── sync-data.mjs         ← recopie /data dans les deux paquets
│   ├── set-version.mjs       ← même numéro de version pour npm et PyPI
│   ├── create-labels.sh      ← crée les labels GitHub
│   └── create-issues.sh      ← crée les issues de départ depuis docs/issues/
├── docs/                     ← architecture, sourcing, release, atelier, issues de départ
└── .github/                  ← CI, release, modèles d'issues et de PR
```

## Les trois principes

### 1. Une seule source de données

Les données vivent dans `data/` et nulle part ailleurs. `npm run sync` les embarque dans les paquets : copie des JSON dans `packages/py/src/mboka/data/`, module typé généré dans `packages/js/src/generated/data.ts` (aucun import JSON, ce qui fonctionne partout : Node, navigateur, bundlers, ESM et CommonJS).

La CI vérifie que les copies sont à jour (`npm run sync -- --check`). Une PR qui modifie `data/` sans relancer la synchronisation échoue.

### 2. Des fixtures communes aux deux langages

Un fichier de `fixtures/` décrit un comportement, indépendamment du langage :

```json
{
  "function": "phone.parse",
  "status": "active",
  "cases": [
    { "name": "national avec espaces", "input": "06 123 45 67",
      "expected": { "valid": true, "e164": "+242061234567" } }
  ]
}
```

- `packages/js/test/fixtures.test.ts` et `packages/py/tests/test_fixtures.py` lisent **tous** les fichiers et exécutent chaque cas.
- `expected` est comparé partiellement : seules les clés présentes sont vérifiées.
- `"expectedError": true` attend une exception.
- `"options"` est passé en second argument.
- `"status": "pending"` : fichier ignoré par les tests. C'est ainsi qu'une fonctionnalité est spécifiée avant d'être codée (voir `fixtures/money/to-words.json`). Passer le statut à `active` fait partie de la PR qui l'implémente.

Conséquence : JS et Python ne peuvent pas diverger sans que la CI le voie.

### 3. La donnée porte sa preuve

Chaque entrée de données a un bloc `verification`. Voir [sourcing-des-donnees.md](sourcing-des-donnees.md).

## API publique

L'API est la même dans les deux langages, au style de nommage près (`isValid` en JS, `is_valid` en Python).

| Module | JS | Python |
|---|---|---|
| `phone` | `parse(input)`, `isValid(input)`, `format(input, style)` | `parse`, `is_valid`, `format` |
| `money` | `format(amount, options)`, `toWords(amount, options)` | `format`, `to_words` |
| `geo` | `departements()`, `communes(dep?)`, `arrondissements(commune?)`, `find(name)`, `normalizeName(name)` | `departements`, `communes`, `arrondissements`, `find`, `normalize_name` |
| `text` | `normalize(input)` | `normalize` |

Les fixtures utilisent le nom JS (`phone.isValid`). Le lanceur Python convertit en `snake_case`.

## Choix techniques

| Sujet | Choix | Raison |
|---|---|---|
| Dépendances d'exécution | **Aucune** | Paquet léger, utilisable partout, pas de faille héritée |
| JS | TypeScript, ESM + CommonJS, Node ≥ 22 (versions maintenues) | Compatible navigateurs, Next.js, Node |
| Tests JS | `node --test` sur le paquet compilé | Pas de framework à apprendre, on teste ce qui sera publié |
| Python | ≥ 3.10, `src/` layout, `pytest` | Standard actuel |
| Espace des milliers | U+202F (espace fine insécable) | Typographie française, pas de coupure de ligne au milieu d'un montant |
