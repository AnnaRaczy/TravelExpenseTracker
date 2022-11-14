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



module.exports = {checkDB};

