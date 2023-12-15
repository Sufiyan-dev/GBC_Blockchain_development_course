/**
 *Submitted for verification at mumbai.polygonscan.com on 2023-12-13
*/

// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

interface IAggregatorInterface {
  function latestAnswer() external view returns (int256);
}  

contract priceFetcher {

    address public owner;

    // Mapping to tokenA to TokenB to priceFeed
    mapping (address =>  address) priceFeed;

    address[] public tokens;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"Only owner!");
        _;
    }

    function addPriceFeedOfTokenInUsd(address token, address priceFeedAdd) external onlyOwner {
        require(priceFeed[token] == address(0),"Price feed already exist!");
        require(priceFeedAdd.code.length > 0,"invalid priceFeed address!");

        // test check, to validate it is not invlaid address
        IAggregatorInterface(priceFeedAdd).latestAnswer();

        // adding it to mapping 
        priceFeed[token] = priceFeedAdd;

        tokens.push(token);
    }

    function getPriceOfTokenInUsd(address token) external view returns(int256){
        address priceFeedAdd = priceFeed[token];
        require(priceFeedAdd != address(0),"Price feed does'nt exist!");
        return IAggregatorInterface(priceFeedAdd).latestAnswer();
    }

    function updatePriceFeed(address token, address newPriceFeedAdd) external onlyOwner {
        address priceFeedAdd = priceFeed[token];
        require(priceFeedAdd != address(0),"Price feed does'nt exist!");

        // updating the mapping
        priceFeed[token] = newPriceFeedAdd;
    }

    function getTokensArrayLength() external view returns(uint256){
        return tokens.length - 1;
    }

    function getToken(uint256 tokenArrayIndex) external view returns(address){
        require(tokenArrayIndex < tokens.length,"invalid token length");
        return tokens[tokenArrayIndex];
    }
}