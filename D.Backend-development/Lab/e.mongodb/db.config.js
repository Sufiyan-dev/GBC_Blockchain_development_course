const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.mongo_uri);

mongoose.connect(process.env.mongo_uri);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('database is connected successfully');
});
db.on('disconnected',() => {
    console.log('database is disconnected successfully');
});
db.on('error', (error) => {
    console.log(error, 'connection error:');
});

module.exports = db;