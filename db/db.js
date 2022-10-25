const { Admin } = require('mongodb');
const circulationRepo = require("../repos/circulationRepo")
const data  = require("../circulation.json")

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'Circulation';
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

async function getMusic() {
    try{
        await client.connect();
        console.log("getMusic:");
        const result = await circulationRepo.loadData(data)
        console.log(result)
        client.close();
        return result
        // const admin = client.db(dbName).admin()
        // console.log(await admin.listDatabases())
        // console.log(await client.db("local").listCollections())
    } catch(err){
        console.log(err)
        return false
    }
}

module.exports = {checkDB, getMusic};

