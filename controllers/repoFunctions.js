const {MongoClient, ObjectId} = require('mongodb');
// const TripSchema = require('../models/trips-model');
const {UserModel, TripsModel, ExpensesModel, MappingModel} = require("../models/model");


const repoFunctions = ()=> {

    const url = 'mongodb://127.0.0.1';
    const dbName = 'trips';
    const client = new MongoClient(url);

    const checkDB = async() => {
    
        try{
            await client.connect();
            client.close();
            console.log("CheckDB:Connected");
            return true
        }catch(err){
             console.log(err);
             return false;
        } 
    };


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


    const getTrips = async(req, res) => {
        const id = req.params.id

        try {
            const tripMappings = await MappingModel.find({userId: id})
            let trips = [];
            for (let mapping of tripMappings) {
                trips.push(mapping.tripId)
        }
        } catch(err) {
            res.status(400).json({
                err,
                message: 'Trips not found'
            })
        }
    }


    const addTrip = async(trip) => {
        const body = req.params.body

        try {
            const mapping = new MappingModel({
                userId: this._id, // req.params.user
                tripId: this._id // req.params.trip
            })

            const trip = new TripsModel({
                tripId: body.id,
                name: body.name,
                budget: body.budget,
                from: body.from,
                to: body.to
            })
    
            await mapping.save();
            await trip.save();
            console.log(`New Mapping: ${mapping}`);

        } catch(err) {
            res.status(400).json({
                err,
                message: 'Trip not created'
            })
        }
    }


    const updateTrip = async(req, res) => {
        const body = req.body
        const options = {
            returnNewDocument: true, 
            upsert: true
        }

        try {
            await MappingModel.findOneAndUpdate({tripId: req.params.id}, 

            {name: body.name,
            budget: body.budget,
            from: body.from,
            to: body.to},

            options
            )

        } catch(err) {
            res.status(400).json({
                err,
                message: 'Trip not updated' // ? not found won't be true 
            })
        }
    }

    const deleteTrip = async(req, res) => {
        const id = req.params.id

        try {
            await MappingModel.findOneAndDelete({tripId: id});
            console.log('Trip deleted');

        } catch(err) {
            res.status(404).json({
                err: err,
                message: 'Trip not deleted'
            })
        }
        
    }



    const getExpenses = async() => {

        try {const expenseMappings = await MappingModel.find({userId: this._id})
            let expenses = [];
            for (let mapping of expenseMappings) {
                expenses.push( mapping.tripId)
        }} catch(err) {
            res.status(400).json({
                err,
                message: 'No trips to return'
            })
        }
    }


    const addExpense = async(expense) => {
        const body = req.params.body;

        try {
            const mapping = new MappingModel({
                userId: this._id, // req.params.user
                expenseId: this._id // req.params.expense
            })

            const expense = new ExpensesModel({
                expenseId: body.id,
                category: body.category,
                amount: body.amount
            })
    
            await mapping.save();
            await expense.save();
            console.log(`New Mapping: ${mapping}`);

        } catch(err) {
            res.status(400).json({
                err,
                message: 'Expense not updated'
            })
        }
    }


    const updateExpenses = async(req, res) => {
        const body = req.body
        const options = {
            returnNewDocument: true, 
            upsert: true
        }


        try {
            await MappingModel.findOneAndUpdate({expenseId: req.params.id},
                {
                category: body.category,
                amount: body.amount
                },
                options
                )
        } catch(err) {
            res.status(400).json({
                err,
                message: 'Expense not updated'
            })
        }
        // const expense = await MappingModel.findOneAndUpdate({expenseId: req.params.id}, (err, travel) => {
        //     if(err) {
        //         return res.status(400).json({
        //             err,
        //             message: 'Trip not found'
        //         })
        //     }
        //     travel.category = body.category
        //     travel.amount = body.amount

            
        // })

        // await expense.save();
        // console.log(`Expenses ${req.params._id} have been updated.`)

    }

    const deleteExpense = async(req, res) => {

        const id = req.params.id

        try {
            await MappingModel.findOneAndDelete({expenseId: id})
            console.log('Expense deleted')

        } catch(err) {
            res.status(404).json({
                err: err,
                message: 'Expense not deleted'
            })
        }
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