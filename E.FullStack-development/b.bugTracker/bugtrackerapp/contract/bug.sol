// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

contract BugTracker {
    enum bugStatus {
        Reported,
        InProgress,
        Done
    }

    struct Bug {
        uint256 id;
        string description;
        bugStatus status;
    }

    mapping(address => Bug[]) private Users;

    function addBug(uint256 _id, string calldata _description) external {
        Users[msg.sender].push(Bug({id: _id, description: _description, status: bugStatus.Reported}));
    }

    function getBug(uint256 _bugIndex) external view returns(Bug memory){
        return Users[msg.sender][_bugIndex];
    }

    function updateBugStatus(uint256 _bugIndex, bugStatus _newBugStatus) external {
        Users[msg.sender][_bugIndex].status = _newBugStatus;
    }

    function getBugCount() external view returns(uint256) {
        return Users[msg.sender].length;
    }
}