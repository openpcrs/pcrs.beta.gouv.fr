import {PCRS_DATA_COLORS} from '@/styles/pcrs-data-colors.js'

const {status} = PCRS_DATA_COLORS

export const STATUS = [
  {label: 'Investigation', value: 'investigation', color: status.investigation, textColor: '#000'},
  {label: 'Convention signée', value: 'convention_signee', color: status.convention_signee, textColor: '#000'},
  {label: 'Marché public en cours', value: 'marche_public_en_cours', color: status.marche_public_en_cours, textColor: '#000'},
  {label: 'Production en cours', value: 'prod_en_cours', color: status.prod_en_cours, textColor: '#000'},
  {label: 'Contrôle en cours', value: 'controle_en_cours', color: status.controle_en_cours, textColor: '#000'},
  {label: 'Disponible', value: 'disponible', color: status.disponible, textColor: '#fff'},
  {label: 'Obsolète', value: 'obsolete', color: status.obsolete, textColor: '#000'}
]

