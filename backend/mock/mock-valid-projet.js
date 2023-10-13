/* eslint-disable camelcase */
/* eslint-disable unicorn/numeric-separators-style */

const validProjet = {
  nom: 'Nom du pcrs',
  regime: 'production',
  nature: 'raster',
  livrables: [
    {
      nom: 'Nom du livrable',
      nature: 'geotiff',
      diffusion: 'wmts',
      licence: 'ouvert_odbl',
      avancement: 100,
      crs: 'EPSG:2971',
      compression: 'none'
    }
  ],
  acteurs: [
    {
      nom: 'living data',
      siren: 813600889,
      role: 'aplc',
      telephone: '0600000000',
      finance_part_perc: 50,
      finance_part_euro: 120000
    }
  ],
  perimetres: [
    'epci:200039865'
  ],
  etapes: [
    {
      statut: 'investigation',
      date_debut: '2023-02-06'
    },
    {
      statut: 'prod_en_cours',
      date_debut: '2024-02-08'
    }
  ],
  subventions: [
    {
      nom: 'Une subvention voilà quoi',
      nature: 'feder',
      montant: 100000,
      echeance: '2024-04-10'
    }
  ]
}

export default validProjet
