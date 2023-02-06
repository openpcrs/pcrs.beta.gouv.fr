export async function getProject(id) {
  const projets = await fetch('/projets.json').then(res => res.json())

  return projets.find(projet => projet.id === id)
}
