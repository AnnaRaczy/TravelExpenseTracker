const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const debug = require('debug')('server');
require('dotenv').config()
const tripsRouter = require('../routes/routes')
require('../controllers/repoFunctions')
require("../models/model");
const { nextTick } = require("process");

const app = express();
const port = process.env.REACT_APP_PORT || 3000;


app.use(express.static(path.resolve(__dirname, "../client/build"))); 

const URI = "mongodb+srv://annar:QazwsxEdc@Trips.tmkg2z6.mongodb.net/?retryWrites=true&w=majority"

const DB = async (req, res, next) => {
  await mongoose.connect(URI);
  next()
}

const UserFromDB = async (req, rec, next) => {
  const user = await UserModel.findByUsername(req.params.user);
  if(!user) {
    res.send(`User ${req.params.user} does not exist.`)
  }
  req.params.user = user;
  next()
}

app.get("/", async (req, res) => {
  const isConnected = await DB.checkDB();
  if(isConnected) {
    res.send("DB Connected")
    return
  }
  res.send("DB not Connected");
});

app.post('/user/:user/add', express.json(), DB, async (req, res, next) => {
  const {username, name, email} = req.body

  const user = new UserModel({
    username,
    name,
    email
  })

  await user.save()
  res.send(`Added user ${user.username}`)
  next();
})

app.get('/user/:user/trips', DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params;

  const trips = await user.getTrips();
  res.send(trips);
  next();
})

app.post('/user/:user/:trip', express.json(), DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params;

  await user.addTrip()
  res.send(`Added trip to ${trip.name}`)
  next();
})

app.put('/user/:user/:trip', express.json(), DB, UserFromDB, async(req, res) => {
  const { user } = req.params

  await user.updateTrip()
  res.send('Trip updated');

})

app.delete('/user/:user/:trip', express.json(), DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params

  await user.deleteTrip();
  res.send('Delete request called')
})

app.get('/user/:user/expenses', DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params;

  const expenses = await user.getExpenses();
  res.send(expenses);
  next();
})

app.post('/user/:user/:expense', DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params;
  
  await user.addExpense(expense);
  res.send(`Added expense to ${expense.category}`)
  next()
})

app.put('/user/:user/:expense', express.json(), DB, UserFromDB, async(req, res) => {
  const { user } = req.params;

  await user.updateExpense()
  res.send('Expense updated');

})

app.delete('/user/:user/:expense', express.json(), DB, UserFromDB, async(req, res, next) => {
  const { user } = req.params;

  await user.deleteExpense();
  res.send('Delete request called')
})

// All other GET requests not handled before will return static React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



