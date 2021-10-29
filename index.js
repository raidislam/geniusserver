const { MongoClient } = require("mongodb");
const express = require("express");
const objectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//get api
app.get("/", (req, res) => {
  res.send("welcome");
});

//mongodb connection

const uri =
  "mongodb+srv://car:JwGx6gGbvv6odBzp@cluster0.c91k8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Mongo");
    const database = client.db("carMaster");
    const servicesCollection = database.collection("services");

    //get api single services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = await { _id: objectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    //get api service
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.json(services);
    });

    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit post");
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    //delete service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = await { _id: objectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

//listen server response
app.listen(port, () => {
  console.log("server running ", port);
});
