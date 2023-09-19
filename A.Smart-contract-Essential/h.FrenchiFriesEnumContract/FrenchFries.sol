// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract EnumDemo {

    enum Size {
        REGULAR,
        LARGE,
        SUPERSIZE
    }

    Size choice;

    function setChoice(Size _choice) public {
        // easy way
        choice = _choice; 

        // othe way
        if(uint(choice) == 0){
            choice = Size.LARGE;
        } else if(uint(choice) == 1){
            choice = Size.LARGE;
        } else {
            choice = Size.SUPERSIZE;
        }
    }

    function getChoice() public view returns(Size) {
        return choice;
    }
}