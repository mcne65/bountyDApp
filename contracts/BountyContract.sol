pragma solidity ^0.4.24;

contract BountyContract {

    address public owner;

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
        bytes32 answer;
        address hunter;
        bool accepted;
    }

    mapping (uint => Solution[]) solutions;
    




    
}
