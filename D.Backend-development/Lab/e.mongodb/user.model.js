const mongoose = require('mongoose');
const db = require('./db.config');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
})

const UserModel = db.model('User',userSchema);

module.exports = UserModel;