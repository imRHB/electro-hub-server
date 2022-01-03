const express = require('express');
// import { MongoClient } from 'mongodb';
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Main Function run
async function run() {
    try {
        await client.connect();

        // ElectroHub database
        const database = client.db('electro-hub');

        // ElectroHub DB collection

    }

    finally {
        // client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ElectroHub Server is running ...');
});

app.listen(port, (req, res) => {
    console.log('ElectroHub Server is running at port', port);
});
