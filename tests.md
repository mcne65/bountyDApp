# Tests

To run the tests, run the following command

``` truffle test ```

### CircuitBreakerContract.sol

#### 1. should return true that user is admin

Case: The `isUserAdmin()` function is called with the admin/owner address  
Expected Result: true (Boolean)  
Actual Result: true (Boolean)

#### 2. should return false that user is not admin

Case: The `isUserAdmin()` function is called with an address which is not the admin/owner address  
Expected Result: false (Boolean)  
Actual Result: false (Boolean)

#### 3. should return false that contract is not stopped

Case: The `isStopped()` function is called when the contract is not stopped  
Expected Result: false (Boolean)  
Actual Result: false (Boolean)

#### 4. should return true that the contract is stopped

Case: The `toggleContractActive()` function is called to stop the contract, then the `isStopped()` function is called   
Expected Result: true (Boolean)  
Actual Result: true (Boolean)

#### 5. should throw an exception with 'revert' opcode as the contract active state is not toggled by an admin

Case: The `toggleContractActive()` function is called by a user, who is not an admin/owner  
Expected Result: An exception with the `revert` opcode should be thrown  
Actual Result: An exception with the `revert` opcode is thrown

### BountyContract.sol

#### 1. should create a bounty correctly

To Test: A bounty is being created properly with the proper problem description and reward amount and states  
Case: Create a bounty with `createBounty()`, get the bounty with `getBounty()` and verify the input params match the output  
Expected Result: Input params match output params  
Actual Result: Input params match output params  

#### 2. should create a solution correctly

To Test: A solution is created properly with the appropriate solution statement  
Case: Create a solution with `createSolution()`, get the solution with `getSolution()` and verify the input params match the output  
Expected Result: Input params match output params  
Actual Result: Input params match output params

#### 3. should credit bounty reward to bounty hunter when solution is accepted

To Test: When solution is accepted, the bounty reward should be credited to bounty hunter, held in the escrow contract  
Case: Call `getSolutionToBeAwarded()` to get the bounty hunter address and reward. Call `untrustedCheckBountyWinnings()` to check the initial credit to the bounty hunter. Call `untrustedAcceptSolution()` to transfer the reward amount to the escrow contract. Call the `untrustedCheckBountyWinnings()` again to check the final credit to the hunter  
Expected Result: final credit = initial credit + bounty reward  
Actual Result: final credit = initial credit + bounty reward 

#### 4. should withdraw the bounty hunter's winnings from escrow to his address

To Test: Bounty hunter should be able to withdraw/pull his winnings credited to the Escrow account  
Case: Call `untrustedCheckBountyWinnings()` to check the available credit to be pulled. Check his initial balance. Call `untrustedWithdrawBountyReward()` to withdraw the credit and check his final balance  
Expected Result: final balance = initial balance + available credit - (gas used * gas price)  
Actual Result: final balance = initial balance + available credit - (gas used * gas price)

#### 5. should revert when bounty contract with reward 0 is created

To Test: Bounty creation with 0 ETH reward amount should not be possible  
Case: Call `createBounty()` with 0 reward amount  
Expected Result: Exception thrown with 'revert' opcode  
Actual Result: Exception thrown with 'revert' opcode

#### 6. should revert when bounty reward of 0 has to be credited

To Test: Credit transfer to escrow contract of 0 ETH should not be possible  
Case: Call `untrustedCreditTransfer()` with 0 value  
Expected Result: Exception thrown with 'revert' opcode  
Actual Result: Exception thrown with 'revert' opcode

#### 7. should revert when bounty reward of 0 has to be withdrawn

To Test: Withdrawal/Pull of 0 ETH value should not be possible  
Case: Call `untrustedWithdrawBountyReward()` from an address with 0 available credit  
Expected Result: Exception thrown with 'revert' opcode  
Actual Result: Exception thrown with 'revert' opcode
