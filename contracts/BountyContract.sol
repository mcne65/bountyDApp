pragma solidity ^0.4.24;

import "./CircuitBreakerContract.sol";
import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";

contract BountyContract is PullPayment, CircuitBreakerContract {

  address private owner;

  constructor() public {
    owner = msg.sender;
  }

  enum BountyStage {
    Open,
    Closed
  }

  struct Bounty {
    uint32 bountyId;
    address creator;
    bytes32 desc;
    uint256 bountyAmt;
    BountyStage bountyStage;
  }

  mapping (uint32 => Bounty) bounties;
  uint32 numBounties;

  struct Solution {
    uint32 solutionId;
    address hunter;
    bytes32 answer;
    bool accepted;
  }

  mapping (uint32 => mapping(uint32 => Solution)) solutions;
  mapping (uint32 => uint32) numSolutions;

  /// CRUD on Bounties ///

  function createBounty(bytes32 desc, uint256 bountyAmt) public stopInEmergency returns (uint32) {
    bounties[numBounties] = Bounty(numBounties, msg.sender, desc, bountyAmt, BountyStage.Open);
    numBounties++;
    return numBounties;
  }
  
  function getBounty(uint32 bountyId) public view returns (address, bytes32, uint256, uint32) {
    return (bounties[bountyId].creator, bounties[bountyId].desc, bounties[bountyId].bountyAmt, uint32(bounties[bountyId].bountyStage));
  }

  function returnBountiesCount() public view returns (uint32) {
    return numBounties;
  }

  /// CRUD on Solutions ///

  function createSolution(uint32 bountyId, bytes32 answer) public stopInEmergency returns (uint32) {
    solutions[bountyId][numSolutions[bountyId]] = Solution(numSolutions[bountyId], msg.sender, answer, false);
    numSolutions[bountyId]++;
    return numSolutions[bountyId];
  }

  function getSolution(uint32 bountyId, uint32 solutionId) public view returns (address, bytes32, bool) {
    return (solutions[bountyId][solutionId].hunter, solutions[bountyId][solutionId].answer, solutions[bountyId][solutionId].accepted);
  }

  function returnSolutionsCount(uint32 bountyId) public view returns (uint32) {
    return numSolutions[bountyId];
  }

  function markSolutionAccepted(uint32 bountyId, uint32 solutionId) public stopInEmergency {
    solutions[bountyId][solutionId].accepted = true;
  }

  function markBountyClosed(uint32 bountyId) public stopInEmergency {
    bounties[bountyId].bountyStage = BountyStage.Closed;
  }

  function getSolutionToBeAwarded(uint32 bountyId, uint32 solutionId) public view 
  isAcceptedSolution(bountyId, solutionId) returns (address, uint256) {
    return(solutions[bountyId][solutionId].hunter, bounties[bountyId].bountyAmt);
  }


  ///MODIFIERS///

  modifier onlyOwner() {
    require(msg.sender == owner, "Sender is not owner");
    _;
  }

  modifier isCreator(uint32 bountyId) {
    require(msg.sender == bounties[bountyId].creator, "Sender is not Bounty creator");
    _;
  }

  modifier isHunter(uint32 bountyId, uint32 solutionId) {
    require(msg.sender == solutions[bountyId][solutionId].hunter, "Sender is not Bounty Hunter");
    _;
  }

  modifier isAcceptedSolution(uint32 bountyId, uint32 solutionId) {
    require(solutions[bountyId][solutionId].accepted == true, "Solution is not accepted");
    _;
  }


/// Bounty Payment Operations ///

  function creditTransfer(address dest, uint256 amount) public stopInEmergency {
    asyncTransfer(dest, amount);
  }

  function withdrawBountyReward() public {
    withdrawPayments();
  }

  function checkBountyWinnings(address hunterAddress) public view returns(uint256) {
    return payments(hunterAddress);
  }
  
}
