var BountyContract = artifacts.require("./BountyContract.sol");
var EmployeeContract = artifacts.require("./EmployeeContract.sol");

module.exports = function (deployer) {
    deployer.deploy(BountyContract);
    deployer.deploy(EmployeeContract);
};