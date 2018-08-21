var CircuitBreakerContract = artifacts.require("./CircuitBreakerContract.sol");

contract('CircuitBreakerContract', function (accounts) {

    it("should return true that user is admin", function () {
        return CircuitBreakerContract.deployed().then(function (instance) {

            return instance.isUserAdmin({ from: accounts[0] });
        }).then(function (result) {
            assert.equal(result, true, "The user is not admin");
        });
    });
    it("should return false that user is not admin", function () {
        return CircuitBreakerContract.deployed().then(function (instance) {
            return instance.isUserAdmin({ from: accounts[1] });
        }).then(function (result) {
            assert.equal(result, false, "The user is admin");
        })
    });
    it("should return false that contract is not stopped", function () {
        return CircuitBreakerContract.deployed().then(function (instance) {
            return instance.isStopped({ from: accounts[0] });
        }).then(function (result) {
            assert.equal(result, false, "Contract is stopped");
        })
    });
    it("should return true that the contract is stopped", function () {
        var circuitBreakerContractInstance;
        return CircuitBreakerContract.deployed().then(function (instance) {
            circuitBreakerContractInstance = instance;
            return circuitBreakerContractInstance.toggleContractActive();
        }).then(function () {
            return circuitBreakerContractInstance.isStopped({ from: accounts[0] });
        }).then(function (result) {
            assert.equal(result, true, "Contract is not stopped");
        })
    });
    it("should revert as the contract active state is not toggled by an admin", function () {
        return CircuitBreakerContract.deployed().then(function (instance) {
            return instance.toggleContractActive({ from: accounts[1] });
        }).then(assert.fail).catch(function (error) {
            assert.include(error.message, "revert", error.toString());
        })
    });
});
