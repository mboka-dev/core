---
title: "docs: site de démonstration sur GitHub Pages"
labels: docs, enhancement, help wanted, niveau: intermediaire
milestone: v0.3
---
## Contexte

Un développeur décide en trente secondes s'il essaie une bibliothèque. Un site où l'on tape un numéro et voit le résultat de `phone.parse`, ou un montant et voit son formatage, convainc plus vite qu'un README. C'est aussi une vitrine du projet à partager.

**Issue inter-parcours** : développement (Fullstack), contenus et accroche (Digital Marketing), priorisation et parcours utilisateur (Product Management).

## À faire

1. **PM** : définir en une page les 3 démonstrations prioritaires et le message principal du site.
2. **Fullstack** : créer `site/` avec une page HTML statique qui charge `@mboka-dev/core` depuis un CDN (jsDelivr ou esm.sh), sans étape de build. Démonstrations : saisie d'un numéro → résultat de `parse` ; saisie d'un montant → `format` ; liste des départements quand les données existent.
3. **Digital Marketing** : textes de la page en français, exemples parlants, aperçu de partage (balises Open Graph).
4. Déployer avec un workflow GitHub Pages qui publie `site/` à chaque fusion sur `main`.

## Contraintes

- Mobile d'abord, lisible à 360 px de large, page complète de moins de 200 Ko : beaucoup de visiteurs seront en 3G/4G.
- **Aucune collecte de données** : pas de traceur, pas d'envoi des numéros saisis. Tout se calcule dans le navigateur ; l'écrire sur la page.
- Lien vers le site dans le README et dans la description du dépôt GitHub.

## Critères d'acceptation

- [ ] Site en ligne à l'adresse GitHub Pages du dépôt
- [ ] Testé sur un vrai téléphone Android d'entrée de gamme (capture jointe à la PR)
- [ ] Revue croisée : au moins une personne de chaque parcours impliqué a approuvé la PR
