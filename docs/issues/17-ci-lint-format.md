---
title: "ci: vérifier le style du code en CI (linter et formateur)"
labels: ci, js, python, niveau: intermediaire
milestone: v0.3
---
## Contexte

Aujourd'hui, le style du code dépend de chaque contributeur. En revue, on finit par commenter des espaces et des guillemets au lieu du fond. Un linter et un formateur automatiques règlent ça une fois pour toutes.

## À faire

1. **Choisir les outils** et justifier le choix dans l'issue avant de coder. Pistes : Biome (un seul outil pour JS/TS) ou ESLint + Prettier ; Ruff pour Python (linter et formateur).
2. Configurer, en dépendances de développement uniquement : aucune dépendance ajoutée aux paquets publiés.
3. Ajouter `npm run lint` et `npm run format`, et une étape `lint` dans la CI.
4. **Reformater le code existant dans un commit à part**, sans aucun autre changement, puis ajouter son identifiant dans un fichier `.git-blame-ignore-revs`. Ainsi, `git blame` continue de montrer le vrai auteur de chaque ligne.
5. Documenter dans `CONTRIBUTING.md` : lancer `npm run format` avant de commiter.

## Critères d'acceptation

- [ ] La CI échoue sur une erreur de style (démontré dans la PR)
- [ ] Le commit de reformatage ne change aucun comportement : tous les tests passent avant et après
- [ ] `.git-blame-ignore-revs` présent et expliqué
