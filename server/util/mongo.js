/* eslint-disable unicorn/numeric-separators-style */
import process from 'node:process'

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
    await this.db.collection('projets').createIndex({editorKey: 1}, {unique: true, sparse: true})
    await this.db.collection('creators').createIndex({token: 1}, {unique: true, sparse: true})
    await this.db.collection('creators').createIndex({createdAt: 1}, {expireAfterSeconds: 86400}) // 24 heures
    await this.db.collection('versions').createIndex({_projet: 1})
    await this.db.collection('versions').createIndex({_projet: 1, _created: 1}, {unique: true})
    await this.db.collection('creators-emails').createIndex({email: 1}, {unique: true})
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

  decorateCreation(obj) {
    const now = new Date()

    obj._created = now
    obj._updated = now
    obj._id = new ObjectId()
  }

  decorateUpdate(obj) {
    obj._updated = new Date()
  }
}

const mongo = new Mongo()

export default mongo
export {ObjectId} from 'mongodb'

