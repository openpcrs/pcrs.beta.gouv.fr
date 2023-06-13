import mongo from '../util/mongo.js'

export async function getUpdatedProjets(since) {
  const sinceDate = new Date(since)

  return mongo.db.collection('projets').find(
    {_updated: {$gt: sinceDate}}
  ).sort({_updated: -1}).toArray()
}
