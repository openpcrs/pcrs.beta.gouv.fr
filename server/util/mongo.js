import {MongoClient, ObjectId} from 'mongodb'

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost'
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'pcrs'

class Mongo {
  async connect(connectionString) {
    if (this.db) {
      throw new Error('mongo.connect() should not be called twice')
    }

    this.client = new MongoClient(connectionString || MONGODB_URL)
    await this.client.connect()
    this.dbName = MONGODB_DBNAME
    this.db = this.client.db(this.dbName)

    await this.createIndexes()
  }

  async createIndexes() {
    await this.db.collection('projets').createIndex({nom: 1}, {unique: true})
  }

  disconnect(force) {
    const {client} = this
    this.client = undefined
    this.db = undefined

    return client.close(force)
  }

  parseObjectId(string) {
    try {
      return new ObjectId(string)
    } catch {
      return null
    }
  }

  decorateCreation(projet) {
    const now = new Date()

    projet._created = now
    projet._updated = now
    projet._id = new ObjectId()
  }

  decorateUpdate(projet) {
    projet._updated = new Date()
  }
}

const mongo = new Mongo()

export default mongo
export {ObjectId} from 'mongodb'

