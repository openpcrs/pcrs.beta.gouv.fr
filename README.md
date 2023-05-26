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
- `API_ENTREPRISES_URL` -> URL de l’API "recherch-entreprises"
- `MONGODB_URL` -> URL de la base de données MongoDB
- `MONGODB_DBNAME` -> Nom de la collection MongoDB
- `ADMIN_TOKEN` -> Jeton d’authentification des appels à l’API.
>*Les champs suivants sont optionnels, ils permettent d’envoyer le code de vérification par mail.*
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `SMTP_FROM`, `SMTP_BCC` -> Paramètres du serveur de mail
- `SHOW_EMAILS` (YES / NO) -> Permet d’afficher le mail envoyé dans la console.

### Routes de l’API des projets PCRS
| Route | Type | Description |
|-------|------|-------------|
| `/projets`| **GET** | *Retourne la liste de tous les projets PCRS* |
| `/projets`| **POST** | *Permet d’ajouter un projet PCRS* |
| `/projets/:id`| **GET** | *Retourne le projet demandé* |
| `/projets/:id`| **DELETE** | *Supprime le projet demandé* |
| `/projets/:id`| **PUT** | *Modifie le projet demandé* |
| `/me`| **GET** | *Permet à un administrateur de s'authentifier après avoir fourni le jeton d'administration* |
| `/data/projets.csv`| **GET** | *Retourne un fichier CSV contenant l’ensemble des projets PCRS* **Option :** *`/?includesWkt=1` pour inclure les géométries des projets au format WKT* |
| `/data/livrables.csv`| **GET** | *Retourne un fichier CSV contenant l’ensemble des livrables des projets PCRS* |
| `/data/tours-de-table.csv`| **GET** | *Retourne un fichier CSV contenant l’ensemble des tours de table des projets PCRS* |
| `/data/subventions.csv`| **GET** | *Retourne un fichier CSV contenant l’ensemble des subventions des projets PCRS* |
| `/data/editor-keys.csv`| **GET** | *Retourne l’ensemble des codes d’édition des projets (Cette route est réservée aux administrateurs)* |
| `/ask-code`| **POST** | *Faire une demande de création de projet. Cette route attend un objet `{"email": email du demandeur}`* |
| `/check-code`| **POST** | *Vérifie la validité du code envoyé par email. Cette route attend un objet `{"email": email du demandeur, "pinCode": code envoyé par mail}`* |

Vous pouvez accéder au modèle de données à [cette adresse](https://docs.pcrs.beta.gouv.fr/suivi-des-projets/modele-de-donnees).

---

## Licence

Le code de ce logiciel est soumis à la licence MIT.

---

*Cette application respecte le [système de design](https://www.systeme-de-design.gouv.fr/elements-d-interface) prévu par le SIG.*
