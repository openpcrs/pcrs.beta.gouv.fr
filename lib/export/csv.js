/* eslint-disable camelcase */
import Papa from 'papaparse'
import Wellknown from 'wellknown'

import {getProjets} from '../../server/projets.js'
import {buildGeometryFromTerritoires} from '../../lib/territoires.js'

async function computeWtk(perimetres) {
  const perimetresGeojson = await buildGeometryFromTerritoires(perimetres)
  return Wellknown.stringify(perimetresGeojson)
}

export async function exportProjetsAsCSV(includesWkt) {
  const projets = await getProjets()

  const rows = await Promise.all(projets.map(async projet => {
    const resultRows = ({
      idProjet: projet._id,
      nom: projet.nom,
      regime: projet.regime,
      nature: projet.nature,
      statut: projet.etapes?.length > 0 ? projet.etapes[projet.etapes.length - 1]?.statut : '',
      investigation_date: projet?.etapes?.find(e => e.statut === 'investigation')?.date_debut || '',
      production_date: projet?.etapes?.find(e => e.statut === 'production')?.date_debut || '',
      produit_date: projet?.etapes?.find(e => e.statut === 'produit')?.date_debut || '',
      livre_date: projet?.etapes?.find(e => e.statut === 'livre')?.date_debut || '',
      obsolete_date: projet?.etapes?.find(e => e.statut === 'obsolete')?.date_debut || ''
    })

    if (includesWkt) {
      resultRows.geometrie = await computeWtk(projet.perimetres)
    }

    return resultRows
  }))

  return Papa.unparse(rows)
}

export async function exportLivrablesAsCSV() {
  const projets = await getProjets()
  const rows = []

  for (const projet of projets) {
    const livrablesRows = projet.livrables.map(livrable => ({
      refProjet: projet._id,
      nomProjet: projet.nom,
      nom: livrable?.nom || '',
      nature: livrable?.nature || '',
      date_livraison: livrable?.date_livraison || '',
      licence: livrable?.licence || '',
      publication: livrable?.publication || '',
      diffusion: livrable?.diffusion || '',
      avancement: livrable?.avancement || '',
      crs: livrable?.crs || '',
      compression: livrable?.compression || ''
    }))

    rows.push(...livrablesRows)
  }

  return Papa.unparse(rows)
}

export async function exportToursDeTableAsCSV() {
  const projets = await getProjets()
  const rows = []

  for (const projet of projets) {
    const toursDeTableRows = projet.acteurs.map(acteur => ({
      refProjet: projet._id,
      nomProjet: projet.nom,
      nomActeur: acteur?.nom,
      sirenActeur: acteur?.siren,
      interlocuteur: acteur?.interlocuteur || '',
      mail: acteur?.mail || '',
      telephone: acteur?.telephone || '',
      role: acteur?.role || '',
      finance_part_perc: acteur?.finance_part_perc || '',
      finance_part_euro: acteur?.finance_part_euro || ''
    }))

    rows.push(...toursDeTableRows)
  }

  return Papa.unparse(rows)
}

export async function exportSubventionsAsCSV() {
  const projets = await getProjets()
  const rows = []

  for (const projet of projets) {
    if (projet?.subventions) {
      const subventionsRows = projet.subventions.map(subvention => ({
        refProjet: projet._id,
        nomProjet: projet.nom,
        nom: subvention?.nom,
        nature: subvention?.nature,
        montant: subvention?.montant,
        echeance: subvention?.echeance
      }))

      rows.push(...subventionsRows)
    }
  }

  return Papa.unparse(rows)
}

