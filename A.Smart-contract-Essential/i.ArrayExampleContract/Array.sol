// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract arrayDemo {

    // DYNAMIC ARRAY
    uint[] public myArray;

    // DYANMIC ARRAY WITH SOME VALUE INITIALZE
    uint[] public myArray2 = [1,2,3];

    // FIXED SIZE ARRAY WITH SOME VALUE INITIALZE
    // BY DEFAULT ALL THE EMPTY SPACE WILL BE FILL WITH ZERO, BY DEFAULT
    uint[5] public myArray3 = [1,2,3];

    // OTHER TYPES ARRAY
    int[] myArray4;
    bool[] myArray5;
    address[] myArray6;

    function addElement(uint _value) public {
        myArray.push(_value);
    }

    function getItemsInArray(uint _Index) external view returns(uint) {
        return myArray[_Index];
    }

    function updateTheArrayElement(uint _index, uint _value) external {
        myArray[_index] = _value;
    }

    function resetTheArrayElement(uint _index) external {
        delete myArray[_index];
    }

    function getLengthOfArray() external view  returns(uint) {
        return myArray.length;
    }

}