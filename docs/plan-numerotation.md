# Numérotation téléphonique du Congo (+242)

## Références consultées

- UIT, [Plan de numérotage national du Congo (+242)](https://www.itu.int/dms_pub/itu-t/oth/02/02/T020200002E0009PDFE.pdf), version publiée le 13 décembre 2024. Ce document reprend les communications de l'ARPCE, notamment la plage MTN ajoutée le 1er novembre 2024, les indicatifs géographiques fixes et les numéros courts.
- ARPCE, [Fin de la cohabitation entre les deux plans de numérotation téléphonique](https://www.arpce.cg/upload/publications/fin-cohabitation-entre-les-deux-plans-de-numerotations-telephoniques-2.pdf), communiqué du 17 décembre 2010. Cette source décrit les préfixes mobiles historiques.
- ARPCE, [Transparence et sécurité dans les communications électroniques](https://www.arpce.cg/actualites/transparence-et-securite-dans-les-communications-electroniques-larpce-mobilise-les-operateurs-de-telephonie-mobile/), 27 mars 2025. Cette actualité identifie Airtel et MTN Congo comme opérateurs mobiles présents, sans publier leurs plages actuelles.

## Données confirmées

- Le numéro national significatif comporte neuf chiffres.
- Le format international publié est `+242 XX XXX XX XX`, soit un groupement `[2, 3, 2, 2]`.
- La plage `06 100 00 00` à `06 199 99 99` a été attribuée à MTN Congo pour la voix, les SMS et les données, avec une introduction au 9 octobre 2024.
- Les indicatifs géographiques fixes publiés sont `22 21`, `22 22`, `22 23`, `22 24`, `22 25`, `22 28` et `22 29`.
- Les numéros courts documentés comprennent `111`, `112`, `116`, `117` et `118`. Les numéros `110`, `113`, `114`, `115` et `119` sont réservés. Les codes `30XXX`, `31XXX`, `35XXX` et `39XXX` sont répertoriés pour les services à valeur ajoutée mobiles.

## Informations qui restent à confirmer

Les préfixes `01`, `04` et `05` apparaissent dans les documents historiques, mais les sources consultées ne suffisent pas à confirmer l'état actuel de toutes leurs plages. Ils restent donc marqués `a_verifier` dans `data/phone/numerotation.json`, avec une note expliquant la limite documentaire.

Le plan UIT 2024 mentionne également des blocs mobiles partiels en `02` pour Congo Telecom. Ils sont représentés par des plages exactes afin de ne pas accepter les numéros hors des blocs publiés. Une incohérence subsiste dans le même document : la communication détaillée du 24 septembre 2020 annonce ces attributions, tandis que le tableau récapitulatif de structure (p. 10) marque certains codes `02` comme réservés. Le préfixe reste donc marqué `a_verifier` et doit être confirmé auprès de l'ARPCE.

## Limite de l'API

`phone.parse` valide les numéros d'abonnés nationaux à neuf chiffres. Lorsqu'une attribution ne couvre que certaines plages, le préfixe contient des bornes `start` et `end` afin de rejeter les numéros situés hors de ces plages. Les numéros courts de service sont référencés dans `specialNumbers`, mais ne sont pas des numéros d'abonnés E.164 et ne sont donc pas acceptés par `phone.parse`.
