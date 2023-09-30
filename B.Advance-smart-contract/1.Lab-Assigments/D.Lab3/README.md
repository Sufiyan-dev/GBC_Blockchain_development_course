# TokenLendingPlatform 🌉💱

**TokenLendingPlatform** is a decentralized application built on the Ethereum blockchain that facilitates lending of specific ERC20 tokens in exchange for ETH collateral. Users can borrow tokens by depositing ETH and can repay their token loans to reclaim their ETH collateral.

## Table of Contents 📚

- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features 🌟

- **Lend Tokens**: Users can deposit ETH to borrow equivalent amounts of the specified ERC20 token.
  
- **Repay Loans**: Users can repay their token loans and get back their ETH collateral.

- **Flexible Interest**: An interest rate defined in basis points accrues over blocks for borrowed amounts.

- **Owner Control**: Certain functions are modifiable only by the contract owner.

## Setup and Installation 🛠

1. **Prerequisites**:
   - NodeJS
   - Hardhat

2. **Clone the repository**:
`git clone <repository_link>`


3. **Navigate to the directory**:
`cd TokenLendingPlatform`


4. **Install dependencies**:
`npm install`


5. **Compile the smart contract**:
`npx hardhat compile`


6. **Deploy to local blockchain**:
`npx hardhat run scripts/deploy.js`


## Usage 🚀

**Borrowing Tokens**: 
- Users can call the `borrowTokens()` function by sending the desired ETH amount.

**Repaying Loans**: 
- Users should approve the lending contract to spend the required ERC20 tokens on their behalf and then call the `repayTokenLoan()` function.

**Viewing Interest and Total Repayable**:
- The `getTotalRepaymentForLoan()` function can be used to fetch total repayable amount.

## Testing 🧪

To test the smart contracts, run:
`npx hardhat test`

Make sure hardhat node is running if you're using it as your local Ethereum blockchain.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#).

## License 📜

This project is [MIT](LICENSE) licensed.