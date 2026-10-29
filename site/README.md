# Site de démonstration

Ce dossier contient la documentation interactive de Mboka. Le site est statique : aucun framework, aucune compilation et aucun serveur d'application ne sont nécessaires. Les démonstrations utilisent le paquet publié, sans recopier ses règles métier.

## Consulter en local

Depuis la racine du dépôt, lancer un serveur de fichiers statiques :

```bash
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Ouvrir ensuite [localhost:8000](http://localhost:8000). Une connexion Internet est nécessaire au premier chargement du paquet depuis le CDN ; l'ouverture directe avec `file://` ne convient pas aux modules JavaScript.

## Maintenir les exemples

La version du paquet et son URL CDN sont fixées dans `demos.js`. Pour les mettre à jour :

1. Choisir une version effectivement publiée de `@mboka-dev/core`.
2. Mettre à jour l'URL CDN et les indications de version visibles dans le site.
3. Vérifier les exemples téléphone et montants, ainsi que les états de chargement, d'erreur et d'absence de données géographiques.
4. Contrôler le budget de la page, y compris la police et le module téléchargé, dans l'onglet Réseau du navigateur avec le cache désactivé.

Les préfixes téléphoniques peuvent être provisoires. La démo explique cette limite et ne confirme ni l'existence d'un numéro ni sa disponibilité sur WhatsApp. Le territoire affiche les données présentes dans la version publiée : une nouvelle entrée dans `data/` ne devient visible qu'après publication du paquet et mise à jour de la version utilisée par le site.

## Données et confidentialité

Les saisies sont traitées dans le navigateur. Elles ne doivent figurer ni dans une URL, ni dans le stockage du navigateur, ni dans des journaux, ni dans une requête réseau. Aucun traceur n'est installé.

Le compteur d'étoiles consulte uniquement les métadonnées publiques de `mboka-dev/core` auprès de GitHub, sans clé ni saisie de l'utilisateur. Une courte mise en cache limite les requêtes ; l'indisponibilité du compteur ne bloque pas les démonstrations. La politique CSP du document limite les ressources et les connexions aux origines nécessaires. Toute nouvelle dépendance doit rester compatible avec cette politique et le budget de 200 Ko.

## Publier sur GitHub Pages

L'adresse prévue est [mboka-dev.github.io/core](https://mboka-dev.github.io/core/). Elle ne constitue pas, à elle seule, une confirmation de déploiement.

Un mainteneur doit sélectionner **Settings → Pages → Build and deployment → Source → GitHub Actions** dans le dépôt principal. Le workflow `pages.yml` publie ensuite le dossier `site/` à chaque modification de celui-ci fusionnée sur `main`. Il peut aussi être lancé manuellement depuis **Actions → Site de démonstration → Run workflow**, sur `main`.

Le workflow ne publie que depuis `main` et ne demande aucun secret supplémentaire. Un fork peut l'utiliser avec son propre GitHub Pages ; son adresse de prévisualisation diffère de celle du dépôt principal. L'environnement `github-pages` fournit le lien du déploiement après une exécution réussie. Ajouter l'adresse du site dans le champ **Website** de la section **About** du dépôt une fois celui-ci accessible.

## Vérifier avant la fusion

- Exécuter les vérifications du dépôt décrites dans [CONTRIBUTING.md](../CONTRIBUTING.md).
- Exécuter `node scripts/check-site.mjs` pour vérifier la structure et le budget des ressources statiques, sans compilation.
- Vérifier au clavier les liens, onglets, formulaires et boutons de copie ; vérifier les thèmes et la lecture à 360 px.
- Vérifier les erreurs de saisie, l'indisponibilité du CDN et du compteur GitHub, ainsi que l'absence de départements.
- Confirmer que la page complète reste sous 200 Ko lors d'une première visite, puis que les saisies ne provoquent aucune requête.
- **À réaliser sur appareil physique :** essai sur un téléphone Android d'entrée de gamme et capture jointe à la PR. Une émulation navigateur ne remplace pas cet essai.
- **À obtenir auprès des contributeurs :** revue croisée Fullstack, Product Management et Digital Marketing. Les contrôles automatisés ne remplacent pas ces approbations.

Le [cadrage du site](../docs/site-demo.md) précise le message principal et les trois démonstrations prioritaires.

## Polices

Geist et Geist Mono, de Vercel et basement.studio, sont auto-hébergées sous [SIL Open Font License 1.1](assets/OFL.txt). Les fichiers WOFF2 sont des sous-ensembles latins des [polices Geist](https://github.com/vercel/geist-font), avec les accents français, la ponctuation et les symboles monétaires. Aucune requête à un service de polices n’est nécessaire.

Pour reproduire ces sous-ensembles à partir des fichiers variables originaux, l’outil facultatif FontTools avec Brotli suffit (ceci n’est pas une étape de publication du site) :

```bash
python -m fontTools.subset Geist-Variable.woff2 --output-file=site/assets/geist.woff2 --unicodes="U+0000-00FF,U+0100-017F,U+0180-024F,U+0300-036F,U+2000-206F,U+20A0-20CF,U+2190-21FF,U+2212,U+FEFF,U+FFFD" --flavor=woff2 --layout-features="*" --name-IDs="*" --name-legacy --name-languages="*"
```

Répéter avec `GeistMono-Variable.woff2` et `site/assets/geist-mono.woff2`. Les fontes restent variables (graisses 100–900).
