// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CodeChecker {
    function hasCode(address _addr) public view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(_addr)
        }
        return codeSize > 0;
    }
}