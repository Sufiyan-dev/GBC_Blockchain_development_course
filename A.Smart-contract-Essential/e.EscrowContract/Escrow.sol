// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {

    enum Status {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE
    }

    Status public currentState;

    address public buyer;
    address payable public seller;

    modifier onlyBuyer() {
        require(msg.sender == buyer," Only buyer");
        _;
    }

    constructor(address _buyer, address _seller) {
        buyer = _buyer;
        seller = payable(_seller);
    }

    function deposit() onlyBuyer external payable {
        require(currentState == Status.AWAITING_PAYMENT,"The buyer has already paid");
        currentState = Status.AWAITING_DELIVERY;
    }

    function confirmedDeliverey() onlyBuyer external {
        require(currentState == Status.AWAITING_DELIVERY,"Cannot confirm delivery!");
        currentState = Status.COMPLETE;
        seller.transfer(address(this).balance);
    }

}