// db.js
const { MongoClient } = require('mongodb');
const URL = 'mongodb://localhost:27017/art';
let dbConnection;

const connectToDb = (cd) => {
    MongoClient
        .connect(URL)
        .then((client) => {
            console.log('Сервер работает');
            dbConnection = client.db();
            return cd();
        })
        .catch((err) => {
            return cd(err);
        });
};

const getDb = () => dbConnection;

module.exports = { connectToDb, getDb, MongoClient };
