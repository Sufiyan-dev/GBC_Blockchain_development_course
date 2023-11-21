const { fetchAddress, fetchBalance } = require("../services/addresses.service");
const { handleResponse, handleError } = require("../utils/responseHelper");

async function getAddresses(req,res) {
    try {
        const result = await fetchAddress();

        if(!result.status){
            throw new TypeError("failed fetching addresses");
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

async function getBalance(req,res) {
    try {
        const { address } = req.params;
    
        if(!address){
            throw new TypeError("Invalid input");
        }
    
        const result = await fetchBalance(address);
    
        if(!result.status){
            throw new TypeError(result.message);
        }
    
        handleResponse({res, statusCode: 200, result: result.message});

    } catch(err) {
        if(err instanceof TypeError){
            handleError({res, statusCode: 400, result: err.message})
        } else {
            handleError({res, statusCode: 500, result: err.message});
        }
    }
}

module.exports = { getAddresses, getBalance };