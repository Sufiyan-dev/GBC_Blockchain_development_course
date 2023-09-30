require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMYKEY_SEPOLIA}`,
      accounts: [process.env.ADMIN_PRIVATE_KEY, process.env.MANAGER_PRIVATE_KEY]
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYKEY_MUMBAI}`,
      accounts: [process.env.ADMIN_PRIVATE_KEY, process.env.MANAGER_PRIVATE_KEY]
    },
    hardhat: {
        forking: {
          url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYKEY_MUMBAI}`,
        }
      }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.ETHERSCAN_MUMBAI_API_KEY,
      sepolia: process.env.ETHERSCAN_SEPOLIA_API_KEY
    }
  },
};
