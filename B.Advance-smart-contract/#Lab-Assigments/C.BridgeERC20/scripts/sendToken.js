const { ethers } = require("hardhat");

const BridgeAbi = require("../Abis/TokenBridge.json");
const TokenAbi = require("../Abis/Token.json");

async function main() {
    try {

        const [owner, manager, user1] = await ethers.getSigners();
    
        const localhostContractAddress = '0xaa3d38d9ff320c02031064bc13ae2b984aa6a61e';
        const localhostTokenContractAddress = '0xb6e58ef0ce1240974770d23469783d94ff22ee3a';
    
        const BridgeContract = await ethers.getContractAt(BridgeAbi.abi,localhostContractAddress);
        const TokenContract = await ethers.getContractAt(TokenAbi.abi,localhostTokenContractAddress);
    
        await TokenContract.transfer(user1.address,ethers.parseEther("10"));
    
        const balanceOfUser = await TokenContract.balanceOf(user1.address);
        console.log("token balance of user 1 is ",balanceOfUser);
    
        const approveTxn = await TokenContract.connect(user1).approve(localhostContractAddress,ethers.parseEther("1"));
        console.log("approve txn hash ", approveTxn.hash);
    
        const bridgeTokenTxn = await BridgeContract.connect(user1).sendTokens(localhostTokenContractAddress,ethers.parseEther("1"));
        console.log("bridge tokens txn hash ",bridgeTokenTxn.hash);

    } catch(error) {
        console.log("error", error);
    }
}

main()