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
        const productCollection = database.collection('products');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');


        // Backend Server API

        // GET API : Products
        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.json(products);
        });

        // GET API : Single product
        app.get('/product/:productId', async (req, res) => {
            const productId = req.params.productId;
            const query = { _id: ObjectId(productId) };
            const product = await productCollection.findOne(query);
            res.json(product);
        });

        // GET API : Reviews
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray();
            res.json(reviews);
        });

        // GET API : Orders
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.json(orders);
        });

        // GET API : Order filter by email
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const orders = orderCollection.find(query);
            const result = await orders.toArray();
            res.json(result);
        });

        // POST API : Product order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

        // POST API : Add product
        app.post('/add-product', async (req, res) => {
            const newProduct = req.body;
            const result = productCollection.insertOne(newProduct);
            res.json(result);
        });

        // POST API : Add review
        app.post('/add-review', async (req, res) => {
            const newReview = req.body;
            const result = reviewCollection.insertOne(newReview);
            res.json(result);
        });

        // PUT API : Order status
        app.put('/orders/:productId', async (req, res) => {
            const productId = req.params.productId;
            const filter = { _id: ObjectId(productId) };
            const options = { upsert: true };
            const updateStatus = {
                $set: {
                    status: req.body.status
                }
            };
            const result = await orderCollection.updateOne(filter, updateStatus, options);
            res.json(result);
            console.log(req.body.status);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        });

        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'user'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });


        // DELETE API : Product
        app.delete('/product/:productId', async (req, res) => {
            const productId = req.params.productId;
            const query = { _id: ObjectId(productId) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE API : Order
        app.delete('/orders/:productId', async (req, res) => {
            const productId = req.params.productId;
            const query = { _id: productId };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });
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
