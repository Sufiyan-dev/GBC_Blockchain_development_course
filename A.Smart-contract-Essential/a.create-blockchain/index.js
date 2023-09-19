// Proof of Work Blockchain

// include this library to make use of the SHA-256 function
// npm install crypto-js
const SHA256 = require('crypto-js/sha256');

// global variable to hold block index
var counter = 0;

// define the shape of the block

class Block {
	constructor(data, previousHash, timestamp, index, currentHash, nonce) {
		this.index = index;
		this.previousHash = previousHash;
		this.timestamp = new Date().getTime();
		this.data = data;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	// use the SHA256 algorithm to generate a hash of the information contained in the block,
	// concatenated together
	calculateHash() {
		return SHA256(
			this.index +
				this.previousHash +
				this.timestamp +
				JSON.stringify(this.data) +
				this.nonce
		).toString();
	}
	// generate the Block hash based on the difficulty
	// calculate the nonce
	mineBlock(difficulty) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log('Mined block ' + this.index + ' --> Hash value:', this.hash);
		return this.hash;
	}
}

// construct the blockchain

class Blockchain {
	// first create the Genesis block and set the mining difficulty
	// which refers to the deifficulty of finding a nonce that has a
	// certain number of zeroes at the beginning of the string.
	// difficulty = 3, for example, means that the has must start with 3 zeroes --> '000'

	// The greater the difficulty, the mo0re time generally it takes to mine a block

	constructor() {
		this.chain = [this.createGenesis()];
		this.difficulty = 5;
	}

	// data, previousHash, timestamp, index, currentHash
	createGenesis() {
		return new Block('GENESIS BLOCK', 0, '01/01/2023', 0, 0);
	}

	// calculate the index of the latest block
	latestBlock() {
		return this.chain[this.chain.length - 1];
	}

	// add a block to the blockchain
	addBlock(newBlock) {
		// increment the block index
		newBlock.index = Number(this.latestBlock().index) + 1;
		// create the link between blocks by setting the new Block's previousHash
		// to the preceeding Block's hash value
		newBlock.previousHash = this.latestBlock().hash;
		//set the new Block's hash value in the calculateHash() function
		newBlock.hash = newBlock.mineBlock(this.difficulty);
		// push the new block to the end of the Blockchain array
		this.chain.push(newBlock);
	}

	checkValid() {
		for (let i = 1; i < this.chain.length; i++) {
			// get the current block and previous block and check that the hashes are valid
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];
			if (currentBlock.hash !== currentBlock.calculateHash()) {
				console.log('Hash is invalid!');
				return false;
			}
			if (currentBlock.previousHash !== previousBlock.hash) {
				console.log('Hash of previous block is invalid!');
				return false;
			}
		}
		return true;
	}
}

let jsChain = new Blockchain();
jsChain.addBlock(new Block('sample tx data 1'));
jsChain.addBlock(new Block('sample tx data 2'));
jsChain.addBlock(new Block('sample tx data 3'));
jsChain.addBlock(new Block('sample tx data 4'));
jsChain.addBlock(new Block('sample tx data 5'));

console.log(JSON.stringify(jsChain, null, 4));
console.log('Is the blockchain state valid? ' + jsChain.checkValid());