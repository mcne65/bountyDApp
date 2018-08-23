# bountyDApp

`Version 0.1.0`

1. [Features](#1-features)
2. [Setup](#2-setup)
3. [Interaction](#3-interaction)
4. [Implementation](#4-implementation)
5. [Tests](#5-tests)
6. [Design Pattern Desicions](#6-design-pattern-desicions)
7. [Avoiding Common Attacks](#7-avoiding-common-attacks)
8. [Library/Contracts Imported](#8-library/contracts-imported)
9. [Rinkeby Test Network and IPFS](#9-how-to-access)

A Decentralized Application for Bounty Creator and Hunters

## 1. Features

The application lets any user create a bounty with a reward or submit a solution for an open bounty. It has the following features:

- A bounty creator can create a bounty entering a bounty description and setting a bounty reward in ETH
- Any user can browse through the existing bounties, see the bounty problem statement, compare the bounty rewards and submit a solution for an open bounty
- Any user can use the dashboard to - 
    - see the status of their created bounties, go through the submitted solutions and accept a solution
    - see the status of their submitted solutions, whether accepted or not, check the bounty winnings credited to them in an escrow account and withdraw their bounty winnings into their personal account
- The owner/administrator of the application/smart contracts can pause/un-pause the application features in case of an attack/vulnerability
- When the application is paused the user will not be able to create any bounties, submit any solutions or accept any solutions. User will only be able to withdraw any bounty winnings into his/her account

## 2. Setup

To run the application locally, follow the steps,

Clone the repo

``` git clone https://github.com/s4ndhyac/bountyDApp.git ```

Install the packages required

``` npm install  ```

Start ganache-cli on port 8545

``` ganache-cli ```

Make sure you have Metamask installed and import the accounts provided by ganache-cli by importing with the seed phrase

Compile and deploy the smart contracts

``` truffle compile ```

``` truffle migrate --reset ```

Run the script to serve the application on port 3000

``` npm run start ```

The DApp is also deployed on the Rinkeyby Test Network, with the files being served via IPFS and can be accessed here.
All details regarding this can be found here. 

## 3. Interaction

The page should be re-loaded everytime the account is changed in Metamask to ensure that the previous account is not picked for the transaction

## 4. Implementation

- There are two possible states for a bounty -> `BountyStage.Open` and `BountyStage.Closed` 

- A bounty is created by calling by the `createBounty()` function (which creates the bounty in the Open state)

- Once a bounty is created in the Open state, it's parameters (the problem statement or reward amount) can not be changed/mutated

- A solution can be proposed for a bounty by calling the `createSolution()` function (which creates a solution for the bounty in the `accepted` is `false` state)

  This is only possible if the bounty is still in the `Open` stage

- The user can browse the created bounties and corresponding solutions by calling the `getBounty()` and `getSolution()` function

- The Bounty creator can then accept a proposed solution calling the `untrustedAcceptSolution()` [**ONLY BOUNTY CREATOR**] function which marks the Bounty Closed and solution accepted and calls the `untrustedCreditTransfer()` [**ONLY BOUNTY CREATOR**] function 

- Once a Bounty Hunter's solution is accepted he can

    - call the `untrustedCheckBountyWinnings()` function to check his bounty winnings credited to the escrow account

    - call the `untrustedWithdrawBountyReward()` function to withdraw/pull his bounty winnings into his account

- The Administrator or the Owner of the contract can pause or un-pause the contract features depending on any vulnerability using the `toggleContractActive()`[**ONLY OWNER**] function inherited from the _CircuitBreakerContract.sol_ contract

- When the contract is paused `stopped` bool is `true`, the user will only be able to withdraw any bounty winnings and browse

## 5. Tests

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
Case: Call `untrustedCheckBountyWinnings()` to check the available credit to be pulled. Check his initial balance. Call `untrustedWithdrawBountyReward()` to wihtdraw the credit and check his final balance  
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

## 6. Design Pattern Desicions

For all the design pattern desicions, please see [design pattern desicions](./design_pattern_desicions.md)

## 7. Avoiding Common Attacks

For the steps taken to avoid known common attacks, please see [avoiding common attacks](./avoiding_common_attacks.md)

## 8. Library/Contracts Imported

- The OpenZeppelin library for writing secure smart contracts was used.  
- The _PullPayment.sol_ contract was imported into _BountyContract.sol_ 
- _BountyContract.sol_ inherits from _PullPayment.sol_ 
- _PullPayment.sol_ imports _Escrow.sol_ 
- _PullPayment.sol_ exposes functions to deposit a credit into an Escrow contract and allows the payee to withdraw/pull the credit from the Escrow contract


## 9. Rinkeby Test Network and IPFS

Any application can take advantage of the bounties network registry, which is currently deployed on the Rinkeby network at `0xf209d2b723b6417cbf04c07e733bee776105a073`. The `BountiesNetwork.eth` name will also resolve to the BountyContract contract.

All deployed addresses are available in the file [deployed addresses](./deployed_addresses.txt)

