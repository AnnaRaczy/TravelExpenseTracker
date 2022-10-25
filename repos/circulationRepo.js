const {MongoClient, ObjectId} = require('mongodb');

const circulationRepo = ()=> {

    const url = 'mongodb://127.0.0.1';
    const dbName = 'Circulation';

    const get = (query, limit) => {
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                let items = db.collection('newspapers').find(query); // returns coursor
                
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

                let item = await db.collection('newspapers').findOne({_id: ObjectId(id)}); // _id is a type of object id, bo we have to use ObjectId(id) to make it work
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

                results = await db.collection('newspapers').insertMany(data);
                resolve(results);
                client.close()
                db.collection('newspapers').drop()
            } catch(error){
                reject(error)
            }
        })
        
    }
    return {loadData, get, getById}
}

module.exports = circulationRepo();