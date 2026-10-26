# Feuille de route

Projet continu, sans calendrier pédagogique imposé. Le rythme est donné par une **release mensuelle** : ce qui est fusionné et vert au moment de la release part, le reste attend la suivante.

Chaque version correspond à un *milestone* GitHub. Une version n'est publiée que lorsque tous ses critères de sortie sont remplis.

---

## Phase 0 — Préparation (équipe pédagogique, avant ouverture)

Objectif : un dépôt prêt à accueillir des contributeurs. Un dépôt vide n'attire personne.

- [x] Créer l'organisation GitHub `mboka-dev`
- [x] Créer le dépôt public `mboka-dev/core`
- [ ] Pousser ce squelette, activer la protection de `main` (1 revue, CI verte, historique linéaire)
- [ ] Créer les labels (`scripts/create-labels.sh`) et les issues de départ (`scripts/create-issues.sh`)
- [ ] Créer l'organisation npm `mboka-dev` (scope `@mboka-dev`) et publier `@mboka-dev/core` 0.0.1 depuis ce dépôt
- [ ] Publier `mboka` 0.0.1 sur PyPI depuis ce dépôt
- [ ] Configurer la publication : jeton npm avec provenance, *trusted publishing* PyPI
- [ ] Nommer le premier noyau de mainteneurs (voir [GOVERNANCE.md](GOVERNANCE.md))

**Critère de sortie** : un apprenant qui n'a jamais vu le dépôt peut cloner, lancer les tests et ouvrir une PR en suivant uniquement `CONTRIBUTING.md`.

---

## v0.1 — Fondations (premier mois)

Objectif : publier une première version utile, même petite.

| Domaine | Livrable |
|---|---|
| Données | Liste des départements sourcée · plan de numérotation +242 sourcé (préfixes, opérateurs, longueur) |
| `phone` | `parse`, `isValid`, `format` (national, international, E.164), détection d'opérateur |
| `money` | `format` en FCFA / XAF |
| `text` | `normalize` (minuscules, accents, ponctuation) |
| `geo` | `departements`, `find` exact sur nom et variantes |
| Outillage | CI données + JS + Python · fixtures partagées · synchronisation des données vers les paquets |
| Docs | README FR, guide de contribution, guide de sourcing |

**Critères de sortie** : CI verte · toutes les entrées `phone` en statut `verifie` · paquets publiés en `0.1.0` · au moins 5 contributeurs apprenants avec une PR fusionnée.

---

## v0.2 — Montants et territoire

| Domaine | Livrable |
|---|---|
| `money` | `toWords` : montant en lettres conforme à l'orthographe traditionnelle (fixtures déjà écrites) · option orthographe 1990 |
| Données | Communes et arrondissements de Brazzaville et Pointe-Noire, avec variantes orthographiques usuelles |
| `geo` | `communes(departement)`, `arrondissements(commune)` |
| Docs | README anglais · page de documentation (GitHub Pages) |

**Critères de sortie** : fixtures `money/to-words` toutes vertes dans les deux langages · relecture des données par deux personnes distinctes.

---

## v0.3 — Recherche tolérante et types

| Domaine | Livrable |
|---|---|
| `geo` | `find` flou : tolère fautes de frappe, abréviations (« Pte-Noire », « Bzv »), ordre des mots |
| `geo` | `normalizeName` pour nettoyer une colonne de données d'enquête |
| TypeScript | Types générés depuis les schémas JSON (`Departement`, `Commune`…) |
| Python | Annotations complètes, `py.typed` |
| Outillage | Publication automatisée sur tag (npm + PyPI) |

**Critères de sortie** : jeu de 50 saisies réelles anonymisées (formulaires, enquêtes) reconnues à plus de 95 %.

---

## v0.4 — Mobile money

| Domaine | Livrable |
|---|---|
| `phone` | `mobileMoneyProvider(numero)` : service mobile money associé à l'opérateur |
| Docs | Exemple d'intégration : formulaire de paiement qui propose le bon service |

---

## v1.0 — Stable

**Critères de sortie** :

- aucune entrée `a_verifier` dans `data/` (la release stricte le contrôle) ;
- API figée et documentée, politique de dépréciation écrite ;
- au moins 3 projets externes à l'académie qui utilisent la bibliothèque ;
- procédure de mise à jour des données documentée et testée une fois par une personne extérieure au noyau.

---

## Après la v1.0 (idées, non engagées)

- Quartiers de Brazzaville et Pointe-Noire (données plus mouvantes, à cadrer)
- Jours fériés du Congo-Brazzaville (calcul des dates mobiles)
- Validation de formats administratifs, uniquement s'ils sont publics et documentés
- Petit site de démonstration (« testez votre numéro », « montant en lettres »)

---

## Ce que le projet ne fera pas

- **Pas de données personnelles.** Aucun annuaire, aucune base de numéros réels.
- **Pas d'appel aux API des opérateurs.** La bibliothèque reste hors ligne et sans dépendance réseau.
- **Pas de donnée sans source.** Une information non vérifiable n'entre pas.
