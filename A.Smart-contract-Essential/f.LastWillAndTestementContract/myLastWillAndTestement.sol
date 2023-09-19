// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract EtherWill {

    address public owner;
    uint public funds;
    bool public isDeceased;

    address payable[]  beneficiaryAccounts;

    mapping( address => uint ) inheritance;

    modifier onlyOwner() {
        require(msg.sender == owner,"Only owner");
        _;
    }

    modifier isOwnerDeceased() {
        require(isDeceased,"onwer must be deceased for funds to be distributed");
        _;
    }

    constructor() payable {
        owner = msg.sender;
        funds = msg.value;
    }

    function addInheritance(address payable  _account, uint _inheritanceAmount) external onlyOwner {
        beneficiaryAccounts.push(_account);
        inheritance[_account] = _inheritanceAmount;
    }

    function distribute() private isOwnerDeceased {
        for(uint i = 0; i < beneficiaryAccounts.length; i++){
            beneficiaryAccounts[i].transfer(inheritance[beneficiaryAccounts[i]]);
        }
    }

    function deceased() external onlyOwner {
        isDeceased = true;
        distribute();
    }

}