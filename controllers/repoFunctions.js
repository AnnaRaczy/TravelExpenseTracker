const { MongoClient, ObjectId } = require("mongodb");
// const TripSchema = require('../models/trips-model');
const {
  UserModel,
  TripsModel,
  ExpensesModel,
  MappingModel,
} = require("../models/model");

const repoFunctions = () => {
  const url = "mongodb://127.0.0.1";
  const dbName = "trips";
  const client = new MongoClient(url);

  const checkDB = async () => {
    try {
      await client.connect();
      client.close();
      console.log("CheckDB:Connected");
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const loadData = (data) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const results = await db.collection("trips").insertMany(data);
        resolve(results);
        client.close();
        db.collection("trips").drop();
      } catch (error) {
        reject(error);
      }
    });
  };

  const getTrips = async (req, res) => {
    const { id } = req.params;
    // const { query } = req
    try {
      const tripMappings = await MappingModel.find({ userId: id });
      let trips = [];
      for (let mapping of tripMappings) {
        const elem = await mapping;
        trips.push(elem.tripId);
      }
      return trips;
    } catch (err) {
      res.status(400).json({
        err,
        message: "Trips not found",
      });
    }
  };

  const getTrip = async (req, res) => {
    const { id } = req.params;

    try {
      return await MappingModel.findOne({ tripId: id });
    } catch (err) {
      res.status(400).json({
        err,
        message: "Trips not found",
      });
    }
  };

  const addTrip = async (req, res) => {
    const { name, budget, from, to } = req.body;
    const { _id } = req.params.user;

    try {
      const trip = new TripsModel({
        name,
        budget,
        from,
        to,
      });

      await trip.save();
      const mapping = new MappingModel({
        userId: _id,
        tripId: trip._id,
      });

      await mapping.save();
      console.log(`New Mapping: ${mapping}`);
    } catch (err) {
      res.status(400).json({
        err,
        message: "Trip not created",
      });
    }
  };

  const updateTrip = async (req, res) => {
    const { id, name, budget, from, to } = req.body;
    const options = {
      upsert: true,
    };

    try {
      await TripsModel.findOneAndUpdate(
        { _id: id },

        { name: name, budget: budget, from: from, to: to },

        options
      );
    } catch (err) {
      res.status(400).json({
        err,
        message: "Trip not updated", // ? not found won't be true
      });
    }
  };

  const deleteTrip = async (req, res) => {
    const { id } = req.params;

    try {
      await MappingModel.findOneAndDelete({ _id: id });
      console.log("Trip deleted");
    } catch (err) {
      res.status(404).json({
        err: err,
        message: "Trip not deleted",
      });
    }
  };

  const getExpenses = async () => {
    try {
      const expenseMappings = await MappingModel.find({ userId: this._id });
      let expenses = [];
      for (let mapping of expenseMappings) {
        expenses.push(mapping.tripId);
      }
    } catch (err) {
      res.status(400).json({
        err,
        message: "No trips to return",
      });
    }
  };

  const addExpense = async (expense) => {
    const { id, category, amount } = req.body;

    try {
      const mapping = new MappingModel({
        userId: this._id, // req.params.user
        expenseId: this._id, // req.params.expense
      });

      const expense = new ExpensesModel({
        expenseId: id,
        category,
        amount,
      });

      await mapping.save();
      await expense.save();
      console.log(`New Mapping: ${mapping}`);
    } catch (err) {
      res.status(400).json({
        err,
        message: "Expense not updated",
      });
    }
  };

  const updateExpense = async (req, res) => {
    const { id, category, amount } = req.body;
    const options = {
      returnNewDocument: true,
      upsert: true,
    };

    try {
      await MappingModel.findOneAndUpdate(
        { expenseId: req.params.id },
        {
          expenseId: id,
          category,
          amount,
        },
        options
      );
    } catch (err) {
      res.status(400).json({
        err,
        message: "Expense not updated",
      });
    }
  };

  const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
      await MappingModel.findOneAndDelete({ expenseId: id });
      console.log("Expense deleted");
    } catch (err) {
      res.status(404).json({
        err: err,
        message: "Expense not deleted",
      });
    }
  };

  const findByUsername = async (username) => {
    return await this.findOne({ username: username });
  };

  return {
    checkDB,
    loadData,
    getTrips,
    getExpenses,
    addTrip,
    addExpense,
    updateTrip,
    updateExpense,
    deleteTrip,
    deleteExpense,
    findByUsername,
  };
};

module.exports = repoFunctions();
