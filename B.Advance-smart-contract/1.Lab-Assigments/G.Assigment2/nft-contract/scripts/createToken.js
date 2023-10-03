const hre = require("hardhat");
const nftAbi = require('../abi/GBCNFTS.json');

async function main() {

    const [owner, otherAccount] = await ethers.getSigners();

    console.log("signer ", owner.address);

    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const nftContract = await hre.ethers.getContractAt(nftAbi.abi,tokenAddress);

    const mintTxn = await nftContract.safeMint(owner.address,"https://black-famous-magpie-761.mypinata.cloud/ipfs/QmUADMU3Nu422TidT1TXz8nqLJSbsZ2JxBU5txyxp8kHiR");

    console.log("mint txn hash ",mintTxn.hash)
}

main()