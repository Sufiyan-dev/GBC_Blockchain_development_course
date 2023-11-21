const TxnModel = require("../models/transaction.model");
const { sendEth } = require("../utils/hardhatHelper");


async function fetchTxnHistory() {
    try {
        const txns = await TxnModel.find();
        return {status: true, message: txns};
    } catch(err) {
        console.log("err while fetching the txn from db", err.message);
        return {status: false, message: err.message};
    }
}

async function sendTxn(from, to, amount) {
    try {
        console.log(typeof amount)
        if(from.length != 42 || typeof from != 'string' ||  to.length != 42 || typeof to != 'string'){
            return {status: false, message: "invalid input provided"};
        }

        const result = await sendEth(from, to, amount);

        if(!result){
            return {status: false, message: "failed while sending txn"};
        }

        // push it to db
        const newTxn = await TxnModel.create({
            source: result.from,
            destination: result.to,
            amount: result.value,
            receiptHash: result.receiptHash,
            gasUsed: result.gasUsed,
            status: result.status
        })

        return {status: true, message: result};

    } catch(err) {
        console.log("err while sending txn", err.message);
        return {status: false, message: err.message};
    }
}


module.exports = { fetchTxnHistory, sendTxn }