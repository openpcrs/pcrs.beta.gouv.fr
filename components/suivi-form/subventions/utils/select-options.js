export const natureOptions = [
  {value: 'feder', label: 'Financement FEDER'},
  {value: 'cepr', label: 'Contrat État-Région'},
  {value: 'detr', label: 'Dotations de l’État aux Territoires Ruraux'}
]

export function getNatures() {
  const naturesObj = {}
  natureOptions.map(nature => {
    naturesObj[nature.value] = nature.label
    return nature
  })

  return naturesObj
}
