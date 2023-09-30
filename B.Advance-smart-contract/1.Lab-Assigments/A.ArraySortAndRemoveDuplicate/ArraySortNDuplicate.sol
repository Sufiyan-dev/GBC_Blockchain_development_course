// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library ArrayManuplation {
    function sort(uint256[] memory arr) public pure returns(uint256[] memory) {
        // uint256[] sortedArray;

        for(uint i = 0; i < arr.length; i++){
            uint j = i;
            while (j > 0 && arr[j-1] > arr[j]) {
                (arr[j], arr[j-1]) = (arr[j-1], arr[j]);
                j--;
            }

        }

        return arr;
    }

    function removeDuplicate(uint256[] memory array) public pure returns(uint256[] memory) {

        uint[] memory sortedArr = sort(array);
        uint countLength = 0;
        for(uint i = 0; i < array.length; i++) {
            if(i == 0){
                countLength++;
            } else if(sortedArr[i] != sortedArr[i-1]){
                countLength++;
            }
        }

        uint[] memory uniqueArr = new uint[](countLength);
        uint currentIndexOfUniqueArr;
        for(uint i = 0; i < sortedArr.length; i++){
            if(i == 0){
                uniqueArr[currentIndexOfUniqueArr] = sortedArr[i];
                currentIndexOfUniqueArr++;
            } else if(sortedArr[i] != sortedArr[i-1]){
                uniqueArr[currentIndexOfUniqueArr] = sortedArr[i];
                currentIndexOfUniqueArr++;
            }
        }

        return uniqueArr;
    }

    function valueExist(uint256[] memory array, uint tillIndex, uint valueToFind) internal pure returns(bool) {
        if(tillIndex != 0) {
            for(uint i = 0; i < tillIndex; i++) {
                if(array[i] == valueToFind){
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
}