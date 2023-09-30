// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IToken {
    function mint(address to, uint amount) external;
    function burn(uint amount) external;
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function bridgeManager() external view returns(address);
}

/**
 * @title TokenBridge
 * @author Sufiyan
 * @notice This contract facilitates the bridging of a specified token between chains.
 */
contract TokenBridge {

    struct TokenInfo {
        uint sentAmount;
        uint confirmedAmount;
        uint receivedAmount;
    }
    /**
     * @notice mapping from user to token and its info
     */
    mapping(address => mapping(address => TokenInfo)) public userTokenData;

    event TokenBridged(address indexed token, address indexed user, uint amount);
    event TokensReceived(address indexed token, address indexed user, uint amount);
    event TokensConfirmed(address indexed token, address indexed user, uint amount);

    address public bridgeAdmin;
    address public bridgeManager;
    address public bridgeToken;

    constructor(address _bridgeToken, address _bridgeManager) {
        bridgeAdmin = msg.sender;
        bridgeToken = _bridgeToken;
        bridgeManager = _bridgeManager;
    }

    /**
     * @dev Allows users to send tokens to be bridged.
     * @param _token The token to bridge.
     * @param amount The amount of tokens to bridge.
     */
    function sendTokens(address _token, uint amount) external {
        require(_token == bridgeToken, "Token not supported for bridging");
        require(IToken(_token).allowance(msg.sender, address(this)) >= amount, "Insufficient token allowance");
        require(IToken(_token).bridgeManager() != address(0),"manager not set yet");

        IToken(_token).transferFrom(msg.sender, address(this), amount);
        IToken(_token).burn(amount);

        userTokenData[msg.sender][_token].sentAmount += amount;

        emit TokenBridged(bridgeToken, msg.sender, amount);
    }

    /**
     * @dev Mints tokens that have been bridged.
     * @param recipient The address receiving the tokens.
     * @param amount The amount of tokens.
     * @param _token The bridged token.
     */
    function mintReceivedTokens(address recipient, uint amount, address _token) external {
        require(msg.sender == bridgeManager, "Only the bridge manager can mint");
        require(_token == bridgeToken, "Token not supported for bridging");

        IToken(_token).mint(recipient, amount);

        emit TokensReceived(_token, recipient, amount);
    } 

    /**
     * @dev Confirms that bridged tokens have reached their destination.
     * @param user The user who sent the tokens.
     * @param amount The amount of tokens.
     * @param _token The bridged token.
     */
    function confirmTokenDelivery(address user, uint amount, address _token) external {
        require(msg.sender == bridgeManager, "Only the bridge manager can confirm");
        require(_token == bridgeToken, "Token not supported for bridging");

        userTokenData[user][_token].confirmedAmount += amount;

        emit TokensConfirmed(_token, user, amount);
    }

    /**
     * @dev Updates the allowed bridging token
     * @param _tokenAddress new token address
     */
    function updateToken(address _tokenAddress) public {
        require(msg.sender == bridgeAdmin,"only owner can update ");

        bridgeToken = _tokenAddress;
    }

    /**
     * @dev update allowed manager, for minting and updating state when confirmed
     * @param _newManager new manager address
     */
    function updateManager(address _newManager) public {
        require(msg.sender == bridgeAdmin,"only owner can update ");

        bridgeManager = _newManager;
    }
}