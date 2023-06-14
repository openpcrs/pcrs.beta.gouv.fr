import mongo from '../util/mongo.js'

export async function getUpdatedProjets(since) {
  return mongo.db.collection('projets').find(
    {_updated: {$gt: since}}
  ).sort({_updated: -1}).toArray()
}
