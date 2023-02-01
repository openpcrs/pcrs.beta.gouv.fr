# Décrire son projet PCRS

Décrire les projets PCRS et les périphériques (acteurs, livrables, statuts, subventions) se fait ici au moyen de fichiers Yaml.  
Leur structure s'approche du modèle de données proposé par la startup d'Etat PCRS en ayant quelques différences importantes.  
Il s'agit ici d'une solution temporaire, en tout cas très bas niveau, avant de disposer d'outils plus ergonomiquement avancés.

Plus d'informations sur notre démarche : https://docs.pcrs.beta.gouv.fr/suivi-des-projets/demarche
Les listes de valeurs sont intégralement décrites dans le modèle de données associé.

Il est obligatoire de créer un fichier par projet afin d'organiser la contribution au mieu dans ce répertoire.  
Ces projets sont nommés de manière arbitraire et représentative de leur porteur et/ou de leur emprise géographique.  
En outre, la structure proposée ne permet que de décrire un projet du début à la fin. Tout autre projet ira dans un autre fichier.

Les noms de champs et les valeurs des dictionnaires de valeurs doivent aussi être scrupuleusement respectés.

Aidez-vous des fichiers déjà présents pour compléter un champ dont vous ne seriez pas sûr du contenu.

## Méthodologie

Nous définissons un projet PCRS comme étant une campagne de prise de vue ou de vectorisation portée par un ou plusieurs acteurs dispoant de rôles précis.  
Des subventions peuvent compléter les financements apportés par certains de ces acteurs.
La campagne produit un certain nombre de livrables au terme d'un calendrier continu et découpé en plusieurs étapes.

Le territoire concerné peut être découpé en plusieurs phases, particulièrement lorsqu'il s'agit d'organiser des vols pour un PCRS raster.  
Chaque phase présentant des coûts différents et des dates de livraison elles aussi différentes, il faudra créer un projet par phase. Des exemples sont déjà disponibles comme celui de l'Ain.  
Les coûts de chaque année/phase sont reportés pour chaque acteur et les contours géographiques correspondants sont associés au projet.

Il en va de même pour les mises à jour, qui interviendront après la campagne de production initiale selon un calendrier propre.  
Il convient donc de créer un projet différent par campagne de mise à jour, avec les périmètres géographiques associés et les acteurs impliqués.

Cela semble beaucoup plus fin que ce qu'on peut s'imaginer des projets PCRS, c'est néanmoins le seul moyen de décrire un calendrier très simple de quelques étapes avec des livrables clairement identifiés à la fin.  
La plupart de ces différents projets correspondront à la même convention.

Un fichier modèle `_porteur_projet_A_DUPLIQUER_ET_RENOMMER.yaml` est à votre disposition pour initialiser la description de votre projet.

## Propriétés générales

Un projet PCRS est décrit selon les propriétés principales suivantes :

* nom : Nom arbitraire du projet (idéalement concaténation Territoire - Zone projet)
* regime : Régime du projet (liste l_pcrs_regime)
    * production : C'est un projet de production
    * maj : C'est un projet de mise à jour
* nature : Nature du projet (liste l_pcrs_nature)
    * vecteur : Le projet concerne un PCRS vecteur
    * raster : Le projet concerne un PCRS raster
    * mixte : Le projet concerne un PCRS mixte raster/vecteur

* livrables : Liste de livrables (voir ci-dessous)

* etapes : Liste des étapes du projet (voir ci-dessous)

* acteurs : Liste des acteurs du projet (voir ci-dessous)

* perimetres : Liste des périmètres couverts par la campagne (voir ci-dessous)

Exemple de déclaration principale de projet, ici un projet de production intiiale mixte raster/vecteur
```yaml
nom: Projet PCRS
regime: production
nature: mixte
```

## Livrables

Les livrables représentent les corpus de données produites à l'issue du projet et uniquement celles-ci.  
Puisque beaucoup de projets peuvent en produire plusieurs, ils sont définis comme une liste d'entités aux propriétés suivantes :

* nom : Nom arbitraire du livrable
* nature : Nature du livrable (liste l_pcrs_livrable)
    * geotiff : Livrable GeoTiff (PCRS raster)
    * gml : Livrable GML (PCRS vecteur)
* licence : Licence de diffusion du livrable (l_pcrs_licence)
    * ouvert_lo : Ouvert sous licence ouverte
    * ouvert_odbl : Ouvert sous licence ODbL
    * ferme : Licence fermée
* diffusion : Modalité de diffusion du livrable (l_pcrs_diffusion)
    * telechargement : Téléchargement des fichiers en masse
    * flux : Accès via un flux (WMTS, WFS...)
* avancement : Pourcentage de complétude du livrable
* crs : Identifiant du système de référence du livrable (format EPSG:1234)
* compression : Indication descriptive de la nature de la compression appliquée au livrable

Exemple de déclaration de deux livrables pour un même projet :
```yaml
livrables:
  - nom: Images raster
    nature: geotiff
    diffusion: flux
    licence: ferme
    crs: EPSG:2154
  - nom: Données vecteur
    nature: gml
    diffusion: flux
    licence: ferme
    crs: EPSG:3946
```

## Etapes

Les projets passent tous par les mêmes étapes qui sont définies par leur date de début.  
L'étape N prend fin à la date de début de l'étape N+1.

* statut : Statut concerné, parmi les valeurs suivantes de la liste l_pcrs_statut :
  * investigation : 
  * production : Les vols ou roulages sont en cours
  * produit : Les vols ou roulages sont terminés, les livrables sont en cours de recette
  * livre : Les livrables sont disponibles dans les canaux de diffusion prévus
  * obsolete : Les livrables sont remplacés par d'autres plus à jour
* date_debut : Date de début du statut concerné, au format AAAA-MM-JJ

Exemple de déclaration d'une succession d'étapes :
```yaml
etapes: 
  - statut: investigation
    date_debut: 2015-01-01
  - statut: production
    date_debut: 2016-01-01
  - statut: produit
    date_debut: 2018-01-01
```

## Acteurs

Les acteurs du projet sont définis comme une liste d'entités aux propriétés suivantes :

* siren : SIREN de l'entreprise
* nom : Nom intelligible de l'entreprise
* interlocuteur : Nom de l'interlocuteur à contacter
* mail : Adresse mail de l'interlocuteur
* telecom : Numéro de téléphone de l'interlocuteur
* role : Rôle de l'acteur, parmi les valeurs suivantes de la liste l_pcrs_role :
  * aplc : APLC
  * financeur : Un acteur apportant du financement dans le tour de table
  * diffuseur : Un acteur chargé de la diffusion des livrables
  * presta_vol : Un prestataire de vol pour le raster
  * presta_lidar : Un prestataire de relevé lidar pour le vecteur
  * controleur : Un acteur chargé du contrôle des livrables lors de la recette
* finance_part_perc : Part de financement apporté par l'acteur en pourcentage du total
* finance_part_euro : Montant de financement en euros apporté par l'acteur

Exemple de déclaration d'une liste d'acteurs pour un projet :
```yaml
acteurs: 
  - siren: 257400085
    nom: Acteur 1
    interlocuteur: Chef de projet
    mail: pcrs@aplc.fr
    telephone: +33102030405
    role: aplc
    finance_part_perc: 32
  - siren: 444608442
    nom: Enedis
```

## Périmètres

Les projets couvrent le plus souvent des périmètres administratifs connus.  
Nous avons fait le choix de définir ces périmètres comme l'agrégation d'une liste de territoires identifiés.  
Il s'agit avant tout des périmètres intentionnels, c'est à dire conventionnels ou envisagés.  
Les périmètres des livrables, si différents, seront déduits directement de ces livrables.

Chaque territoire est identifié par une nature et leurs identifiant, soit insee soit SIREN.  
Nous considérons actuellement trois natures différentes : commune, epci et departement qui peuvent être combinées à façon

Exemple de déclaration d'une liste de territoires
```yaml
perimetres:
  - commune:7410
  - epci:257400085
  - departement:74
```

## Subventions

Les subentions complètent le financement apporté par les acteurs du projet.  
Elles sont déclarées comme une liste d'objets correspondant aux propriétés suivantes :
* nom : Nom arbitraire de la subvention
* nature : Nature de la subvention, parmi les valeurs suivantes de la liste l_pcrs_subvention :
  * feder : Subvention FEDER
  * cepr : Contribution Etat-Région
* montant : Montant de la subvention en euros
* echance : Date limite d'utiliation de la subvention, au format AAAA-MM-JJ

Exemple de déclaration de subventions sur un projet
```yaml
subventions: 
  - nom: FEDER
    nature: feder
  - nom: Contrat Etat-Région
    nature: cepr
```