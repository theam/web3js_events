require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const NETWORK_URL = process.env.URL;
// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: NETWORK_URL,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
