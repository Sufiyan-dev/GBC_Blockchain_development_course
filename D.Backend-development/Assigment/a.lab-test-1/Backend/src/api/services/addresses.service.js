const addresses = require('../utils/addresses.json');

function fetchAddress() {
    try {
        return addresses;   
    } catch(err) {
        return false;
    }
}

module.exports = { fetchAddress }