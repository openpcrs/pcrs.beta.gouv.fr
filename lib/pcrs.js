export async function getProject(id) {
  const projets = await fetch(`/projets/${id}`).then(res => res.json())

  return projets
}

