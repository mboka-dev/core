---
title: "feat(text): text.slugify() pour fabriquer des identifiants d'URL"
labels: js, python, fixtures, enhancement, good first issue, niveau: accessible
milestone: v0.2
---
## Contexte

Une page « Pointe-Noire, 3e arr. » doit vivre à une adresse comme `/villes/pointe-noire-3e-arr`. Fabriquer ces identifiants (*slugs*) à la main produit des liens cassés dès qu'un nom contient un accent ou une apostrophe.

## API proposée

```ts
text.slugify('Pointe-Noire, 3e arr.')   // 'pointe-noire-3e-arr'
text.slugify("Mfilou-Ngamaba")          // 'mfilou-ngamaba'
text.slugify('  Cœur de Ouésso  ')      // 'coeur-de-ouesso'
text.slugify('')                        // ''
```

## À faire

1. Écrire `fixtures/text/slugify.json` : au moins 8 cas.
2. Implémenter en réutilisant `text.normalize` : un slug est la forme normalisée, espaces remplacés par des tirets. Pas de nouvelle logique de suppression des accents.
3. Le faire en JS et en Python.

## Critères d'acceptation

- [ ] Fixtures vertes dans les deux langages
- [ ] La fonction appelle `normalize` au lieu de dupliquer son code
- [ ] Aucun tiret en début ou en fin, jamais deux tirets consécutifs

Première PR de code idéale : la fonction tient en une ou deux lignes. L'exercice consiste à lire `normalize`, à le réutiliser et à suivre le circuit fixtures → JS → Python → PR.
