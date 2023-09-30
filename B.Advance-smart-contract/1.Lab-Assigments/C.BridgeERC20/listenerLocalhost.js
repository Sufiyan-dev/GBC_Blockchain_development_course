const { ethers } = require('hardhat');
require('dotenv').config();

// Contract ABI (Replace with your actual ABI)
const BridgeAbi = require("./Abis/TokenBridge.json");

function main() {

    // Your local development RPC endpoint (Ganache default is "http://localhost:8545")
    const providerLocalhost = new ethers.JsonRpcProvider('http://localhost:8545');
    const localhostWallet = new ethers.Wallet(process.env.MANAGER_LOCALHOST_PRIVATE_KEY,providerLocalhost);
    const providerMumbai = new ethers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYKEY_MUMBAI}`)
    const mumbaiWallet = new ethers.Wallet(process.env.MANAGER_PRIVATE_KEY,providerMumbai);

    // Address of the deployed contract on localhost
    const localhostContractAddress = '0xaa3d38d9ff320c02031064bc13ae2b984aa6a61e';
    const localhostTokenContractAddress = '0xb6e58ef0ce1240974770d23469783d94ff22ee3a';
    const mumbaiContractAddress = '0xe3d98ad3C49eE25160DFD8ff81A8367d618D83f5';
    const mumabiTokenContractAddress = '0x7b1Da26eaDe13D1d6E7457FC4B1045f021050b86';

    // Connect to the contract
    const localhostContract = new ethers.Contract(localhostContractAddress, BridgeAbi.abi, localhostWallet);
    const mumbaiContract = new ethers.Contract(mumbaiContractAddress, BridgeAbi.abi, mumbaiWallet);



    // Listen to a specific event (replace 'YourEvent' with your event name)
    localhostContract.on('TokenBridged', (token, user, amount) => {
        // Do something when the event is fired
        console.log(`Received event localhost from ${user} with amount ${amount}`);
        console.log('Event details:', token);

        mumbaiContract.mintReceivedTokens(user, amount, mumabiTokenContractAddress).then((txn) => {
            console.log("txn hash mumbai mint",txn.hash);

            if(txn.hash){
                localhostContract.confirmTokenDelivery(user, amount, token).then((txn) => {
                    console.log("txn hash localhost confirm",txn.hash);
                    if(txn.hash){
                        console.log("bridged success from localhost to mumbai 🎉")
                    }
                })
            }
        })

    });

    mumbaiContract.on('TokenBridged', (token, user, amount) => {
         // Do something when the event is fired
         console.log(`Received event mumbai from ${user} with amount ${amount}`);
         console.log('Event details:', token);

         localhostContract.mintReceivedTokens(user, amount, localhostTokenContractAddress).then((txn) => {
            console.log("txn hash localhost mint ",txn.hash);

            if(txn.hash){
                mumbaiContract.confirmTokenDelivery(user, amount, token).then((txn) => {
                    console.log("txn hash mumbai confirm",txn.hash);
                    if(txn.hash){
                        console.log("bridged success from mumbai to localhost 🎉")
                    }
                })
            }

         })

    })

    // This will keep the script running and listening to events
    process.stdin.resume();
}

main()

module.exports = { main };