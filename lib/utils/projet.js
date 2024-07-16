
/* eslint-disable  camelcase */
export const STATUS = {
  investigation: {label: 'Investigation', color: '#ffe386', textColor: '#000'},
  convention_signee: {label: 'Convention signée', color: '#d8ed75', textColor: '#000'},
  marche_public_en_cours: {label: 'Marché public en cours', color: '#b9e45a', textColor: '#000'},
  prod_en_cours: {label: 'Production en cours', color: '#a7f192', textColor: '#000'},
  controle_en_cours: {label: 'Contrôle en cours', color: '#87c1ea', textColor: '#000'},
  realise: {label: 'Réalisé', color: '#175c8b', textColor: '#fff'},
  disponible: {label: 'Disponible', color: '#7037c7', textColor: '#fff'},
  obsolete: {label: 'Obsolète', color: '#7c7c7c', textColor: '#fff'}
}
export const LICENCES = {
  ouvert_lo: {label: 'Ouverte', color: '#fddbfa'},
  ouvert_odbl: {label: 'Ouverte sous licence ODbL', color: '#fef3fd'},
  ferme: {label: 'Fermée', color: '#fbb8f6'}
}

export const ACTORS = {
  financeur: {label: 'Financeurs', color: '#e6feda'},
  diffuseur: {label: 'Diffuseurs', color: '#dffdf7'},
  presta_vol: {label: 'Prestataires de vol', color: '#c7f6fc'},
  presta_lidar: {label: 'Prestataires Lidar', color: '#dee5fd'},
  controleur: {label: 'Controleurs', color: '#b6cffb'},
  aplc: {label: 'Autorité Publique Locale Compétente', color: '#fef7da'},
  porteur: {label: 'Porteur de projet non-APLC', color: '#FEDAE0'}
}

export const LIVRABLE_NATURES = {
  geotiff: {label: 'GeoTIFF', color: '#f7b39e'},
  jpeg2000: {label: 'JPEG 2000', color: '#87bbed'},
  gml: {label: 'GML vecteur', color: '#f9b8f5'},
  dxf: {label: 'DXF vecteur', color: '#808080'},
  dwg: {label: 'DWG vecteur', color: '#808080'}
}

export const NATURES = {
  raster: {label: 'Raster', color: '#fc916f'},
  vecteur: {label: 'Vecteur', color: '#86b6d8'},
  mixte: {label: 'Mixte', color: '#cf7bb9'}
}

export const SUBVENTIONS_NATURES = {
  feder: {label: 'Financement FEDER', color: '#e8edff'},
  cepr: {label: 'Contrat État-Région', color: '#dffdf7'},
  detr: {label: 'Dotations de l’État aux Territoires Ruraux', color: '#feebd0'}
}

export const REGIMES = {
  maj: {label: 'Mise à jour', color: '#fee9e5'},
  production: {label: 'Production', color: '#e7ca8e'}
}

export const STOCKAGE_PARAMS = {
  host: {label: 'Nom d’hôte du service', defaultValue: 'Non renseigné'},
  username: {label: 'Nom d’utilisateur', defaultValue: 'Non renseigné'},
  password: {label: 'Mot de passe', defaultValue: 'Non renseigné'},
  startPath: {label: 'Chemin du répertoire', defaultValue: '/ (défaut)'},
  port: {label: 'Port d’accès au service', defaultValue: 'Non renseigné'},
  url: {label: 'URL du stockage', defaultValue: 'Non renseignée'},
  url_externe: {label: 'Portail de téléchargement externe', defaultValue: 'Non renseignée'},
  secure: {label: 'Connexion sécurisée', defaultValue: false}
}
/* eslint-enable  camelcase */
