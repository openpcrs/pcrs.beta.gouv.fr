import mongo from '../util/mongo.js'

export async function getLatestChanges() {
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1)

  return mongo.db.collection('projets').find({
    $or: [
      {_created: {$gt: twentyFourHoursAgo}},
      {_updated: {$gt: twentyFourHoursAgo}},
      {_deleted: {$gt: twentyFourHoursAgo}}
    ]
  }).toArray()
}
