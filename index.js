const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// Middleware //
app.use(cors());
app.use(express.json());

// Mongo_DB Database Connections Code//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.053o8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const databaseCollection = client.db('inventory_database').collection('productapi');

        // GET Data //
        app.get('/productapi', async (req, res) => {
            const query = {}
            const cursor = databaseCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });

        // Post Data -> Add new Api data //
        app.post('/productapi', async (req, res) => {
            const newProduct = req.body;
            const result = await databaseCollection.insertOne(newProduct);
            res.send(result);
        });

        // Delete Api data //
        app.delete('/productapi/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await databaseCollection.deleteOne(query);
            res.send(result);
        });

    }

    finally {
    }

};

run().catch(console.log('DB Connect Success'));

app.get('/', (req, res) => {
    res.send('Server is Connected');
});

app.listen(port, () => {
    console.log(`This server is running port ${port}`);
});