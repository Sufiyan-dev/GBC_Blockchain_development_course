// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract rockPaperScissors{

    address payable public player1;
    address payable public player2;

    string private player1Choice;
    string private player2Choice;

    bool private hasPlayer1Choice;
    bool private hasPlayer2Choice;

    uint public stake;

    mapping (string => mapping (string => uint)) private states;

    modifier isJoinable() {
        require(player1 == address(0) || player2 == address(0),"Slots are full!");
        require(msg.value == stake,"You have to pay the state if you want to play");
        _;
    }

    modifier isPlayer() {
        require(msg.sender == player1 || msg.sender == player2,"You are not the player");
        _;
    }

    modifier isValidChoice(string memory _playerChoice) {
        require(keccak256(abi.encode(_playerChoice)) == keccak256(abi.encode("R")) || keccak256(abi.encode(_playerChoice)) == keccak256(abi.encode("P")) || keccak256(abi.encode(_playerChoice)) == keccak256(abi.encode("S")),"Invalid Choice");
        _;
    }

    modifier playerHasMadeChoice() {
        require(hasPlayer1Choice && hasPlayer2Choice,"both players must make a choice");
        _;
    }

    /**
     * R - Rock
     * P - Paper
     * S - Scissor
     * 
     * 0 - Tie
     * 1 - Player 1 wins
     * 2 - Player 2 wins
     */
    constructor() {
        states["R"]["R"] = 0;
        states["P"]["P"] = 0;
        states["S"]["S"] = 0;
        states["R"]["P"] = 2;
        states["R"]["S"] = 1;
        states["P"]["R"] = 1;
        states["P"]["S"] = 2;
        states["S"]["R"] = 2;
        states["S"]["P"] = 1;

        stake = 1 ether;
    }

    function join() external payable isJoinable {
        if(player1 == address(0)){
            player1 = payable(msg.sender);
        } else {
            player2 = payable(msg.sender);
        }
    }

    function makeChoice(string calldata _playerChoice) external isPlayer  isValidChoice(_playerChoice) {
        if(msg.sender == player1 && !hasPlayer1Choice){
            player1Choice = _playerChoice;
            hasPlayer1Choice = true;
        } else if(msg.sender == player2 && !hasPlayer2Choice) {
            player2Choice = _playerChoice;
            hasPlayer2Choice = true;
        }
    }

    function diclose() external isPlayer playerHasMadeChoice {
        uint result = states[player1Choice][player2Choice];
        // FUNDS TRANSFER
        if(result == 0){
            player1.transfer(stake);
            player2.transfer(stake);
        } else if(result == 1){
            player1.transfer(address(this).balance);
        } else if(result == 2) {
            player2.transfer(address(this).balance);
        }

        // RESET
        player1 = payable(address(0));
        player2 = payable(address(0));

        player1Choice = "";
        player2Choice = "";

        hasPlayer1Choice = false;
        hasPlayer2Choice = false;

    }

}