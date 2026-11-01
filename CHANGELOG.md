# Changelog

Toutes les évolutions notables sont consignées ici. Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté
- `money.toWords` / `money.to_words` : montant en lettres en français (orthographe traditionnelle par défaut, option `orthographe: '1990'`), de 0 à 999 999 999 999 (#10).

## [0.0.1] - 26 Oct. 2026

### Ajouté
- Structure du dépôt : données sourcées, fixtures partagées, paquets JS et Python.
- `phone.parse`, `phone.isValid`, `phone.format` (plan de numérotation encore `a_verifier`).
- `money.format` (FCFA / XAF).
- `text.normalize`.
- `geo.departements`, `geo.communes`, `geo.arrondissements`, `geo.find` (correspondance exacte).
- Fixtures en attente pour `money.toWords`.

## [0.0.2] - 26 Oct. 2026

### Modifié
- Première version publiée depuis GitHub Actions : provenance npm vérifiable, aucun changement de code.
