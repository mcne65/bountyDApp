// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = "maximum future leave orange taxi code delay modify afford outer amazing idle"

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gasPrice: 20000000000,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/1ca8cfbe21624ba8a6740938b390e2dc")
      },
      network_id: 4
    }
  }
}