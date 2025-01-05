import { MongoClient, Collection, Document, OptionalId, WithId } from 'mongodb'

if (!process.env.MONGODB_URI) {
  console.error('MongoDB URI is missing from environment variables')
  throw new Error('Please add your Mongo URI to .env.local')
}

console.log('Initializing MongoDB connection...')
const uri = process.env.MONGODB_URI
console.log('MongoDB URI:', uri.replace(/:[^:]+@/, ':****@'))

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Creating new MongoDB client in development mode...')
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then((client: MongoClient) => {
        console.log('MongoDB connected successfully in development mode')
        return client
      })
      .catch((error: Error) => {
        console.error('MongoDB connection error in development mode:', error)
        throw error
      })
  } else {
    console.log('Reusing existing MongoDB client in development mode')
  }
  clientPromise = globalWithMongo._mongoClientPromise as Promise<MongoClient>
} else {
  console.log('Creating new MongoDB client in production mode...')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then((client: MongoClient) => {
      console.log('MongoDB connected successfully in production mode')
      return client
    })
    .catch((error: Error) => {
      console.error('MongoDB connection error in production mode:', error)
      throw error
    })
}

export default clientPromise

export async function getCollection(dbName: string, collectionName: string): Promise<Collection> {
  try {
    console.log(`Getting collection ${collectionName} from database ${dbName}...`)
    const client = await clientPromise
    const db = client.db(dbName)
    const collection = db.collection(collectionName)
    console.log(`Successfully got collection ${collectionName}`)
    return collection
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

export async function findOne<T extends Document>(dbName: string, collectionName: string, query: Record<string, any>): Promise<T | null> {
  try {
    console.log(`Finding one document in ${collectionName} with query:`, query)
    const collection = await getCollection(dbName, collectionName)
    const result = await collection.findOne<T>(query)
    console.log(`Find one result:`, result ? 'Document found' : 'No document found')
    return result
  } catch (error) {
    console.error(`Error in findOne for ${collectionName}:`, error)
    throw error
  }
}

export async function find<T extends Document>(dbName: string, collectionName: string, query: Record<string, any>): Promise<T[]> {
  try {
    console.log(`Finding documents in ${collectionName} with query:`, query)
    const collection = await getCollection(dbName, collectionName)
    const results = await collection.find<T>(query).toArray()
    console.log(`Found ${results.length} documents`)
    return results
  } catch (error) {
    console.error(`Error in find for ${collectionName}:`, error)
    throw error
  }
}

export async function insertOne<T extends Document>(dbName: string, collectionName: string, document: OptionalId<T>) {
  try {
    console.log(`Inserting document into ${collectionName}:`, document)
    const collection = await getCollection(dbName, collectionName)
    const result = await collection.insertOne(document)
    console.log(`Document inserted with ID:`, result.insertedId)
    return result
  } catch (error) {
    console.error(`Error in insertOne for ${collectionName}:`, error)
    throw error
  }
}

export async function updateOne<T extends Document>(
  dbName: string,
  collectionName: string,
  query: Record<string, any>,
  update: Record<string, any>,
  options = { upsert: false }
) {
  try {
    console.log(`Updating document in ${collectionName}:`, { query, update, options })
    const collection = await getCollection(dbName, collectionName)
    const result = await collection.updateOne(query, update, options)
    console.log(`Update result:`, {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedId
    })
    return result
  } catch (error) {
    console.error(`Error in updateOne for ${collectionName}:`, error)
    throw error
  }
}

export async function deleteOne(dbName: string, collectionName: string, query: Record<string, any>) {
  try {
    console.log(`Deleting document from ${collectionName} with query:`, query)
    const collection = await getCollection(dbName, collectionName)
    const result = await collection.deleteOne(query)
    console.log(`Delete result: ${result.deletedCount} document(s) deleted`)
    return result
  } catch (error) {
    console.error(`Error in deleteOne for ${collectionName}:`, error)
    throw error
  }
} 