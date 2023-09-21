// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CallerContract {
    uint256 public state;

    function updateViaDelegateCall(address target, uint256 _value) external {
        (bool success, ) = target.delegatecall(abi.encodeWithSignature("updateState(uint256)", _value));
        require(success, "Delegatecall failed.");
    }
}