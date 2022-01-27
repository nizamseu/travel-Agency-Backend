const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

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
    const user = database.collection("users");
    const blogs = database.collection("blogs");
    const reviews = database.collection("reviews");

    app.post("/addBlog", async (req, res) => {
      const data = req.body;
      const result = await blogs.insertOne(data);

      res.send(result);
    });

    // get allBlogs

    app.get("/addBlog", async (req, res) => {
      const result = blogs.find({});
      const blogsData = await result.toArray();
      res.json(blogsData);
    });

    // Find single Item
    app.get("/findBlog/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await blogs.findOne(query);
      res.send(result);
    });

    app.post("/addReview", async (req, res) => {
      const data = req.body;
      const result = await reviews.insertOne(data);
      res.send(result);
    });

    app.get("/getReviews", async (req, res) => {
      const result = reviews.find({});
      const reviewData = await result.toArray();
      res.json(reviewData);
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
