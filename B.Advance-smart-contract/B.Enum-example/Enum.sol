// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Enum {
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Cancelled
    }

    Status public status;

    function get() external view returns(Status){
        return status;
    }

    function set(Status _status) public {
        status = _status;
    }

    function cancel() public {
        status = Status.Cancelled;
    }

    function remove() public {
        delete status;
    }
}