import projects from '../fakeprojets.json'

export function getProject(id) {
  return projects.find(project => project.id === id)
}
