// web3.js
const fs = require("fs");
const Web3 = require("web3");

const web3Network = "ganache"

// creating a web3 instance on ganache-cli network
// Here the url is http://ganache:8545
// this ganache is the name of the container in which ganache-cli is running
// const web3 = new Web3("http://127.0.0.1:8545")// new Web3.providers.HttpProvider()
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));


// local ganache-cli setup
const eventProvider = new Web3.providers.WebsocketProvider(
  "ws://127.0.0.1:8545"
  );
  
  
  web3.setProvider(eventProvider);
  
  web3.eth.getBlockNumber()
  .then(console.log);
module.exports = {
  web3,
  web3Network
};