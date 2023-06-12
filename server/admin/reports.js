import mongo from '../util/mongo.js'

export async function getUpdatedProjets(since) {
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1)
  const sinceDate = since ? new Date(since) : twentyFourHoursAgo

  return mongo.db.collection('projets').find({
    $or: [
      {_updated: {$gt: sinceDate}}
    ]
  }).sort({_updated: -1}).toArray()
}
