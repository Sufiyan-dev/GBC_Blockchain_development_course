# Bridge protocal

This project demonstrates a basic bridging use case. It includes :  
1. Bridge and Token contracts
2. Unit Testing
3. Deploy scripts
4. Interaction scripts
5. Contract verification

## Setup
1. add alchemy node url of polygon mumbai in env
2. add two addresses in env of :
    - Onwer (mumbai)
    - Manager (mumbai)
3. add etherscan api key for contract verification
4. Start harhdat node
5. Deploy token and bridge on localhost
6. Update the addresses in the listner file `listenerLocalhost.js`
7. Run interaction script for sending tokens in localhost using `scripts/sendToken.js`


## Deploy contract
1. Deploying on polygon mumbai testnet
`npx hardhat run ./scripts/deployTokenAndBridge.js --network polygonMumbai`
2. Deploying on localhost
`npx hardhat run ./scripts/deployTokenAndBridge.js --network localhost`

## Interaction script 
This is an script from intereaction from localhost to poygon mumbai testnet
NOTE: need to deploy the contract and update the addresses in the listner contract
`npx hardhat run ./scripts/sendToken.js --network localhost`

## Running Node
`npx hardhat node`

## Running Test
- `npx hardhat test`
- `REPORT_GAS=true npx hardhat test`
- `npx hardhat test ./test/file-name`

## Running Listner
1. Start the listner for mumbai polygon and localhost
`node listenerLocalhost.js`
2. Start the listner for mumbai polygon and sepolia
`node listener.js`

## Screenshots
### Bridge Mumbai to Localhost
1.  Approve tokens to bridge contract<br>
<img src="images/approve-tokens-mumbai-localhost.png" width="700" height="150" />
2. Calling send token function in the bridge contract
<img src="images/calling-sendtokens-mumbai-to-localhost.png" width="700" height="300" />
3. Metamask sigining of send tokens
<img src="images/txn-metamask-popup-mumbai-to-localhost.png" width="700" height="400" />
4. Txn confirmation in etherscan
<img src="images/sendtoken-txn-info-mumbai-to-localhost.png" width="700" height="300" />
5. Listner performing the bridging
<img src="images/listner-mumbai-to-localhost.png" width="700" height="100" />
6. Hardhat node txns info<br>
<img src="images/hardhat-node-ss-mumbai-to-localhost.png" width="700" height="400" />

### Bridge Localhost to Mumbai
1. Calling the script which performs approve and sentokens funtion in the bridge contract
<img src="images/interaction-script-localhost-mumbai.png" width="700" height="100" />
2. Listner performing the bridging 
<img src="images/listner-localhost-to-mumbai.png" width="700" height="100" />
3. hardhat node txns info<br>
<img src="images/hardhat-node-localhost-to-mumbai.png" width="700" height="700" />
4. Etherscan txn info of minting token to user
<img src="images/etherscan-minted-bridge-tokens-localhost-mumbai.png" width="700" height="500" />

### Unit test
<img src="images/testcases-example.png" width="700" height="600" />

## Coverage
- The below is the unit test coeverage of both the token and bridge contract
<img src="images/coverage.png" width="700" height="200" />

## Contract deployment info
1. Polygon mumbai testnet
- Token : 0x7b1Da26eaDe13D1d6E7457FC4B1045f021050b86
- Bridge : 0xe3d98ad3C49eE25160DFD8ff81A8367d618D83f5

2. Localhost
- For localhost you need to deploy the contract.

## Bonus 
1. Added unit test for token contract
2. Added listner for sepolia and mumbai too `listener.js`



## Author
Sufiyan