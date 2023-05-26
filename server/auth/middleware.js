import process from 'node:process'
import createError from 'http-errors'

import {getProjetByEditorKey} from '../projets.js'
import {getCreatorByToken} from './pin-code/index.js'

const {ADMIN_TOKEN} = process.env

if (!ADMIN_TOKEN) {
  throw new Error('Le serveur ne peut pas démarrer car ADMIN_TOKEN n\'est pas défini')
}

function parseToken(req) {
  const headerValue = req.get('Authorization')

  if (!headerValue || !headerValue.startsWith('Token ')) {
    return
  }

  return headerValue.slice(6)
}

async function authenticate(token) {
  if (token === ADMIN_TOKEN) {
    return {
      role: 'admin'
    }
  }

  const relatedProjet = await getProjetByEditorKey(token)

  if (relatedProjet) {
    return {
      role: 'editor',
      canEditProjetId: relatedProjet._id
    }
  }

  const creatorEntry = await getCreatorByToken(token)

  if (creatorEntry) {
    return {
      creator: creatorEntry.creator,
      role: 'creator'
    }
  }
}

export async function handleAuth(req, res, next) {
  const token = parseToken(req)

  if (!token) {
    return next()
  }

  const auth = await authenticate(token)

  if (!auth) {
    throw createError(403, 'Jeton invalide')
  }

  Object.assign(req, auth)

  next()
}

export function ensureProjectEditor(req, res, next) {
  if (req.role === 'admin') {
    return next()
  }

  if (req.role === 'editor' && req.canEditProjetId.toString() === req.params.projetId) {
    return next()
  }

  throw createError(403, 'Vous n’êtes pas autorisé à modifier ce projet')
}

export function ensureCreator(req, res, next) {
  if (req.role === 'admin' || req.role === 'creator') {
    return next()
  }

  throw createError(403, 'Vous n’êtes pas autorisé à créer un projet')
}

export function ensureAdmin(req, res, next) {
  if (req.role === 'admin') {
    return next()
  }

  throw createError(403, 'Vous n’êtes pas autorisé à accéder à cette information')
}
