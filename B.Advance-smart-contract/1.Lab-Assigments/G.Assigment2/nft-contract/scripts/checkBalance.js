const hre = require("hardhat");
const nftAbi = require('../abi/GBCNFTS.json');

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();

    console.log("signer ", owner.address);

    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const nftContract = await hre.ethers.getContractAt(nftAbi.abi,tokenAddress);
    
    const balanceOf = await nftContract.balanceOf(owner.address);
    console.log("balance of user ", balanceOf);

    const tokenIdCounter = await nftContract.getCounter();
    console.log("token id ",tokenIdCounter)
}

main()