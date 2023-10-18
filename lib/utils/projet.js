import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

const {status} = PCRS_DATA_COLORS

/* eslint-disable  camelcase */
export const STATUS = {
  investigation: {label: 'Investigation', color: status.investigation, textColor: '#000'},
  convention_signee: {label: 'Convention signée', color: status.convention_signee, textColor: '#000'},
  marche_public_en_cours: {label: 'Marché public en cours', color: status.marche_public_en_cours, textColor: '#000'},
  prod_en_cours: {label: 'Production en cours', color: status.prod_en_cours, textColor: '#000'},
  controle_en_cours: {label: 'Contrôle en cours', color: status.controle_en_cours, textColor: '#000'},
  disponible: {label: 'Disponible', color: status.disponible, textColor: '#fff'},
  obsolete: {label: 'Obsolète', color: status.obsolete, textColor: '#fff'}
}

export const LICENCES_LABELS = {
  ouvert_lo: 'Ouverte',
  ouvert_odbl: 'Ouverte sous licence ODbL',
  ferme: 'Fermée'
}

export const ACTORS_LABELS = {
  financeur: 'Financeurs',
  diffuseur: 'Diffuseurs',
  presta_vol: 'Prestataires de vol',
  presta_lidar: 'Prestataires Lidar',
  controleur: 'Controleurs',
  aplc: 'Autorité Publique Locale Compétente',
  porteur: 'Porteur de projet non-APLC'
}

export const NATURES_LABELS = {
  geotiff: 'Livrable GeoTIFF',
  jpeg2000: 'Livrable Jpeg 2000',
  gml: 'Livrable GML vecteur'
}

export const DIFFUSIONS_LABELS = {
  wms: 'Diffusion via un service WMS',
  wmts: 'Diffusion via un service WMTS',
  tms: 'Diffusion via un service TMS'
}

export const SUBVENTIONS_NATURES_LABELS = {
  feder: 'Financement FEDER',
  cepr: 'Contrat État-Région',
  detr: 'Dotations de l’État aux Territoires Ruraux'
}
/* eslint-enable  camelcase */
