const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const db = require("../controllers/db");
const debug = require('debug')('server');
require('dotenv').config()
const tripsRouter = require('../routes/routes')
require('../controllers/repoFunctions')
const TripsModel = require("../models/trips-model");

const app = express();
const port = process.env.REACT_APP_PORT || 3000;


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build"))); // to access built React project

mongoose.connect("mongodb+srv://annar:process.env.REACT_APP_PASSWORD@@ExpenseTracker.tmkg2z6.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
})

app.get("/", async (req, res) => {
  const isConnected = await db.checkDB();
  if(isConnected) {
    res.send("DB Connected")
    return
  }
  res.send("DB not Connected");
});

app.get("/trips", async (req, res) => {
  const trips = await db.getTrips();
  res.send(trips);
  res.send(req.body)
})

app.use("/trips", tripsRouter);

// All other GET requests not handled before will return static React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



