# pcrs.beta.gouv.fr
> Site de l’accompagnement national des projets PCRS

Ce dépôt contient le code du site [pcrs.beta.gouv.fr](https://pcrs.beta.gouv.fr)

Il utilise [Next.js](https://nextjs.org) et [le Système de Design de l’État](https://www.systeme-de-design.gouv.fr/)

## Développement :

### Pré-requis :

* Node.js version 18 ou supérieure
* yarn (ou npm)

### Installation des dépendances

```bash
yarn
```

### Lancer en mode développement

```bash
yarn dev
```

### Contrôler le style du code

Le style de code utilisé est [xo](https://github.com/xojs/xo).

```bash
yarn lint
```
---

### Lancer la construction des données de la carte de suivi
```bash
yarn build-data
```
Les fichiers YAML contenus dans le dossier `/data` vont être parcourus et transformés en deux fichiers :   
- `projets.json` : qui contient les données des projets PCRS
- `projets.geojson` : qui contient les contours des projets PCRS
> *Les données vont préalablement __être validées__.*   
> *Une erreur sera affichée en console si un champ est manquant, mal orhtographié,*   
> *ou si l’indentation du fichier yaml n’est pas correcte.*   
---

## Licence

Le code de ce logiciel est soumis à la licence MIT.

---

*Cette application respecte le [système de design](https://www.systeme-de-design.gouv.fr/elements-d-interface) prévu par le SIG.*
