import {nanoid} from 'nanoid'
import mongo from './mongo.js'

export async function generateEditorKey(projetId) {
  projetId = mongo.parseObjectId(projetId)

  const projet = await mongo.db.collection('projets').findOne({_id: projetId})

  if (!projet.editorKey) {
    const nanoId = nanoid()

    await mongo.db.collection('projets').updateOne(
      {_id: projet._id},
      {$set: {editorKey: nanoId}}
    )
  }
}

