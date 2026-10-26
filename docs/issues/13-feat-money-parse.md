---
title: "feat(money): money.parse() pour lire un montant saisi en texte"
labels: js, python, fixtures, enhancement, niveau: intermediaire
milestone: v0.2
---
## Contexte

`money.format(125000)` produit « 125 000 FCFA ». L'opération inverse manque : lire un montant saisi par un humain, copié depuis un reçu, un SMS de paiement ou un tableur. Chaque application de caisse, de facturation ou de cotisation en a besoin.

## API proposée

```ts
money.parse('125 000 FCFA')   // 125000
money.parse('125.000 F CFA')  // 125000
money.parse('125000F')        // 125000
money.parse('125 000 XAF')    // 125000
money.parse('-1 500')         // -1500
money.parse('12,50')          // lève une erreur : pas de centimes en FCFA
money.parse('abc')            // lève une erreur
```

## À faire

1. Écrire d'abord `fixtures/money/parse.json` : au moins 12 cas, dont espaces insécables (U+00A0, U+202F), point ou espace comme séparateur de milliers, libellés `FCFA`, `F CFA`, `CFA`, `F`, `XAF`, `francs`, montants négatifs et erreurs.
2. Décider et documenter les cas ambigus dans la PR : « 1.500 » vaut-il 1500 ou est-ce une erreur ? « 125k » est-il accepté ?
3. Implémenter en TypeScript et en Python.
4. Ajouter un test d'aller-retour : pour une série de montants, `parse(format(n)) === n`.

## Critères d'acceptation

- [ ] Fixtures vertes en JS et Python
- [ ] Aller-retour vérifié sur au moins 20 montants, dont 0, des négatifs et des millions
- [ ] Les choix sur les cas ambigus sont écrits dans le README
