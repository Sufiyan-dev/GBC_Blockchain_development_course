const { ethers } = require('ethers');
const config = require('../config.json');
const abi = require('../utils/nftAbi.json');

const env = config['current-env']

async function getContractInstance() {

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // console.log("signer ", signer)

        // console.log("provider ",config.node[env])
        // console.log("address ",config.env[env])

        const nftContract = new ethers.Contract(config.env[env].contractAddress,abi.abi,signer);

        const name = await nftContract.name();
        console.log("name", name);

        return nftContract;
    } catch(err) {
        console.log("contract instance error ", err);
        return false;
    }
}

module.exports = getContractInstance