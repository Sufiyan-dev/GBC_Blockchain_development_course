const { fetchTxnHistory, sendTxn } = require("../services/transaction.service");
const { handleResponse, handleError } = require("../utils/responseHelper");

async function getTransactionHistory(req,res) {
    try {
        const result = await fetchTxnHistory();
    
        if(!result.status){
            throw new TypeError(result.message);
        }
    
        handleResponse({res, statusCode: 200, result: result.message});

    } catch(err) {
        if( err instanceof TypeError){
            handleError({res, statusCode: 400, result: err.message});
        } else {
            handleError({res, statusCode: 500, result: err.message});
        }
    }
}

async function sendTransaction(req,res) {

    try {
        const {from, to, amount} = req.body;
    
        if(!from || !to || !amount) {
            throw new TypeError('Invalid input')
        }
    
        const result = await sendTxn(from, to, amount);
   
        
        if(!result.status){
            throw new TypeError(result.message);
        }

        console.log(result)
    
        handleResponse({res, statusCode: 200, result: result.message});

    } catch(err) {
        if( err instanceof TypeError){
            handleError({res, statusCode: 400, result: err.message});
        } else {
            handleError({res, statusCode: 500, result: err.message});
        }
    }

}

module.exports = {getTransactionHistory, sendTransaction};