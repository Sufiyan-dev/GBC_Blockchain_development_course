const { getAddresses, getBalance } = require("../utils/hardhatHelper");

async function fetchAddress() {
    try {
        const addressesArr = await getAddresses();

        if(!addressesArr){
            throw new TypeError('Failed to fetch addresses');
        }

        return {status: true, message: addressesArr};   

    } catch(err) {
        return {status: false, message: err.message};
    }
}

async function fetchBalance(address) {
    try {

        const balance = await getBalance(address);

        if(!balance){
            throw new TypeError('Failed to fetch balance of address');
        }

        return {status: true, message: balance};

    } catch(err) {
        return {status: false, message: err.message};
    }
}

module.exports = { fetchAddress, fetchBalance }