const {MongoClient, ObjectId} = require('mongodb');
// const TripSchema = require('../models/trips-model');
const {UserModel, TripsModel, ExpensesModel, MappingModel} = require("../models/model");


const repoFunctions = ()=> {

    const url = 'mongodb://127.0.0.1';
    const dbName = 'trips';
    const client = new MongoClient(url);

    // const get = (query, limit) => {
    //     return new Promise(async(resolve, reject) => {
    //         try{
    //             await client.connect();
    //             const db = client.db(dbName);

    //             let items = db.collection('trips').find(query);
                
    //             if (limit >0) {
    //                 items = items.limit(limit);
    //             }

    //             resolve(await items.toArray());
    //             client.close()

    //         } catch(error){
    //             reject(error)
    //         }
    //     })
    // }

    // const getById = (id) => {
    //     return new Promise(async (resolve, reject) => {
    //         const client= new MongoClient(url);
    //         try{
    //             await client.connect();
    //             const db = client.db(dbName);

    //             let item = await db.collection('trips').findOne({_id: ObjectId(id)}); 
    //             resolve(item)
    //             client.close();
    //         } catch(error){
    //             reject(error)
    //         }
    //     })

    // }

    const loadData = (data) =>{
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName)

                const results = await db.collection('trips').insertMany(data);
                resolve(results);
                client.close()
                db.collection('trips').drop()
            } catch(error){
                reject(error)
            }
        })
        
    }


    const getTrips = async() => {

        const tripMappings = await MappingModel.find({userId: this._id})
        let trips = [];
        for (let mapping of tripMappings) {
            trips.push( mapping.tripId)
        }
    }

    const addTrip = async(trip) => {
        const mapping = new MappingModel({
            userId: this._id,
            tripId: this._id
        })

        await mapping.save();
        console.log(`New Mapping: ${mapping}`);
    }

    const updateTrip = async(req, res) => {
        const body = req.body

        const trip = await MappingModel.findOneAndUpdate({tripId: req.params.id}, (err, travel) => {
            if(err) {
                return res.status(400).json({
                    err,
                    message: 'Trip not found'
                })
            }
            travel.name = body.name
            travel.budget = body.budget
            travel.from = body.from
            travel.to = body.to

            
        })

        await trip.save();
        console.log(`Trip ${req.params._id} has been updated.`)

    }

    const deleteTrip = async(req, res) => {

        const trip = await MappingModel.findOneAndDelete({tripId: req.params.id}, (err, travel) => {
            if(err) { 
                return res.status(400).json({
                    success: false,
                    err: err
                })
            }

        })
        if(!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: trip
        })
        .catch (err => { 
            console.log(err)
        })
    }



    const getExpenses = async() => {

        const expenseMappings = await MappingModel.find({userId: this._id})
        let expenses = [];
        for (let mapping of expenseMappings) {
            expenses.push( mapping.tripId)
        }
    }

    const addExpense = async(expense) => {
        const mapping = new MappingModel({
            userId: this._id,
            expenseId: this._id
        })

        await mapping.save();
        console.log(`New Mapping: ${mapping}`);
    }

    const updateExpenses = async(req, res) => {
        const body = req.body

        const expense = await MappingModel.findOneAndUpdate({expenseId: req.params.id}, (err, travel) => {
            if(err) {
                return res.status(400).json({
                    err,
                    message: 'Trip not found'
                })
            }
            travel.category = body.category
            travel.amount = body.amount

            
        })

        await expense.save();
        console.log(`Expenses ${req.params._id} have been updated.`)

    }

    const deleteExpense = async(req, res) => {

        const expense = await MappingModel.findOneAndDelete({expenseId: req.params.id}, (err, travel) => {
            if(err) { 
                return res.status(400).json({
                    success: false,
                    err: err
                })
            }

        })
        if(!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: expense
        })
        .catch (err => { 
            console.log(err)
        })
    }


    const findByUsername = async(username) => {
        return await this.findOne({username: username})
    }
    
    
    // const createTrip = async(req, res) => {
    //     const body = req.body
        
    //     if(!body) {
    //         return res.status(400).json({
    //             success: false,
    //             error: 'You must provide a trip'
    //         })
    //     }

    //     const trip = new TripsModel({
    //         trips : { 
    //             trip_id: 123,
    //             data : {
    //                 trip_name : "Germany",
    //                 budget : 5000
    //             }
    //         }
    //     })

    //     if(!trip) {
    //         return res.status(400).json({
    //             success: false,
    //             error: error
    //         })
    //     }

    //     trip
    //         .save()
    //         .then(() => {
    //             res.status(201).json({
    //                 success: true,
    //                 id: trip._id,
    //                 message: 'Trip has been created'
    //             })
    //         })
    //         .catch(err => {
    //             return res.status(400).json({
    //                 err,
    //                 message: 'Trip not created'
    //             })
    //         }) 

    // }        


    // const updateTrip = async(req, res) => {
    //     const body = req.body

    //     if(!body) {
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Trip not found'
    //         })
    //     }

    //     trip.findOne({ _id: req.params.id}, (err, trip) =>{
    //         if(err) {
    //             return res.status(400).json({
    //                 err,
    //                 message: 'Trip not found'
    //             })
    //         }

    //         trip.name = body.name
    //         trip.budget = body.budget
    //         trip.start_date = body.start_date
    //         trip.end_date = body.end_date
    //         trip.expense_categories = body.expense_categories
    //         trip.category_name = body.category_name
    //         trip.amount = body.amount

    //         trip
    //             .save()
    //             .then( () => {
    //                 return res.status(200).json({
    //                     success: true,
    //                     _id: trip._id,
    //                     message: 'Trip updated'
    //                 })
    //             })
    //             .catch(err => {
    //                 return res.status(404).json({
    //                     err, 
    //                     message: 'Trip not updated'
    //                 })
    //             })
    //     })    
    // }

    // const deleteTrip = async(req, res) => {
    //     const body = req.body

    //     await Trip.findOneAndDelete({ _id: req.params.id}, (err, trip) =>{

    //         if(err) { 
    //             return res.status(400).json({
    //                 success: false,
    //                 err: err
    //             })
    //         }

    //         if(!trip) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: 'Trip not found'
    //             })
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             data: trip
    //         })
    //         .catch (err => { 
    //             console.log(err)
    //         })
    //     })
    // }


    
    return {loadData, getTrips, getExpenses, addTrip, addExpense, updateTrip, updateExpenses, deleteTrip, deleteExpense, findByUsername}
}

module.exports = repoFunctions();