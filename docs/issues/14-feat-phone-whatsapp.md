---
title: "feat(phone): phone.whatsappLink() pour générer un lien wa.me"
labels: js, python, fixtures, enhancement, good first issue, niveau: accessible
milestone: v0.2
---
## Contexte

Au Congo, beaucoup de commerces et de services se contactent d'abord par WhatsApp. Un bouton « Écrire sur WhatsApp » demande un lien `https://wa.me/<numéro>` au format international, sans `+` ni espaces. Mal formaté, le lien ouvre une conversation vide ou un numéro inexistant.

## API proposée

```ts
phone.whatsappLink('06 123 45 67')
// 'https://wa.me/242061234567'

phone.whatsappLink('06 123 45 67', 'Bonjour, je veux commander')
// 'https://wa.me/242061234567?text=Bonjour%2C%20je%20veux%20commander'

phone.whatsappLink('123')   // lève une erreur
```

## À faire

1. Écrire `fixtures/phone/whatsapp-link.json` : au moins 6 cas, dont un message avec accents et caractères spéciaux (`é`, `&`, `?`, retour à la ligne).
2. Implémenter en s'appuyant sur `phone.parse` : ne pas réécrire la validation.
3. Encodage du message : `encodeURIComponent` en JS, `urllib.parse.quote` en Python. **Piège** : ces deux fonctions n'échappent pas exactement les mêmes caractères (par exemple `!'()*`). Choisir une règle commune, la fixer dans les fixtures et faire produire le même résultat aux deux langages.

## Critères d'acceptation

- [ ] Fixtures vertes en JS et Python
- [ ] Aucun lien généré pour un numéro invalide
- [ ] Exemple d'utilisation dans le README (bouton HTML)

Bonne première PR de code : la fonction tient en quelques lignes, l'intérêt est dans les cas limites de l'encodage.
