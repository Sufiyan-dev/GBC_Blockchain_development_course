const { ethers } = require('ethers');
const config = require('../config.json');
// require('dotenv').config();
// console.log(config.node.mumbai)

const env = config['current-env'];

async function getBalance(address) {
    try {
        const provider = new ethers.JsonRpcProvider(config.node[env])

        const userBalance = await provider.getBalance(address);

        console.log("balance of ",address," is ",Number(userBalance));

        return Number(userBalance);
    } catch(err) {
        console.log("get balance error : ",err)
        return false;
    }
}

module.exports = getBalance;