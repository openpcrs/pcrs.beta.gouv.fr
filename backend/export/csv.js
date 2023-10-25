/* eslint-disable camelcase */
import Papa from 'papaparse'
import Wellknown from 'wellknown'

import {getProjets} from '../lib/models/projets.js'
import {buildGeometryFromTerritoires} from '../lib/territoires.js'

async function computeWtk(perimetres) {
  const perimetresGeojson = await buildGeometryFromTerritoires(perimetres)
  return Wellknown.stringify(perimetresGeojson)
}

export async function exportProjetsAsCSV(includes_wkt) {
  const projets = await getProjets()

  const rows = await Promise.all(projets.map(async projet => {
    const resultRows = ({
      id_projet: projet._id,
      nom: projet.nom,
      regime: projet.regime,
      nature: projet.nature,
      statut: projet.etapes.length > 0 ? projet.etapes.at(-1).statut : '',
      investigation_date: projet.etapes.find(e => e.statut === 'investigation')?.date_debut || '',
      convention_signee_date: projet.etapes.find(e => e.statut === 'convention_signee')?.date_debut || '',
      marche_public_en_cours_date: projet.etapes.find(e => e.statut === 'marche_public_en_cours')?.date_debut || '',
      prod_en_cours_date: projet.etapes.find(e => e.statut === 'prod_en_cours')?.date_debut || '',
      controle_en_cours_date: projet.etapes.find(e => e.statut === 'controle_en_cours')?.date_debut || '',
      disponible_date: projet.etapes.find(e => e.statut === 'disponible')?.date_debut || '',
      obsolete_date: projet.etapes.find(e => e.statut === 'obsolete')?.date_debut || ''
    })

    if (includes_wkt) {
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
    for (const livrable of projet.livrables) {
      rows.push({
        ref_projet: projet._id,
        nom_projet: projet.nom,
        nom: livrable.nom || '',
        nature: livrable.nature || '',
        date_livraison: livrable.date_livraison || '',
        licence: livrable.licence || '',
        diffusion: livrable.diffusion || '',
        stockage: livrable.stockage || '',
        stockage_public: livrable.stockage_public || '',
        avancement: livrable.avancement || '',
        publication: '',
        crs: '',
        compression: ''
      })
    }
  }

  return Papa.unparse(rows)
}

export async function exportToursDeTableAsCSV() {
  const projets = await getProjets()
  const rows = []

  for (const projet of projets) {
    for (const acteur of projet.acteurs) {
      rows.push({
        ref_projet: projet._id,
        nom_projet: projet.nom,
        nom_acteur: acteur.nom,
        siren_acteur: acteur.siren,
        interlocuteur: acteur.interlocuteur || '',
        mail: acteur.mail || '',
        telephone: acteur.telephone || '',
        role: acteur.role || '',
        finance_part_perc: acteur.finance_part_perc || '',
        finance_part_euro: acteur.finance_part_euro || ''
      })
    }
  }

  return Papa.unparse(rows)
}

export async function exportSubventionsAsCSV() {
  const projets = await getProjets()
  const rows = []

  for (const projet of projets) {
    if (projet?.subventions) {
      for (const subvention of projet.subventions) {
        rows.push({
          ref_projet: projet._id,
          nom_projet: projet.nom,
          nom: subvention.nom,
          nature: subvention.nature,
          montant: subvention.montant || '',
          echeance: subvention.echeance || ''
        })
      }
    }
  }

  return Papa.unparse(rows)
}

export async function exportEditorKeys() {
  const projets = await getProjets()
  const rows = projets.map(projet => ({
    nom_projet: projet.nom,
    ref_projet: projet._id,
    editor_key: projet.editorKey
  }))

  return Papa.unparse(rows)
}
