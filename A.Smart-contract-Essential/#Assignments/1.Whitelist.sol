// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Whitelist {
    address public owner;

    mapping(address => bool) whitelistedAddresses;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"only owner");
        _;
    }

    modifier isWhitelist() {
        require(whitelistedAddresses[msg.sender] == true,"only whitelisted addresses");
        _;
    }

    function addWhitelist(address _newUser) external onlyOwner {
        whitelistedAddresses[_newUser] = true;
    }

    function verifyUser(address user) external view returns (bool) {
        return whitelistedAddresses[user];
    }

    function removeWhitelist(address _user) external onlyOwner {
        require(whitelistedAddresses[_user],"user is not whitelist address");
        delete whitelistedAddresses[_user];
    }
}