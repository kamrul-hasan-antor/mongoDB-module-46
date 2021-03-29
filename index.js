const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const password = "01975429584";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri =
  "mongodb+srv://organicUser:01975429584@cluster0.dcrxy.mongodb.net/organicdb?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");
  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/addProduct", (req, res) => {
    // const product = req.body;
    productCollection.insertOne(product).then((result) => {
      res.redirect("/");
    });
  });

  app.patch("/update/:id", (req, res) => {
    // console.log(req.body.price);
    productCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(3000);
