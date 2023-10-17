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
/* eslint-enable  camelcase */
