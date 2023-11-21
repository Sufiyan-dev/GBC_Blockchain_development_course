const mongoose = require('mongoose');
const db = require('../../config/db.config');

const transactionSchema = new mongoose.Schema({
    source: String,
    destination: String,
    amount: Number,
    status: Boolean,
    gasUsed: Number,
    receiptHash: String,
}, {timestamps: true})

const TxnModel = db.model('Transactions',transactionSchema);

module.exports = TxnModel;