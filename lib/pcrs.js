export async function getProject(id) {
  const projets = await fetch('/projets').then(res => res.json())

  return projets.find(projet => projet._id === id)
}
