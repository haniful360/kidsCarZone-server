const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('kids cars zone server is running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohczye1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db('kidsCarZone').collection("addToys")
    // const categoryCollection = client.db('kidsCarZone').collection('category')
    // const subCategoryCollection = client.db('kidsCarZone').collection('subCategory')

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result);
    })

    // toyname query
    app.get('/toyname', async (req, res) => {
      let query = {};
      // console.log(req.query);
      if (req.query?.name) {
        query = { name: req.query.name }
      }
      const result = await toyCollection.find(query).toArray();
      // console.log(req.query);
      res.send(result);
    })

    // specific email user query
    app.get('/toys', async (req, res) => {
      // console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { selleremail: req.query.email }
        // const sort = req.query?.sort === 'true' ? 1 : -1;
        // .sort({ price: sort })
      }
      const result = await toyCollection.find(query).limit(20).toArray();
      res.send(result);
    })

    // sub category route

    app.get('/subcategory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result);
    })

    // subcategory query
    app.get('/subcategory', async (req, res) => {
      // console.log(req.query);
      let query = {}
      if (req.query?.subcategory) {
        query = { subcategory: req.query.subcategory }
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/toys', async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body)
      res.send(result);
    })

    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log('update', id);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToys = req.body;
      const updateDoc = {
        $set: {
          ...updatedToys
        }
      };
      const result = await toyCollection.updateOne(filter, updateDoc, options);
      res.send(result);

    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result)
      console.log('delete', id);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})