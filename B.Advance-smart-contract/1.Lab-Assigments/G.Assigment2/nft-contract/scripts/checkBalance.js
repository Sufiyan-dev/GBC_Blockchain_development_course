const hre = require("hardhat");
const nftAbi = require('../abi/GBCNFTS.json');

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();

    console.log("signer ", owner.address);

    const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

    const nftContract = await hre.ethers.getContractAt(nftAbi.abi,tokenAddress);
    
    const balanceOf = await nftContract.balanceOf(owner.address);
    console.log("balance of user ", balanceOf);

    const tokenIdCounter = await nftContract.getCounter();
    console.log("token id ",tokenIdCounter)
}

main()