const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://wowwow1:wowwow1@cluster0.8zbo5.mongodb.net/papermemes?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    
    // Try to access the papermemes database
    const db = client.db("papermemes");
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.close();
  }
}

run(); 