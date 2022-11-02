const {MongoClient, ObjectId} = require('mongodb');
const Trip = require('../models/trips-model')

const repoFunctions = ()=> {

    const url = 'mongodb://127.0.0.1';
    const dbName = 'users';

    const get = (query, limit) => {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                let items = db.collection('users').find(query); // returns coursor
                
                if (limit >0) {
                    items = items.limit(limit);
                }

                resolve(await items.toArray());
                client.close()

            } catch(error){
                reject(error)
            }
        })
    }

    const getById = (id) => {
        return new Promise(async (resolve, reject) => {
            const client= new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                let item = await db.collection('users').findOne({_id: ObjectId(id)}); 
                resolve(item)
                client.close();
            } catch(error){
                reject(error)
            }
        })

    }

    const loadData = (data) =>{
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName)

                const results = await db.collection('users').insertMany(data);
                resolve(results);
                client.close()
                db.collection('users').drop()
            } catch(error){
                reject(error)
            }
        })
        
    }
    
    
    const createTrip = async(req, res) => {
        const body = req.body
        
        if(!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a trip'
            })
        }

        const trip = new Trip(body)

        if(!trip) {
            return res.status(400).json({
                success: false,
                error: error
            })
        }

        trip
            .save()
            .then(() => {
                res.status(201).json({
                    success: true,
                    id: trip._id,
                    message: 'Trip has been created'
                })
            })
            .catch(err => {
                return res.status(400).json({
                    err,
                    message: 'Trip not created'
                })
            }) 

    }        


    const updateTrip = async(req, res) => {
        const body = req.body

        if(!body) {
            return res.status(400).json({
                success: false,
                message: 'Trip not found'
            })
        }

        Trip.findOne({ _id: req.params.id}, (err, trip) =>{
            if(err) {
                return res.status(400).json({
                    err,
                    message: 'Trip not found'
                })
            }

            trip.name = body.name
            trip.budget = body.budget
            trip.start_date = body.start_date
            trip.end_date = body.end_date
            trip.expense_categories = body.expense_categories
            trip.category_name = body.category_name
            trip.amount = body.amount

            trip
                .save()
                .then( () => {
                    return res.status(200).json({
                        success: true,
                        _id: trip._id,
                        message: 'Trip updated'
                    })
                })
                .catch(err => {
                    return res.status(404).json({
                        err, 
                        message: 'Trip not updated'
                    })
                })
        })    
    }

    const deleteTrip = async(req, res) => {
        const body = req.body

        await Trip.findOneAndDelete({ _id: req.params.id}, (err, trip) =>{

            if(err) { 
                return res.status(400).json({
                    success: false,
                    err: err
                })
            }

            if(!movie) {
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
        })
    }


    
    return {loadData, get, getById, createTrip, updateTrip, deleteTrip}
}

module.exports = repoFunctions();