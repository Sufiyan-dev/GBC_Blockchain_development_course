// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TargetContract {
    uint256 public state;

    function updateState(uint256 amount) public {
        state = amount;
    }

}