var BountyContract = artifacts.require("./BountyContract.sol");

contract('BountyContract', function (accounts) {

    it("should create a bounty correctly", function () {
        var bountyContractInstance;
        var bountyDesc = '0x0000000000000000000000000000000000000000000000000000000000000000';
        var bountyAmt = web3.toWei(1, "ether");
        return BountyContract.deployed().then(function (instance) {
            bountyContractInstance = instance;
            return bountyContractInstance.createBounty(bountyDesc, bountyAmt, { from: accounts[0] });
        }).then(function () {
            return bountyContractInstance.returnBountiesCount({ from: accounts[0] });
        }).then(function (numBounties) {
            assert.equal(numBounties.valueOf(), 1, "Bounty has not been created");
            return bountyContractInstance.getBounty(numBounties.valueOf() - 1, { from: accounts[0] }).then(function (bounty) {
                var bountyCreator = bounty[0];
                var desc = bounty[1];
                var amt = bounty[2];
                var bountyStage = bounty[3];
                assert.equal(bountyCreator, accounts[0], "Bounty not created correctly, creator wrong");
                assert.equal(desc, bountyDesc, "Bounty not created correctly, desc wrong");
                assert.equal(amt.valueOf(), bountyAmt, "Bounty not created correctly, amt is wrong");
                assert.equal(bountyStage.valueOf(), 0, "Bounty not created correctly, bounty stage wrong");
            })
        })
    });
    it("should create a solution correctly", function () {
        var bountyContractInstance;
        var bountyId = 0;
        var solutionId;
        var solutionDesc = '0x0000000000000000000000000000000000000000000000000000000000000000';
        return BountyContract.deployed().then(function (instance) {
            bountyContractInstance = instance;
            return bountyContractInstance.createSolution(bountyId, solutionDesc, { from: accounts[1] });
        }).then(function () {
            return bountyContractInstance.returnSolutionsCount(bountyId, { from: accounts[0] });
        }).then(function (numSolutions) {
            assert.equal(numSolutions.valueOf(), 1, "Solution has not been created");
            solutionId = numSolutions.valueOf() - 1;
            return bountyContractInstance.getSolution(bountyId, solutionId, { from: accounts[0] });
        }).then(function (solution) {
            var bountyHunter = solution[0];
            var bountySolution = solution[1];
            var solutionAcceptedState = solution[2].valueOf();
            assert.equal(bountyHunter, accounts[1], "Solution for bounty not created correctly, hunter address is wrong");
            assert.equal(bountySolution, solutionDesc, "Solution for bounty not created properly, solution desc wrong");
            assert.equal(solutionAcceptedState, false, "solution for bounty not created correctly, solution state wrong");
        })
    });

    it("should mark solution accepted and bounty closed when solution accepted for an Open bounty", function () {
        var bountyContractInstance;
        var bountyId = 0;
        var solutionId = 0;
        return BountyContract.deployed().then(function (instance) {
            bountyContractInstance = instance;
            return bountyContractInstance.markSolutionAccepted(bountyId, solutionId, { from: accounts[0] });
        }).then(function () {
            return bountyContractInstance.getSolution(bountyId, solutionId, { from: accounts[0] });
        }).then(function (solution) {
            assert.equal(solution[2].valueOf(), true, "Solution is still not accepted");
        }).then(function () {
            return bountyContractInstance.markBountyClosed(bountyId, { from: accounts[0] });
        }).then(function () {
            return bountyContractInstance.getBounty(bountyId, { from: accounts[0] });
        }).then(function (bounty) {
            assert.equal(bounty[3].valueOf(), 1, "Bounty is still open");
        })
    });
    it("should credit bounty reward to bounty hunter when solution is accepted", function () {
        var bountyContractInstance;
        var bountyId = 0;
        var solutionId = 0;
        var bountyHunter;
        var bountyReward;
        var initialCredit;
        var finalCredit;
        return BountyContract.deployed().then(function (instance) {
            bountyContractInstance = instance;
            return bountyContractInstance.getSolutionToBeAwarded(bountyId, solutionId, { from: accounts[0] });
        }).then(function (solution) {
            bountyHunter = solution[0];
            bountyReward = solution[1].valueOf();
            return bountyContractInstance.checkBountyWinnings(bountyHunter, { from: accounts[0] });
        }).then(function (initialBalance) {
            initialCredit = initialBalance.valueOf();
            return bountyContractInstance.creditTransfer(bountyHunter, bountyReward, { from: accounts[0], value: bountyReward });
        }).then(function () {
            return bountyContractInstance.checkBountyWinnings(bountyHunter, { from: accounts[0] });
        }).then(function (finalBalance) {
            finalCredit = finalBalance.valueOf();
            assert.equal(finalCredit, parseInt(initialCredit) + parseInt(bountyReward), "correct amount not credited to bounty hunter");
        })
    });
    it("should withdraw the bounty hunter's winnings from escrow to his address", function () {
        var bountyContractInstance;
        var bountyHunterAddress = accounts[1];
        var initialBalance = web3.eth.getBalance(bountyHunterAddress).valueOf();
        var finalBalance;
        var availableCredit;
        return BountyContract.deployed().then(function (instance) {
            bountyContractInstance = instance;
            return bountyContractInstance.checkBountyWinnings(bountyHunterAddress, { from: bountyHunterAddress });
        }).then(function (credit) {
            availableCredit = credit.valueOf();
            return bountyContractInstance.withdrawBountyReward({ from: bountyHunterAddress });
        }).then(function (tx) {
            var weiUsedForGas = parseInt(tx.receipt.gasUsed) * parseInt(web3.eth.gasPrice.valueOf());
            finalBalance = web3.eth.getBalance(bountyHunterAddress).valueOf();
            assert.equal(finalBalance, parseInt(initialBalance) + parseInt(availableCredit) - weiUsedForGas, "Bounty winnings not withdrawn to bounty hunter's address");
        })
    });

});
