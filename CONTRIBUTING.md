# Contribuer

Merci de votre intérêt. Ce guide suffit pour passer de zéro à une PR fusionnée. Si un passage vous bloque, c'est le guide qui est à corriger : dites-le dans une issue.

## 1. Choisir une issue

1. Parcourez les issues étiquetées [`good first issue`](../../issues?q=is%3Aopen+label%3A%22good+first+issue%22) (première contribution) ou `help wanted`.
2. Commentez « Je prends » sur l'issue. Un mainteneur vous l'assigne.
3. Sans activité de votre part pendant **14 jours**, l'issue est libérée pour quelqu'un d'autre. Ce n'est pas une sanction.

Une idée qui n'a pas d'issue ? Ouvrez-en une **avant** de coder, pour en discuter.

## 2. Préparer son poste

Prérequis : Git, Node.js 22 ou plus, Python 3.10 ou plus.

```bash
# 1. Forkez le dépôt sur GitHub (bouton "Fork"), puis :
git clone https://github.com/<votre-compte>/core.git
cd core
git remote add upstream https://github.com/mboka-dev/core.git

# 2. Installer et vérifier que tout passe AVANT de modifier quoi que ce soit
npm install
npm run check          # valide les données + tests JS + tests Python
```

Pour Python seul :

```bash
cd packages/py
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -e ".[dev]"
pytest
```

## 3. Travailler

```bash
git checkout main && git pull upstream main
git checkout -b feat/12-formatage-international    # numéro de l'issue dans le nom
```

Règles :

- **Les données d'abord.** Une information (préfixe, nom de commune…) se modifie dans `data/`, jamais en dur dans le code. Puis `npm run sync` recopie les données dans les paquets.
- **Les tests d'abord.** Un comportement se décrit dans `fixtures/` (entrée → sortie attendue). Les deux paquets lisent les mêmes fixtures : ajouter un cas le teste en JS et en Python d'un coup.
- **Une PR = une issue.** Petite et lisible, c'est ce qui se relit vite.
- **Code et commentaires en anglais, documentation en français.**
- **Lance `npm run format` avant de commiter pour formater le code.**

## 4. Messages de commit

Format [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
feat(phone): detect operator from national prefix
fix(money): keep "cent" invariable before "mille"
data(geo): add Pointe-Noire arrondissements with source
docs: add English README
test(fixtures): add edge cases for 00242 prefix
```

Types utilisés : `feat`, `fix`, `data`, `docs`, `test`, `refactor`, `ci`, `chore`.

## 5. Ouvrir la Pull Request

```bash
npm run check                  # doit être vert localement
git push origin feat/12-formatage-international
```

Sur GitHub, ouvrez la PR vers `mboka-dev/core:main` et remplissez le modèle. Écrivez `Closes #12` pour lier l'issue.

**Revue** : un mainteneur relit sous 7 jours. Les commentaires portent sur le code, jamais sur la personne. Répondez à chacun, poussez vos corrections sur la même branche : la PR se met à jour toute seule.

## 6. Modifier des données : la règle de la source

Toute entrée marquée `"status": "verifie"` doit citer une source vérifiable et une date. La CI refuse sinon. Si vous n'avez pas de source fiable, ajoutez l'entrée en `"a_verifier"` et dites-le dans la PR. Détails : [docs/sourcing-des-donnees.md](docs/sourcing-des-donnees.md).

## 7. Identité Git

Utilisez **un seul compte Git** pour vos commits, celui de votre profil GitHub, et vérifiez-le :

```bash
git config user.name
git config user.email
```

Si vous avez déjà commité avec un autre compte ou une autre adresse, ajoutez-la à votre profil GitHub (Settings → Emails) **et** dans `.mailmap` via votre PR. Sinon vos contributions ne vous seront pas attribuées.

## 8. Comportement attendu

Ce projet applique le [code de conduite](CODE_OF_CONDUCT.md). En contribuant, vous l'acceptez.
