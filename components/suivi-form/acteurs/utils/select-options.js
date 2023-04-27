export const roleOptions = [
  {label: 'Autorité Public Locale Compétente', value: 'aplc'},
  {label: 'Porteur de projet non APLC', value: 'porteur'},
  {label: 'Financeur', value: 'financeur'},
  {label: 'Diffuseur des livrables', value: 'diffuseur'},
  {label: 'Prestataire de vol', value: 'presta_vol'},
  {label: 'Prestataire de relevé LIDAR', value: 'presta_lidar'},
  {label: 'Contrôleur des livrables', value: 'controleur'}
]

export function getRoles() {
  const rolesObj = {}
  roleOptions.map(role => {
    rolesObj[role.value] = role.label
    return role
  })

  return rolesObj
}
