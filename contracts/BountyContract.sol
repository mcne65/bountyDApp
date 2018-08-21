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
    string desc;
    uint256 bountyAmt;
    BountyStage bountyStage;
  }

  mapping (uint32 => Bounty) bounties;
  uint32 numBounties;

  struct Solution {
    uint32 solutionId;
    address hunter;
    string answer;
    bool accepted;
  }

  mapping (uint32 => mapping(uint32 => Solution)) solutions;
  mapping (uint32 => uint32) numSolutions;

  /// CRUD on Bounties ///

  function createBounty(string desc, uint256 bountyAmt) public 
  stopInEmergency amountIsNotZero(bountyAmt) bountiesCountDoesNotOverflow returns (uint32) {
    bounties[numBounties] = Bounty(numBounties, msg.sender, desc, bountyAmt, BountyStage.Open);
    numBounties++;
    return numBounties;
  }
  
  function getBounty(uint32 bountyId) public view validateBountiesIndex(bountyId) returns (address, string, uint256, uint32) {
    return (bounties[bountyId].creator, bounties[bountyId].desc, bounties[bountyId].bountyAmt, uint32(bounties[bountyId].bountyStage));
  }

  function returnBountiesCount() public view returns (uint32) {
    return numBounties;
  }

  /// CRUD on Solutions ///

  function createSolution(uint32 bountyId, string answer) public stopInEmergency solutionsCountDoesNotOverflow(bountyId) returns (uint32) {
    solutions[bountyId][numSolutions[bountyId]] = Solution(numSolutions[bountyId], msg.sender, answer, false);
    numSolutions[bountyId]++;
    return numSolutions[bountyId];
  }

  function getSolution(uint32 bountyId, uint32 solutionId) public view 
  validateSolutionsIndex(bountyId, solutionId) returns (address, string, bool) {
    return (solutions[bountyId][solutionId].hunter, solutions[bountyId][solutionId].answer, solutions[bountyId][solutionId].accepted);
  }

  function returnSolutionsCount(uint32 bountyId) public view validateBountiesIndex(bountyId) returns (uint32) {
    return numSolutions[bountyId];
  }

  function markSolutionAccepted(uint32 bountyId, uint32 solutionId) public 
  validateBountiesIndex(bountyId) validateSolutionsIndex(bountyId, solutionId) stopInEmergency 
  onlyOpenBounty(bountyId) isCreator(bountyId) solutionNotAccepted(bountyId, solutionId) {
    solutions[bountyId][solutionId].accepted = true;
  }

  function markBountyClosed(uint32 bountyId) public validateBountiesIndex(bountyId) stopInEmergency 
  onlyOpenBounty(bountyId) isCreator(bountyId) {
    bounties[bountyId].bountyStage = BountyStage.Closed;
  }

  function getSolutionToBeAwarded(uint32 bountyId, uint32 solutionId) public view validateBountiesIndex(bountyId)
  validateSolutionsIndex(bountyId, solutionId) isAcceptedSolution(bountyId, solutionId) returns (address, uint256) {
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

  modifier isAcceptedSolution(uint32 bountyId, uint32 solutionId) {
    require(solutions[bountyId][solutionId].accepted == true, "Solution is not accepted");
    _;
  }

  modifier solutionNotAccepted(uint32 bountyId, uint32 solutionId) {
    require(solutions[bountyId][solutionId].accepted == false, "Solution is already accepted");
    _;
  }

  modifier onlyOpenBounty(uint32 bountyId) {
    require(bounties[bountyId].bountyStage == BountyStage.Open, "Bounty is closed");
    _;
  }

  modifier amountIsNotZero(uint256 amount) {
    require(amount!=0, "Amount is zero");
    _;
  }

  modifier bountiesCountDoesNotOverflow {
    require((numBounties + 1) > numBounties, "No. of bounties is more than uint32 can support");
    _;
  }

  modifier solutionsCountDoesNotOverflow (uint32 bountyId) {
    require((numSolutions[bountyId] + 1) > numSolutions[bountyId], "No. of solutions is more than uint32 can support");
    _;
  }

  modifier validateBountiesIndex (uint32 bountyId) {
    require(bountyId < numBounties, "Array index out of bounds");
    _;
  }

  modifier validateSolutionsIndex (uint32 bountyId, uint32 solutionId) {
    require(solutionId < numSolutions[bountyId], "Array index out of bounds");
    _;
  }

  modifier withdrawAmtIsNotZero (address bountyHunterAddress) {
    require(checkBountyWinnings(bountyHunterAddress)!=0, "Nothing to withdraw");
    _;
  }


/// Bounty Payment Operations ///

  function creditTransfer(address dest, uint256 amount) public payable stopInEmergency amountIsNotZero(amount) {
    asyncTransfer(dest, amount);
  }

  function withdrawBountyReward() public withdrawAmtIsNotZero(msg.sender) {
    withdrawPayments();
  }

  function checkBountyWinnings(address hunterAddress) public view returns(uint256) {
    return payments(hunterAddress);
  }
  
}
