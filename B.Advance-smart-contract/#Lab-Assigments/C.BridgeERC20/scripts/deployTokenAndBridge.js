const hre = require("hardhat");

const NETWORK_SEPOLIA = "";
const NETWORK_MUMBAI = "";

const bridgeListner = require("../listenerLocalhost");

// const listenerSepolia = require("../listenerSepolia");
// const listenerMumbai = require("../listenerMumbai");
// const listnerLocalhost = require("../listenerLocalhost");

async function main() {
    console.log("network name ",  hre.network.name);
  
    const [signer, manager] = await hre.ethers.getSigners();
    console.log("signer : ", signer.address);
    console.log("manager : ", manager.address);

    const tokenName = "GBC Token";
    const tokenSymbol = "GBCT";

    const token = await hre.ethers.deployContract("Token",[tokenName, tokenSymbol]);

    await token.waitForDeployment();

    console.log(`Token deployed to ${token.target}`);

    const tokenNameCheck = await token.name();
    console.log(`token name `, tokenNameCheck);

    const bridge = await hre.ethers.deployContract("TokenBridge", [token.target,manager.address]);
    
    await bridge.waitForDeployment();
    
    console.log(
        `Bridge deployed to ${bridge.target}`
    );

    const setManagerTxn = await token.updateOrSetManager(bridge.target);

    // listenerMumbai.main(bridge.target);



    // if(hre.network.name == NETWORK_SEPOLIA){
    //     listenerSepolia.main();

    // } else if(hre.network.name == NETWORK_MUMBAI){
    //     listenerMumbai.main(bridge.target);
    // } else if(hre.network.name == "localhost") {
    //     listnerLocalhost.main(bridge.target);
    // } else {
    //     console.error("invalid network for starting listner");
    // }

    // Contract ABI (Replace with your actual ABI



    

    // const approveTokens = await token.approve(bridge.target, hre.ethers.parseEther("1"));

    // const owner = await bridge.bridgeAdmin();
    // console.log("owner ", owner);

    // const brigeTokens = await bridge.connect(signer).sendTokens(token.target, hre.ethers.parseEther("1"));

    // const userInfoInBridge = await bridge.userTokenData(signer.address, token.target);
    // console.log("user info ", userInfoInBridge);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});