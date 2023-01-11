# Décrire son projet PCRS

Décrire les projets PCRS et les périphériques (acteurs, livrables, statuts, subventions) se fait ici au moyens de fichiers Yaml.  
Leur structure s'approche du modèle de données proposé par la startup d'Etat PCRS en ayant quelques différences importantes.  
Il s'agit ici d'une solution temporaire, en tout cas très bas niveau, avant de disposer d'outils plus ergonomiquement avancés.

Plus d'informations sur notre démarche : https://docs.pcrs.beta.gouv.fr/suivi-des-projets/demarche

Il est obligatoire de créer un fichier par projet afin d'organiser la contribution au mieu dans ce répertoire.  
Ces projets sont nommés de manière arbitraire et représentative de leur porteur et/ou de leur emprise géographique.  
En outre, la structure proposée ne permet que de décrire un projet du début à la fin. Tout autre projet ira dans un autre fichier.

Les noms de champs et les valeurs des dictionnaires de valeurs doivent aussi être scrupuleusement respectés.

Aidez-vous des fichiers déjà présents pour compléter un champ dont vous ne seriez pas sûr du contenu.

## Propriétés générales

* nom : Nom arbitraire du projet (idéalement concaténation APLC - Zone projet)
* regime : Régime du projet
    * production : C'est un projet de production
    * maj : C'est un projet de mise à jour
* nature : Nature du projet
    * vecteur : Le projet concerne un PCRS vecteur
    * raster : Le projet concerne un PCRS raster
    * mixte : Le projet concerne un PCRS mixte raster/vecteur

* livrables : Liste de livrables (voir ci-dessous)

* etapes : Liste des étapes du projet (voir ci-dessous)

* acteurs : Liste des acteurs du projet (voir ci-dessous)

* perimetres : Liste des périmètres couverts par la campagne (voir ci-dessous)

## Livrables

Les livrables représentent les corpus de données produites à l'issue du projet et uniquement celles-ci.

* nom : Nom arbitraire du livrable
* nature : Nature du livrable
    * geotiff : Livrable GeoTiff (PCRS raster)
    * gml : Livrable GML (PCRS vecteur)
* licence : Licence de diffusion du livrable
    * ouvert_lo : Ouvert sous licence ouverte
    * ouvert_odbl : Ouvert sous licence ODbL
    * ferme : Licence fermée
* diffusion : Modalité de diffusion du livrable
    * telechargement : Téléchargement des fichiers en masse
    * flux : Accès via un flux (WMTS, WFS...)
* avancement : Pourcentage de complétude du livrable

Exemple de déclaration de deux livrables pour un même projet :
```yaml
livrables:
    - nom: Images raster
      nature: geotiff
      diffusion: flux
      licence: ferme
    - nom: Données vecteur
      nature: gml
      diffusion: flux
      licence: ferme
```

## Etapes

* statut : Statut concerné
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

* siren : SIREN de l'entreprise
* nom : Nom intelligible de l'entreprise
* interlocuteur : Nom de l'interlocuteur à contacter
* mail : Adresse mail de l'interlocuteur
* telecom : Numéro de téléphone de l'interlocuteur

Exemple de déclaration d'une liste d'acteurs pour un projet :
```yaml
acteurs: 
    - siren: 257400085
      nom: Acteur 1
      interlocuteur: Chef de projet
      mail: pcrs@aplc.fr
      telephone: +33102030405
    - siren: 444608442
      nom: Enedis
```

## Périmètres



## Subventions

