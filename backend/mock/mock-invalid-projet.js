
/* eslint-disable camelcase */
/* eslint-disable unicorn/numeric-separators-style */

const invalidProjet = {
  nom: 'Germonde',
  regime: 'productio',
  nature: 'rastèr',
  livrables: [
    {
      nom: 'Images raster',
      nature: 'geotouff',
      diffusion: 'flox',
      licence: 'ouverte_lo',
      avancement: '12',
      publication: 'bonjour'
    }
  ],
  acteurs: [
    {
      siren: 2000473890,
      nom: 'FDEA08',
      telephone: '+33324594528333',
      role: 'apIc'
    },
    {siren: 444608442, nom: 'Eneonze', role: 'financeuse'}
  ],
  perimetres: ['departement:00'],
  etapes: [
    {statut: 'investigation', date_debut: null},
    {statut: 'prod_en_cours', date_debut: '1999-02-11'},
    {statut: 'disponible', date_debut: '2010-13-12'}
  ],
  subventions: [{nom: 'Participation feder', ntr: 'feder'}]
}

export default invalidProjet
