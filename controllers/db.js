const { Admin } = require('mongodb');
const repoFunctions = require("../controllers/repoFunctions")
const data  = require("../db/trips.json")

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'Users';
const client = new MongoClient(url);

async function checkDB(){
    
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

async function getTrips() {
    try{
        await client.connect();
        console.log("Trips:");
        const result = await repoFunctions.loadData(data)
        console.log(result)
        return result
        // const admin = client.db(dbName).admin()
        // console.log(await admin.listDatabases())
        // console.log(await client.db("local").listCollections())
    } catch(err){
        console.log(err)
        return false
    }
}

module.exports = {checkDB, getTrips};

