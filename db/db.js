const { Admin } = require('mongodb');
const assert = require("assert")

const MongoClient = require('mongodb').MongoClient;

const circulationRepo = require("./repos/circulationRepo");
const data  = require("./circulation.json")

const url = 'mongodb://127.0.0.1';
const dbName = 'Circulation';

(async function(){
    const client = new MongoClient(url);
    await client.connect()

    try{
        const results = await circulationRepo.loadData(data)
        // assert.equal(data.length, results.insertedCount)
        
        const getData = await circulationRepo.get();
        // assert.equal(data.length, getData.length)

        const filterData = await circulationRepo.get({Newspaper:  getData[4].Newspaper});
        // assert.deepEqual(filterData[0], getData[4]); // returns an arrays even if it is only one item

        const limitData = await circulationRepo.get({}, 3);
        // assert.equal(limitData.length, 3);

        const id = getData[4]._id.toString(); // string representation of an id 
        const byId = await circulationRepo.getById(getData[4].id); // if we put _id -> byId is the item itself, not an array // we would be passing an object id, not a string of numbers 
        assert.deepEqual(byId, getData[4]);

    }catch(error){
         console.log(error)
    } finally {
        const admin = client.db(dbName).admin();
        await client.db(dbName).dropDatabase() // so we don't overpopulate database  - so we do not have 'Circulation' database anymore in the list of databases

        console.log('It works!');
        console.log(await admin.listDatabases())

        client.close()
    }
})();


