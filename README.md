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

### Télécharger les données des contours géographiques

```bash
yarn download-contours
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
> *Une erreur sera affichée en console si un champ est manquant, mal orthographié,*
> *ou si l’indentation du fichier YAML n’est pas correcte.*
---

### Lancer les tests
```bash
yarn test
```

### Variables d’environnement

Vous devez copier le fichier `.env.sample` vers un nouveau fichier `.env`
```bash
cp .env.sample .env
```

Puis compléter les champs suivants :
- `PORT` -> Port d’écoute du serveur, 3000 par défaut.
>*Les champs suivants sont optionnels, mais vous ne pourez pas accéder à la page `/blog` du site.*
- `NEXT_PUBLIC_GHOST_URL` -> URL complète du blog Ghost (optionnel)
- `GHOST_KEY` -> Jeton permettant l’accès aux articles du Blog Ghost (optionnel)
>*Pour utiliser l’API, vous devez compléter ce champ.*
>*En local, utilisez ce jeton pour authentifier les appels à l’API*
- `ADMIN_TOKEN` -> Jeton d’authentification des appels à l’API.

### Routes de l’API des projets PCRS
| Route | Type | Description |
|-------|------|-------------|
| `/projets`| **GET** | *Retourne la liste de tous les projets PCRS* |
| `/projets`| **POST** | *Permet d’ajouter un projet PCRS* |
| `/projets/:id`| **GET** | *Retourne le projet demandé* |
| `/projets/:id`| **DELETE** | *Supprime le projet demandé* |
| `/projets/:id`| **PUT** | *Modifie le projet demandé* |

Vous pouvez accéder au modèle de données à [cette adresse](https://docs.pcrs.beta.gouv.fr/suivi-des-projets/modele-de-donnees).

---

## Licence

Le code de ce logiciel est soumis à la licence MIT.

---

*Cette application respecte le [système de design](https://www.systeme-de-design.gouv.fr/elements-d-interface) prévu par le SIG.*
