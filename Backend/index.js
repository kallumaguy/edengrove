import express from 'express';
import cors from 'cors';

const app = express()
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000

//middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//

import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://edengrove:Paradise123@cluster0.hydgntg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();

    //create a collection of documents
    const garment = client.db("garmentInventory").collection("garments");

    // Insert a garment to db: post method
    app.post('/upload-garment', async (req, res) => {
      const garmentData = req.body;
      const result = await garment.insertOne(garmentData);
      res.send(result);
    });

    // get all garments from db: get method
    app.get('/get-garments', async (req, res) => {
      const garments =  garment.find();
      const result = await garments.toArray();
      res.send(result);
    }
    );

    

    //update a garment in db: patch or update method
    app.patch('/update-garment/:id', async (req, res) => {
      const id = req.params.id;
      
      const updateGarmentData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          ...updateGarmentData,
        }
      };

      // update the garment in the db
      const result = await garment.updateOne(filter, updateData, options);
      res.send(result);
    }
    );

    // delete a garment from db: delete method
    app.delete('/delete-garment/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await garment.deleteOne(filter);
      res.send(result);
    }
    );

    // get a garment from db by category by query: get method

    app.get('/get-garment', async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      const result = await garment.find(query).toArray();
      res.send(result);
    });






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