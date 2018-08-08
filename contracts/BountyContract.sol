pragma solidity ^0.4.24;

contract BountyContract {

    address private owner;

    enum BountyStage {
        Open,
        Claimed,
        Closed
    }

    struct Bounty {
        uint bountyId;
        address creator;
        bytes32 desc;
        uint32 bountyAmt;
        BountyStage bountyStage;
    }

    mapping (uint => Bounty) bounties;
    uint numBounties;

    struct Solution {
        address hunter;
        bytes32 answer;
        bool accepted;
    }

    mapping (uint => Solution[]) solutions;

    function createBounty(bytes32 desc, uint32 bountyAmt) public returns (uint) {
        bounties[numBounties] = Bounty(numBounties, msg.sender, desc, bountyAmt, BountyStage.Open);
        numBounties++;
        return numBounties;
    }

    function getBounty(uint bountyId) public view returns (address, bytes32, uint) {
        return (bounties[bountyId].creator, bounties[bountyId].desc, bounties[bountyId].bountyAmt);
    }

    function returnBountiesCount() public view returns (uint bountyCount) {
        return numBounties;
    }

    function createSolution(uint bountyId, bytes32 answer) public returns (uint) {
        return solutions[bountyId].push(Solution(msg.sender, answer, false)); 
    }



    
    




    
}
