// Load environment variables from .env file
require('dotenv').config();

const { MongoClient } = require('mongodb');

// Get the connection string from the environment variable
const uri = process.env.MONGO_URI;

// Check if the URI is loaded
if (!uri) {
  console.error("❌ Error: MONGO_URI not found in .env file.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Success! You successfully connected to MongoDB Atlas.");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas.");
    console.error(error);
  } finally {
    await client.close();
  }
}

run();