# Cadrage du site de démonstration

## Objectif et public

Permettre à un développeur de comprendre l'utilité de Mboka et d'essayer ses fonctions sans installation. Le site présente la bibliothèque du dépôt `mboka-dev/core`, et non l'ensemble de l'organisation. Il doit rester utilisable sur un téléphone Android modeste et une connexion mobile.

**Message principal :** « Des données et des outils locaux pour vos applications au Congo-Brazzaville. »

Le premier écran donne accès à un essai concret. Les explications et les exemples d'intégration aident ensuite à réutiliser le résultat dans une application.

## Trois démonstrations prioritaires

| Priorité | Démonstration | Entrée et résultat utiles |
|---|---|---|
| 1 | Téléphone | Un numéro fictif, avec ou sans `+242`, produit les formats international et national de `phone.parse`. Les saisies non reconnues donnent une explication près du champ. |
| 2 | Montants | Un montant entier, par exemple `125000`, est affiché par `money.format` avec le libellé FCFA, XAF ou sans libellé. |
| 3 | Territoire | `geo.departements` affiche les départements présents dans le paquet publié. Si la liste est vide, le site indique que les données sont en cours de constitution et renvoie vers leur collecte. |

L'exemple téléphonique est explicitement fictif. La reconnaissance du format ne prouve pas l'existence du numéro ; les préfixes actuellement provisoires sont signalés. Le site ne démontre pas de fonctionnalités encore absentes, comme les montants en lettres ou les liens WhatsApp.

## Parcours et contenu

La navigation distingue le démarrage, les trois démonstrations et les ressources du projet. Chaque démonstration suit le même ordre : courte explication, saisie, résultat, puis exemple de code JavaScript ou Python. Les onglets Aperçu et Code permettent de se concentrer sur une tâche. Les limites restent accessibles près de l'exemple.

L'interface et les explications sont en français. Le code et les commentaires suivent les conventions du dépôt. Un lien GitHub permet de consulter le dépôt ; son compteur d'étoiles est secondaire et ne bloque jamais l'usage.

## Contraintes de livraison

- HTML, CSS et modules JavaScript dans `site/`, sans étape de compilation ; paquet publié chargé depuis une version CDN fixée.
- Lisibilité à 360 px, accès clavier, messages d'erreur compréhensibles et contraste suffisant.
- Page complète sous 200 Ko, police et module téléchargé compris dans la vérification réseau.
- Calculs locaux, aucune collecte ni transmission des saisies, aucun traceur.
- Métadonnées de partage et liens vers le dépôt ; publication GitHub Pages après fusion sur `main` et activation par un mainteneur.

## Critères de validation humaine

Le test sur un **vrai téléphone Android d'entrée de gamme**, avec capture jointe à la PR, reste à réaliser. Les trois parcours **Fullstack, Product Management et Digital Marketing** doivent relire la contribution avant sa fusion. Ni un test en émulation ni une vérification automatique ne valent approbation de ces critères.
