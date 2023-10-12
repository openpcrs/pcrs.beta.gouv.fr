import {getLabelFromValue} from '@/lib/utils/select-options.js'

export const natureOptions = [
  {label: 'Livrable GeoTIFF', value: 'geotiff'},
  {label: 'Livrable Jpeg 2000', value: 'jpeg2000'},
  {label: 'Livrable GML vecteur', value: 'gml'}
]

export const diffusionOptions = [
  {label: 'Diffusion via un service WMS', value: 'wms'},
  {label: 'Diffusion via un service WMTS', value: 'wmts'},
  {label: 'Diffusion via un service TMS', value: 'tms'}
]

export const licenceOptions = [
  {label: 'Ouvert sous licence ODbL', value: 'ouvert_odbl'},
  {label: 'Ouvert sous licence ouverte', value: 'ouvert_lo'},
  {label: 'Fermé', value: 'ferme'}
]

export const publicationOptions = [
  {label: 'Accès via FTP', value: 'ftp'},
  {label: 'Accès via un service cloud (oneDrive...)', value: 'cloud'},
  {label: 'Accès via service HTTP(S)', value: 'http'},
  {label: 'Aucun moyen d’accès en ligne', value: 'inexistante'}
]

export const systRefSpatialOptions = [
  {label: 'EPSG:2154', value: 'EPSG:2154'},
  {label: 'EPSG:3942', value: 'EPSG:3942'},
  {label: 'EPSG:3943', value: 'EPSG:3943'},
  {label: 'EPSG:3944', value: 'EPSG:3944'},
  {label: 'EPSG:3945', value: 'EPSG:3945'},
  {label: 'EPSG:3946', value: 'EPSG:3946'},
  {label: 'EPSG:3947', value: 'EPSG:3947'},
  {label: 'EPSG:3948', value: 'EPSG:3948'},
  {label: 'EPSG:3949', value: 'EPSG:3949'},
  {label: 'EPSG:3950', value: 'EPSG:3950'},
  {label: 'EPSG:32620', value: 'EPSG:32620'},
  {label: 'EPSG:5490', value: 'EPSG:5490'},
  {label: 'EPSG:2971', value: 'EPSG:2971'},
  {label: 'EPSG:2975', value: 'EPSG:2975'},
  {label: 'EPSG:4471', value: 'EPSG:4471'}
]

export function getNatures(value) {
  return getLabelFromValue(value, natureOptions)
}

export function getDiffusions(value) {
  return getLabelFromValue(value, diffusionOptions)
}

export function getPublications(value) {
  return getLabelFromValue(value, publicationOptions)
}

export function getLicences(value) {
  return getLabelFromValue(value, licenceOptions)
}
