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

    // add user
    app.post("/addUser", async (req, res) => {
      const data = req.body;
      data.role = "user";
      const result = await user.insertOne(data);

      res.send(result);
    });

    // cheeck email
    app.get("/checkmail/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };

      const data = user.find(filter);
      const result = await data.toArray();
      res.send(result);
    });

    app.post("/addBlog", async (req, res) => {
      const data = req.body;
      const result = await blogs.insertOne(data);

      res.send(result);
    });

    // get allBlogs

    app.get("/addBlog", async (req, res) => {
      const result = blogs.find({});

      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const count = await result.count();
      let blogsData;
      if (page) {
        blogsData = await result
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        blogsData = await result.limit(size).toArray();
      }

      res.json({ count, blogsData });
    });

    app.get("/blogByStatus", async (req, res) => {
      const result = blogs.find({});

      const count = await blogs.result();
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

    // add new post
    app.post("/addReview", async (req, res) => {
      const data = req.body;
      const result = await reviews.insertOne(data);
      res.send(result);
    });

    // get all the veriews
    app.get("/getReviews", async (req, res) => {
      const result = reviews.find({});
      const reviewData = await result.toArray();
      res.json(reviewData);
    });

    // find reviews titlebase

    app.get("/findReview/:category", async (req, res) => {
      const category = req.params.category;
      const filter = { category: category };

      const data = reviews.find(filter);
      const result = await data.toArray();
      res.send(result);
    });

    // delete revied
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviews.deleteOne(filter);
      res.json(result);
    });

    // pagination
    // app.get('/blogbystatus', async (req, res) => {
    //   const query = { status: "approve" }
    //   const cursor = blogCollection.find(query);
    //   const page = parseInt(req.query.page);
    //   const size = parseInt(req.query.size)
    //   console.log(req.query)
    //   const count = await cursor.count();
    //   let blogs;
    //   if (page) {
    //       blogs = await cursor.skip(page * size).limit(size).toArray();
    //   }
    //   else {
    //       blogs = await cursor.limit(size).toArray();
    //   }

    //   res.send({
    //       count,
    //       blogs
    //   });
    // })
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
