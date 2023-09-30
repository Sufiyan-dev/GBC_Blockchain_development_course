const hre = require('hardhat');
require('dotenv').config();

const BridgeAbi = require("./Abis/TokenBridge.json");

const bridgeMumbaiAddress = '0xBa0dB92E17AeEb426e322aF3C44B91E829652931';
const tokenMumbaiAddress = '0x36fa5627152BA615b52AEE5ffbb8BD16cE001a21';

const bridgeSepoliaAddress = '0x8A6659Da9651a11BC6C595699B64c4A6B4372e09';
const tokenSepoliaAddress = '0xb80A3586E3b6932D6e62F9C09f5eeD32f2F38faA';



async function main() {

    try {
        const providerMumbai = new hre.ethers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYKEY_MUMBAI}`);
        const walletMumbai = new hre.ethers.Wallet(process.env.MANAGER_PRIVATE_KEY,providerMumbai);
        const BridgeContractMumbai = await hre.ethers.getContractAt(BridgeAbi.abi,bridgeMumbaiAddress,walletMumbai);
        
        const providerSepolia = new hre.ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMYKEY_SEPOLIA}`);
        const walletSepolia = new hre.ethers.Wallet(process.env.MANAGER_PRIVATE_KEY,providerSepolia);
        const BridgeContractSepolia = await hre.ethers.getContractAt(BridgeAbi.abi,bridgeSepoliaAddress,walletSepolia);
        
        const filterMumbai = {
            address: bridgeMumbaiAddress,
            topics: [
                hre.ethers.id("TokenBridged(address,address,uint256)") 
            ]
        }

        const filterSepolia = {
            address: bridgeSepoliaAddress,
            topics: [
                hre.ethers.id("TokenBridged(address,address,uint256)") 
            ]
        }

        const contractInterface = new hre.ethers.Interface(BridgeAbi.abi);


        providerMumbai.on(filterMumbai, (log, event) => {
            console.log("mumbai event");
            console.log("log ",log.data, "topic",log.topics);

            const decodedData = contractInterface.decodeEventLog("TokenBridged",log.data,log.topics);
            console.log("decoded data ", decodedData);

            console.log("token",decodedData[0],"from ",decodedData[1],"amoutn ", Number(String(decodedData[2])))

            // transfer tokens 
            BridgeContractSepolia.mintReceivedTokens(decodedData[1],decodedData[2],tokenSepoliaAddress).then((txn) => {
                console.log("sepolia minting txn ",txn.hash);

                if(txn.hash){
                    BridgeContractMumbai.confirmTokenDelivery(decodedData[1],decodedData[2],decodedData[0]).then((txn) => {
                        console.log("mumbai confirming the token recevied ", txn.hash);
                        console.log("Bridge Success from Mumbai to Sepolia 🎉");

                    }).catch((err) => {
                        console.log("estimation error mumbai confirming token recevied");
                        console.log(err);
                    })
                }
            }).catch((err) => {
                console.log("estimation error sepolia minting");
                console.log(err);
            });

        });

        providerSepolia.on(filterSepolia, (log,event) => {
            console.log("sepolia event");
            console.log("log ",log.data, "topic",log.topics);

            const decodedData = contractInterface.decodeEventLog("TokenBridged",log.data,log.topics);
            console.log("decoded data ", decodedData);

            console.log("token",decodedData[0],"from ",decodedData[1],"amoutn ", Number(String(decodedData[2])));

            BridgeContractMumbai.mintReceivedTokens(decodedData[1],decodedData[2],tokenMumbaiAddress).then((txn) => {
                console.log("Mumbai minting txn ",txn.hash);

                if(txn.hash) {
                    BridgeContractSepolia.confirmTokenDelivery(decodedData[1], decodedData[2], decodedData[0]).then((txn) => {
                        console.log("sepolia confirming the token recevied ", txn.hash);
                        console.log("Bridge Success from Sepolia to Mumbai 🎉");
                    }).catch((err) => {
                        console.log("estimation error sepolia confirming token recevied");
                        console.log(err);
                    })
                }
            }).catch((err) => {
                console.log("estimation error mumbai minting");
                console.log(err);
            })

        })

    } catch(error){
        console.log("error")
        console.log(error)
    }
}

module.exports = { main };

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});