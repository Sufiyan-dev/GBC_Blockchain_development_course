const { fetchAddress } = require("../services/addresses.service");
const { handleResponse, handleError } = require("../utils/responseHelper");

function getAddresses(req,res) {
    try {
        const result = fetchAddress();

        if(!result){
            throw new TypeError("failed fetching addresses");
        }

        handleResponse({res, statusCode: 201, result});

    } catch(err) {
        if( err instanceof TypeError){
            handleError({res, statusCode: 400, result: err.message});
        } else {
            handleError({res, statusCode: 500, result: err.message});
        }
    }
    
}

module.exports = { getAddresses };