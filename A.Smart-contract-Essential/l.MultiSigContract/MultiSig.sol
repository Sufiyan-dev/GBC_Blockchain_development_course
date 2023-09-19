// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract multisig {

    // main owner aka deployer
    address payable  owner;

    // other owners for approving txns
    mapping(address => bool) _owners;

    // minimum signature need for an txn to approve
    uint constant MIN_SIGNATURE = 3;

    // current txn id
    uint private _transactionIdx;

    // txn details 
    struct Transaction {
        address from;
        address payable to;
        uint amount;
        uint8 signatureCount;
        mapping(address => bool) signatures;
    }

    // storing txn on 
    mapping(uint => Transaction) private _transactions;

    uint[] private _pendingTransactions;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier validOwner() {
        require(msg.sender == owner || _owners[msg.sender] == true);
        _;
    }

    event DepositFunds(address from, uint amount);
    event WithdrawFunds(address from, uint amount);
    event TransferFunds(address from, address to, uint amount);
    event TransactionCreated(address by, address to, uint amount, uint transactionId);
    event TransactionsSigned(address by, uint trnasactionId);

    constructor() {
        owner = payable(msg.sender);
    }

    function addOwner(address _owner) isOwner public {
        _owners[_owner] = true;
    }

    function removeOwner(address _owner) isOwner public {
        _owners[_owner] = false;
    }

    function addFunds() public payable {
        emit DepositFunds(msg.sender, msg.value);
    }

    function transferTo(address payable  _to, uint _amount) validOwner external {
        require(address(this).balance >= _amount,"Insufficient amount");

        uint txnId = _transactionIdx++;

        _transactions[txnId].from = msg.sender;
        _transactions[txnId].to = _to;
        _transactions[txnId].amount = _amount;
        _transactions[txnId].signatureCount = 0;
        _pendingTransactions.push(_transactionIdx);

        emit TransactionCreated(msg.sender, _to, _amount, txnId);
    }

    function getPendingTransactions() validOwner public view returns(uint[] memory) {
        return _pendingTransactions;
    }

    function signTransaction(uint _txnid) validOwner public {
        Transaction storage transaction = _transactions[_txnid];

        require(transaction.from != address(0),"invalid txn");
        require(msg.sender != transaction.from,"creator cannot sign it");
        require(transaction.signatures[msg.sender] == false,"owner has already signed it");

        transaction.signatures[msg.sender] = true;

        transaction.signatureCount++;

        emit TransactionsSigned(msg.sender, _txnid);

        // logic for auto transaction when the treshold meets
        if(transaction.signatureCount >= MIN_SIGNATURE){
            require(address(this).balance >= transaction.amount,"Insufficient Amount");

            transaction.to.transfer(transaction.amount);

            emit TransferFunds(transaction.from, transaction.to, transaction.amount);
        }
    }

    function walletBalance() view public returns(uint) {
        return address(this).balance;
    }
}