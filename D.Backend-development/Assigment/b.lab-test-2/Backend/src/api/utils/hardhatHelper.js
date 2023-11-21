const { ethers } = require('hardhat');

/**
 * Fetch all the addresses from local node hardhat 
 * @returns addresses array
 */
async function getAddresses() {
    try {
        
        // getting address object from local node hardhat
        const addressesObj = await ethers.getSigners();
    
        // filtering only the address from it
        const addresses = addressesObj.map((addressObj) => {
            return addressObj.address
        })
    
        return addresses;

    } catch(err) {
        console.log("failed fetching addresses ",err.message);
        return false;
    }
}

/**
 * Helps you to fetch balance of an specific address
 * @param {string} address address to fetch balance of
 * @returns balance of address in ETH units or false
 */
async function getBalance(address) {
        try {

            const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');

            // fetch balance of address
            const addressBalance = Number(await provider.getBalance(address)) / 10**18;
            return addressBalance;

        } catch(err) { // err catch
            console.log("failed fetching balance of address ", err.message);
            return false;
        }
}

// async function getAddressesWithBalance

/**
 * 
 * @param {string} from sender address
 * @param {string} to recevier address
 * @param {number} amount amount to send
 * @returns status of txn with txn obj if success or message if fails
 */
async function sendEth(from, to, amount) {

    try {
            // converting amount
            console.log(amount, Number(amount), Number(amount) / 10**18);
            // amount = ethers.parseEther(String(Number(amount) / 10**18));
            // console.log(amount)

            const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');

            const account = await provider.getSigner(from);
            
            // send txn 
            const receipt = await account.sendTransaction({
                to,
                value: amount
            })

            console.log("receipt ", receipt)

            // await receipt.wait();

            const txnObj = {
                from: receipt.from,
                to: receipt.to,
                value: Number(receipt.value),
                gasUsed: 21000,
                receiptHash: receipt.hash,
                status: true,
                blockHash: receipt.blockHash,
                blockNumber: receipt.blockNumber
            }

            return txnObj;

    } catch(err) {
        console.log(err)
        console.log("error while sending txn", err.message);
        return false
    }
}

module.exports = { getAddresses, getBalance, sendEth }