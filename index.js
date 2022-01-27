const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
// userName and Pass
const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
// travelAgency
// 4vDzW0QGKpFfqPoM

const uri = `mongodb+srv://travelAgency:4vDzW0QGKpFfqPoM@cluster0.tgh4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();

    console.log("database");
    const database = client.db("travelAgency");
    const productsCollection = database.collection("users");

    // app.post("/postMany", async (req, res) => {
    //   const data = req.body;
    //   const result = await productsCollection.insertMany(data);

    //   res.send(result);
    // });

    // get allproducts

    app.get("/products", async (req, res) => {
      const result = productsCollection.find({});
      const products = await result.toArray();
      res.json(products);
    });
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.json("Hello Root");
});

app.listen(port, () => {
  console.log("I am listening");
});
