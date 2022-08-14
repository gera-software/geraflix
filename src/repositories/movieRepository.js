const { MongoClient } = require("mongodb")

const uri = process.env.MONGO_URI
// const uri = "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";

const find = async ({ namespace }) => {
    let client = null

    try {
        client = new MongoClient(uri)
        const database = client.db('geraflix')
        const movies = database.collection('movies')

        const query = { namespace }

        const cursor = movies.find(query)

        return await cursor.toArray()

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}

const findOne = async ({ namespace, title }) => {
    let client = null;

    try {
        client = new MongoClient(uri)
        const database = client.db('geraflix')
        const movies = database.collection('movies')

        const query = { namespace, title }

        return await movies.findOne(query)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}

const insertOne = async ({ namespace, title }) => {
    let client = null

    try {
        client = new MongoClient(uri)
        const database = client.db('geraflix')
        const movies = database.collection('movies')

        const doc = { title, namespace }
        const result = await movies.insertOne(doc)

        return result.insertedId
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}

const deleteOne = async ({ namespace, title }) => {
    let client = null

    try {
        client = new MongoClient(uri)
        const database = client.db('geraflix')
        const movies = database.collection('movies')

        const query = { title, namespace }
        const result = await movies.deleteOne(query)

        return result.deletedCount
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}

module.exports = {
    find,
    findOne,
    insertOne,
    deleteOne,
}