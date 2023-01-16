export default function validatePCRSFile(entry) {
  const entryFields = Object.keys(entry)

  const REQUIRED_FIELDS = [
    'nom',
    'regime',
    'nature',
    'livrables',
    'acteurs',
    'perimetres',
    'etapes',
    'subventions'
  ]

  const REQUIRED_ETAPES_FIELDS = [
    'statut',
    'date_debut'
  ]

  const REQUIRED_LIVRABLES_FIELDS = [
    'nom',
    'nature',
    'licence'
  ]

  const REQUIRED_ACTEURS_FIELDS = [
    'siren'
  ]

  function validateFields(requiredFields, fields) {
    for (const key of fields) {
      if (requiredFields.some(f => !Object.keys(key).includes(f))) {
        throw new Error('Missing field')
      }
    }
  }

  if (REQUIRED_FIELDS.some(field => !entryFields.includes(field))) {
    throw new Error('A field is missing in the object')
  }

  validateFields(REQUIRED_ETAPES_FIELDS, entry.etapes)
  validateFields(REQUIRED_LIVRABLES_FIELDS, entry.livrables)
  validateFields(REQUIRED_ACTEURS_FIELDS, entry.acteurs)
}

