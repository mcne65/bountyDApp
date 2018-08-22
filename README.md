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
9. [How to access](#9-how-to-access)

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

## 3. Interaction

The page should be re-loaded everytime the account is changed in Metamask to ensure that the previous account is not picked for the transaction

## 4. Implementation

- There are two possible states for a bounty -> `BountyStage.Open` and `BountyStage.Closed` 

- A bounty is created by calling by the `createBounty()` function (which creates the bounty in the Open state)

- Once a bounty is created in the Open state, it's parameters (the problem statement or reward amount) can not be changed/mutated

- A solution can be proposed for a bounty by calling the `createSolution()` function (which creates a solution for the bounty in the `accepted` is `false` state)

  This is only possible if the bounty is still in the `Open` stage

- The Bounty creator can then accept a proposed solution calling the following function to perform the following acts

    - `markSolutionAccepted()` [**ONLY BOUNTY CREATOR**] 
    - `creditTransfer()` [**ONLY BOUNTY CREATOR**]
    - `markBountyClosed()` [**ONLY BOUNTY CREATOR**] 

- Once a Bounty Hunter's solution is accepted he can

    - call the `checkBountyWinnings()` function to check his bounty winnings credited to the escrow account

    - call the `withdrawBountyReward()` function to withdraw his bounty winnings into his account

- The Administrator or the Owner of the contract can pause or un-pause the contract features depending on any vulnerability using the `toggleContractActive()`[**ONLY OWNER**] function inherited from _CircuitBreakerContract.sol_ contract


## 5. Tests

To run the tests, run the following command

``` truffle test ```

### CircuitBreakerContract.sol

#### 1. should return true that user is admin

#### 2. should return false that user is not admin

#### 3. should return false that contract is not stopped

#### 4. should return true that the contract is stopped

#### 5. should revert as the contract active state is not toggled by an admin

### BountyContract.sol

#### 1. should create a bounty correctly

#### 2. should create a solution correctly

#### 3. should mark solution accepted and bounty closed when solution accepted for an Open bounty

#### 4. should credit bounty reward to bounty hunter when solution is accepted

#### 5. should withdraw the bounty hunter's winnings from escrow to his address

#### 6. should revert when bounty contract with reward 0 is created

#### 7. should revert when bounty reward of 0 has to be credited

#### 8. should revert when bounty reward of 0 has to be withdrawn

## 6. Design Pattern Desicions

For all the design pattern desicions, please see [design pattern desicions](./design_pattern_desicions.md)

## 7. Avoiding Common Attacks

For the steps taken to avoid known common attacks, please see [avoiding common attacks](./avoiding_common_attacks.md)

## 8. Library/Contracts Imported

The following packages were made use of:

- 

## 9. How to access

Any application can take advantage of the bounties network registry, which is currently deployed on the Rinkeby network at `0xf209d2b723b6417cbf04c07e733bee776105a073`. The `BountiesNetwork.eth` name will also resolve to the BountyContract contract.

All deployed addresses are available in the file [deployed addresses](./deployed_addresses.txt)

