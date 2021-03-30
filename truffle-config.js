
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

require("dotenv").config({path: "./.env"});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/d4373ae56bbb4803baa1d32c03d39893", AccountIndex)
      },
      network_id: 5,
    }
  },
  compilers: {
    solc: {
       	version: "^0.6.0"
    }
  }
};
