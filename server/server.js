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


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build"))); // to access built React project

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
  const isConnected = await db.checkDB();
  if(isConnected) {
    res.send("DB Connected")
    return
  }
  res.send("DB not Connected");
});

app.post('/user/add', express.json(), DB, async (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email
  })

  await user.save()
  res.send(`Added user ${user.username}`)
  next();
})

app.get('/user/:user/trips', DB, UserFromDB, async(req, res, next) => {
  const user = req.params.user;
  console.log(user);

  const trips = await user.getTrips();
  res.send(trips);
  next();
})

app.post('/user/:user/trips', express.json(), DB, UserFromDB, async(req, res, next) => {
  const user = req.params.user

  const trip = new TripsModel({
    name: req.body.name,
    budget: req.body.budget,
    from: req.body.from,
    to: req.body.to
  })

  await trip.save();
  await user.addTrip(trip)
  res.send(`Added trip to ${trip.name}`)
  next();
})

app.delete('/user/:user/:trip', express.json(), DB, UserFromDB, async(req, res, next) => {

  const user = req.params.user
  await user.deleteTrip();
  console.log("Trip deleted");
  res.send('Delete request called')


})

app.get('/user/:user/expenses', DB, UserFromDB, async(req, res, next) => {
  const user = req.params.user;
  console.log(user);

  const expenses = await user.getExpenses();
  res.send(expenses);
  next();
})

app.post('/user/:user/expenses', DB, UserFromDB, async(req, res, next) => {
  const user = req.params.user;
  console.log(user);

  const expense = new ExpensesModel({
    category: req.body.category,
    amount: req.body.amount
  })

  await expense.save();
  await user.addExpense(expense);
  res.send(`Added expense to ${expense.category}`)
  next()
})

app.delete('/user/:user/:expense', express.json(), DB, UserFromDB, async(req, res, next) => {

  const user = req.params.user
  await user.deleteExpense();
  console.log("Expense deleted");
  res.send('Delete request called')


})

// All other GET requests not handled before will return static React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



