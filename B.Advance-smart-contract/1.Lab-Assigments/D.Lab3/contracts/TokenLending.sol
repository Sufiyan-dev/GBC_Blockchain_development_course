// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

/**
 * @title TokenLendingPlatform - A decentralized lending platform for tokens in exchange for ETH collateral.
 * @author Sufiyan
 */
contract TokenLendingPlatform {
    IERC20 public lendingToken;

    /**
     * @dev Struct to store loan-related information for each user.
     */
    struct LoanInfo {
        uint256 ethCollateral;
        uint256 loanStartBlock;
        uint256 tokensBorrowed;
    }

    mapping(address => LoanInfo) public Loans;
    uint256 public interestRateBPS;  // Basis points. 1 BPS = 0.01%
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    event TokenBorrowed(address indexed borrower, uint256 ethAmount, uint256 tokenAmount);
    event TokenRepaid(address indexed borrower, uint256 ethAmount, uint256 totalRepaidAmount);

    /**
     * @dev Constructor to initialize the lending platform.
     * @param initialInterestRateBPS Initial interest rate to be set, in basis points.
     * @param _token Address of the ERC20 token to be used for lending.
     */
    constructor(uint256 initialInterestRateBPS, address _token) {
        owner = msg.sender;
        interestRateBPS = initialInterestRateBPS;
        lendingToken = IERC20(_token);
    }

    /**
     * @notice Allows users to borrow tokens by depositing ETH as collateral.
     */
    function borrowTokens() external payable {
        require(msg.value > 0, "Must deposit a positive amount of Ether");

        uint256 tokenAvailable = lendingToken.balanceOf(address(this));
        require(tokenAvailable >= msg.value, "Not enough tokens in the contract");
        LoanInfo memory userLoanInfo  = Loans[msg.sender];
        require(userLoanInfo.tokensBorrowed == 0,"Must complete the previous loan");

        uint256 amountReceived = msg.value;

        Loans[msg.sender] = LoanInfo({
            tokensBorrowed: amountReceived,
            loanStartBlock: block.number,
            ethCollateral: amountReceived
        });

        require(lendingToken.transfer(msg.sender, amountReceived), "Token transfer failed");

        emit TokenBorrowed(msg.sender, amountReceived, amountReceived);
    }

    /**
     * @notice Allows users to repay their token loans and reclaim their ETH collateral.
     */
    function repayTokenLoan() external {
        LoanInfo memory userLoanInfo = Loans[msg.sender];
        uint256 borrowedWithInterestDue = getTotalRepaymentForLoan(msg.sender, userLoanInfo.tokensBorrowed);
        require(lendingToken.allowance(msg.sender, address(this)) >= borrowedWithInterestDue,"Insufficient tokens allowance for repayment");
        require(lendingToken.balanceOf(msg.sender) >= borrowedWithInterestDue, "Insufficient tokens balance for interest repayment");

        uint256 userTokenBorrowed = userLoanInfo.tokensBorrowed;

        delete Loans[msg.sender];

        require(lendingToken.transferFrom(msg.sender, address(this), borrowedWithInterestDue), "Token transferFrom failed");
        payable(msg.sender).transfer(userTokenBorrowed);

        emit TokenRepaid(msg.sender, userTokenBorrowed, borrowedWithInterestDue);
    }

    /**
     * @dev Computes the interest due for a given borrower and borrowed amount.
     * @param borrower Address of the borrower.
     * @param borrowedAmount Amount of tokens borrowed.
     * @return Computed interest amount.
     */
    function computeInterestFor(address borrower, uint256 borrowedAmount) private view returns(uint256) {
        uint256 blocksElapsed = block.number - Loans[borrower].loanStartBlock;
        return (borrowedAmount * interestRateBPS * blocksElapsed) / 10000; // Assuming 0.01% interest
    }

    /**
     * @notice Fetches the total repayment amount, including the principal and interest.
     * @param borrower Address of the borrower.
     * @param borrowedAmount Amount of tokens borrowed.
     * @return Total repayment amount.
     */
    function getTotalRepaymentForLoan(address borrower, uint256 borrowedAmount) public view returns(uint256) {
        return borrowedAmount + computeInterestFor(borrower, borrowedAmount);
    }

    /**
     * @notice Provides the equivalent amount of tokens for a given ETH amount.
     * @param ethAmount Amount of ETH.
     * @return Equivalent amount of tokens.
     */
    function quouteBorrowableAmount(uint ethAmount) public pure returns(uint256) {
        return ethAmount;
    }
 
    /**
     * @notice Fetches the available liquidity of tokens in the contract.
     * @return Balance of tokens in the contract.
     */
    function tokenLiquidity() public view returns(uint256) {
        return lendingToken.balanceOf(address(this));
    }
}
