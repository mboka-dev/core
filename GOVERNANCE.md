# Gouvernance

## Rôles

| Rôle | Qui | Droits et responsabilités |
|---|---|---|
| **Contributeur** | Toute personne ayant une PR fusionnée | Ouvre des issues et des PR, commente, relit (revue non bloquante) |
| **Relecteur** | Contributeur avec au moins 3 PR fusionnées, proposé par un mainteneur | Revue approuvante sur son domaine (`data`, `js`, `python`, `docs`), tri des issues |
| **Mainteneur** | Noyau : équipe pédagogique + 2 à 3 apprenants en rotation | Fusionne, gère les milestones, publie les releases, fait respecter le code de conduite |
| **Propriétaire** | Euloge, initiateur du projet (au moins 2 comptes admin des organisation GitHub `mboka-dev`, de l'organisation npm `mboka-dev` et du projet PyPI `mboka`) | Paramètres des dépôts, secrets de publication, noms de paquets, création de nouveaux projets sous `mboka-dev` |

Les domaines de revue sont déclarés dans [`.github/CODEOWNERS`](.github/CODEOWNERS).

## Rotation des mainteneurs apprenants

- Mandat de **2 mois**, renouvelable une fois.
- Candidature ouverte à tout relecteur ; le noyau choisit en tenant compte de la régularité des revues, pas du volume de code.
- En fin de mandat, le mainteneur sortant rédige une courte passation (issues en cours, décisions en attente) dans une discussion GitHub.
- Un mainteneur sortant redevient relecteur : rien n'est perdu.

## Prise de décision

1. **Par défaut, consensus paresseux** : une proposition sans objection après 7 jours est acceptée.
2. **Changement d'API publique ou de schéma de données** : issue avec le label `rfc`, ouverte au moins 14 jours, approuvée par 2 mainteneurs dont 1 de l'équipe pédagogique.
3. **Désaccord persistant** : l'équipe pédagogique tranche et documente la décision dans l'issue.

## Règles de fusion

- Branche `main` protégée : PR obligatoire, CI verte, 1 approbation d'un relecteur ou mainteneur du domaine.
- Un mainteneur ne fusionne pas sa propre PR.
- Fusion en *squash* ; le message final suit Conventional Commits.
- Toute PR qui touche `data/` est relue par une personne qui vérifie la source citée, pas seulement le format.

## Releases

- **Mensuelle**, le premier lundi du mois, par un mainteneur désigné à tour de rôle.
- Versionnage [SemVer](https://semver.org/lang/fr/). Avant la v1.0, une version mineure peut changer l'API ; elle est alors signalée en tête du `CHANGELOG.md`.
- Procédure : [docs/release.md](docs/release.md).

## Données sensibles

Le projet ne contient et n'accepte **aucune donnée personnelle** (numéros réels, noms, adresses individuelles). Une PR qui en contient est fermée et son historique nettoyé.
