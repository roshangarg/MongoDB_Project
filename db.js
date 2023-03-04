const { MongoClient } = require('mongodb')
let dbConnections 


const connectToDb = (cb) => {

    MongoClient.connect('mongodb://localhost:27017/bookstore')
    .then((client) => {
        dbConnections = client.db()
        return cb()
    })
    .catch((err) => {
        console.log(err,"error");
        return cb(err)
    })

}


const getDb = () => dbConnections

module.exports  = {
    connectToDb,
    getDb
}