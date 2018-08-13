var BountyContract = artifacts.require("./BountyContract.sol");
var CircuitBreakerContract = artifacts.require("./CircuitBreakerContract.sol");

module.exports = function (deployer) {
    deployer.deploy(BountyContract);
    deployer.deploy(CircuitBreakerContract);
};