pragma solidity ^0.4.24;

import "./CircuitBreakerContract.sol";
import "../node_modules/openzeppelin-solidity/contracts/payment/PullPayment.sol";

contract BountyContract is PullPayment, CircuitBreakerContract {

  address private owner;

  constructor(address admin) public {
    owner = msg.sender;
    CircuitBreakerContract(admin);
  }

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
    uint solutionId;
    address hunter;
    bytes32 answer;
    bool accepted;
  }

  mapping (uint => mapping(uint => Solution)) solutions;
  mapping (uint => uint) numSolutions;

  /// CRUD on Bounties ///

  function createBounty(bytes32 desc, uint32 bountyAmt) public returns (uint) {
    bounties[numBounties] = Bounty(numBounties, msg.sender, desc, bountyAmt, BountyStage.Open);
    numBounties++;
    return numBounties;
  }
  
  function getBounty(uint bountyId) public view returns (address, bytes32, uint) {
    return (bounties[bountyId].creator, bounties[bountyId].desc, bounties[bountyId].bountyAmt);
  }

  function returnBountiesCount() public view returns (uint) {
    return numBounties;
  }

  /// CRUD on Solutions ///

  function createSolution(uint bountyId, bytes32 answer) public returns (uint) {
    solutions[bountyId][numSolutions[bountyId]] = Solution(numSolutions[bountyId], msg.sender, answer, false);
    numSolutions[bountyId]++;
    return numSolutions[bountyId];
  }

  function getSolution(uint bountyId, uint solutionId) public view returns (address, bytes32, bool) {
    return (solutions[bountyId][solutionId].hunter, solutions[bountyId][solutionId].answer, solutions[bountyId][solutionId].accepted);
  }

  function returnSolutionsCount(uint bountyId) public view returns (uint) {
    return numSolutions[bountyId];
  }

  function markSolutionAccepted(uint bountyId, uint solutionId) public {
    solutions[bountyId][solutionId].accepted = true;
  }

  ///MODIFIERS///

  modifier onlyOwner() {
    require(msg.sender == owner, "Sender is not owner");
    _;
  }

  modifier onlyCreator(uint bountyId) {
    require(msg.sender == bounties[bountyId].creator, "Sender is not Bounty creator");
    _;
  }

  modifier onlyHunter(uint bountyId, uint solutionId) {
    require(msg.sender == solutions[bountyId][solutionId].hunter, "Sender is not Bounty Hunter");
    _;
  }

  modifier onlyAcceptedSolution(uint bountyId, uint solutionId) {
    require(solutions[bountyId][solutionId].accepted == true, "Solution is not accepted");
    _;
  }


/// Bounty Payment Operations ///

  function awardBounty(uint bountyId, uint solutionId) external onlyOwner stopInEmergency 
  onlyCreator(bountyId) onlyAcceptedSolution(bountyId, solutionId) {
    address bountyWinner = solutions[bountyId][solutionId].hunter;
    uint32 bountyAmount = bounties[bountyId].bountyAmt;
    asyncTransfer(bountyWinner, bountyAmount);
  }

  function withdrawBountyWinnings(uint bountyId, uint solutionId) external onlyOwner onlyHunter(bountyId, solutionId) {
    withdrawPayments();
  }

  function checkBountyWinnings(uint bountyId, uint solutionId) external view onlyOwner onlyHunter(bountyId, solutionId) {
    address bountyHunter = solutions[bountyId][solutionId].hunter;
    payments(bountyHunter);
  }

  function withdrawAll() public onlyInEmergency {
    withdrawAll();
  } 
  
}
