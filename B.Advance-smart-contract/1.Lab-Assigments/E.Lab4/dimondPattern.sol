// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library DiamondStorage {
    struct DS {
        address owner;
        mapping(bytes4 => address) selectorsToFacets;
    }

    function diamondStorage() internal pure returns (DS storage ds) {
        bytes32 position = keccak256("diamond.storage");
        assembly {
            ds.slot := position
        }
    }
}

contract CounterFacet {
    uint256 public count;

    function increment() external {
        count += 1;
    }
}

contract Diamond {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        DiamondStorage.DS storage ds = DiamondStorage.diamondStorage();
        ds.owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    fallback() external payable {
        DiamondStorage.DS storage ds = DiamondStorage.diamondStorage();
        address facet = ds.selectorsToFacets[msg.sig];
        require(facet != address(0), "Function does not exist.");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), facet, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return(ptr, size)}
        }
    }

    function setFacet(address _facet) external {
        require(msg.sender == DiamondStorage.diamondStorage().owner, "Only owner can set facets.");
        DiamondStorage.diamondStorage().selectorsToFacets[this.increment.selector] = _facet;
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == DiamondStorage.diamondStorage().owner, "Only owner can transfer ownership.");
        require(newOwner != address(0), "New owner cannot be the zero address.");
        emit OwnershipTransferred(DiamondStorage.diamondStorage().owner, newOwner);
        DiamondStorage.diamondStorage().owner = newOwner;
    }
}