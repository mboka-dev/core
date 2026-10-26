---
title: "feat(holidays): jours fériés du Congo-Brazzaville, dates fixes et mobiles"
labels: data, besoin-source, js, python, fixtures, enhancement, niveau: avance
milestone: v0.4
---
## Contexte

Calcul de délais de livraison, d'échéances de paiement, de jours ouvrés, planning de formation : toutes ces applications ont besoin de la liste des jours fériés. Certains tombent à date fixe, d'autres dépendent de la date de Pâques et changent chaque année.

## À faire

**1. Les données (sourcées).** Trouver le texte officiel en vigueur qui fixe les jours fériés et chômés. Créer `data/holidays/jours-feries.json` avec son schéma `data/schema/jours-feries.schema.json` : pour chaque jour, nom officiel, règle (date fixe `MM-JJ` ou décalage en jours par rapport à Pâques) et bloc `verification`.

**2. Le calcul de Pâques.** Implémenter le calcul de la date de Pâques grégorienne (algorithme dit « de Meeus/Jones/Butcher », documenté publiquement), sans dépendance externe. Les fêtes mobiles s'en déduisent : par exemple lundi de Pâques = Pâques + 1, Ascension = Pâques + 39, lundi de Pentecôte = Pâques + 50, si le texte officiel les retient.

**3. L'API, nouveau module `holidays`.**

```ts
holidays.list(2027)               // [{ date: '2027-01-01', nom: '…' }, …] triés par date
holidays.isHoliday('2027-03-29')  // true ou false selon les données
holidays.easter(2026)             // '2026-04-05'
```

**4. Les fixtures**, dont des dates de Pâques connues : 2024-03-31, 2025-04-20, 2026-04-05, 2027-03-28. Couvrir au moins 10 années, dont des années limites (Pâques au plus tôt et au plus tard dans le siècle).

## Attention

- Ajouter le nouveau fichier de données au tableau `types` de `scripts/sync-data.mjs`, sinon la synchronisation échoue.
- Un jour férié tombant un dimanche est-il reporté ? Ne rien supposer : suivre le texte officiel et le documenter.

## Critères d'acceptation

- [ ] Toutes les entrées de données `verifie`, avec source
- [ ] `holidays.easter` exact sur au moins 30 années, vérifiées contre une source indépendante citée dans la PR
- [ ] Même API en JS et en Python, fixtures vertes
