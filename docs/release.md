# Publier une version

Release mensuelle, le premier lundi du mois, par le mainteneur désigné.

## Checklist

1. **Vérifier `main`** : CI verte, aucune PR bloquante attendue pour ce milestone.
2. **Choisir le numéro** (SemVer) :
   - correctif ou ajout de données → `patch` (0.1.0 → 0.1.1)
   - nouvelle fonction ou changement d'API avant 1.0 → `minor` (0.1.1 → 0.2.0)
3. **Mettre à jour les versions** (les deux paquets portent toujours le même numéro) :
   ```bash
   npm run version:set -- 0.2.0
   ```
4. **Compléter `CHANGELOG.md`** : renommer `[Non publié]` en `[0.2.0] - AAAA-MM-JJ`, en rouvrir une vide au-dessus. Citer les contributeurs de la version.
5. **PR de release** `chore(release): 0.2.0`, relue et fusionnée.
6. **Tag** depuis `main` à jour :
   ```bash
   git tag v0.2.0 && git push upstream v0.2.0
   ```
   Le workflow `release.yml` relance la CI, publie sur npm et PyPI, crée la release GitHub.
7. **Annoncer** : note de version sur la release GitHub, message sur les canaux de l'académie, remerciement nominatif des contributeurs.

## Version stable (≥ 1.0.0)

Le workflow de release lance `npm run validate -- --strict` : il échoue s'il reste une entrée `a_verifier`. C'est voulu.

## En cas d'erreur de publication

- npm : `npm deprecate @mboka-dev/core@x.y.z "raison"` puis publier une correction. Ne pas utiliser `unpublish`.
- PyPI : marquer la version comme *yanked* depuis l'interface, puis publier une correction.
