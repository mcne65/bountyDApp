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
9. [Rinkeby Test Network, IPFS and ENS](#9-rinkeby-test-network,-ipfs-and-ens)

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

The DApp is also deployed on the Rinkeyby Test Network, and static assets hosted on IPFS and can be accessed via ENS.
All details regarding this can be found here [Rinkeby Test Network, IPFS and ENS](#9-rinkeby-test-network,-ipfs-and-ens). 

## 3. Interaction

- The page should be re-loaded everytime the account is changed in Metamask to ensure that the previous account is not picked for the transaction

- The state change will reflect once the transaction complete notification is sent by Metamask

## 4. Implementation

- There are two possible states for a bounty -> `BountyStage.Open` and `BountyStage.Closed` 

- A bounty is created by calling by the `createBounty()` function (which creates the bounty in the Open state)

- Once a bounty is created in the Open state, it's parameters (the problem statement or reward amount) can not be changed/mutated

- A solution can be proposed for a bounty by calling the `createSolution()` function (which creates a solution for the bounty in the `accepted` is `false` state)

  This is only possible if the bounty is still in the `Open` stage

- The user can browse the created bounties and corresponding solutions by calling the `getBounty()` and `getSolution()` function

- The Bounty creator can then accept a proposed solution calling the `untrustedAcceptSolution()` [**ONLY BOUNTY CREATOR**] function which marks the Bounty Closed and sets the solution accepted and calls the `untrustedCreditTransfer()` [**ONLY BOUNTY CREATOR**] function to transfer the credit to the payee, held in the escrow account

- Once a Bounty Hunter's solution is accepted he can

    - call the `untrustedCheckBountyWinnings()` function to check his bounty winnings credited to the escrow account

    - call the `untrustedWithdrawBountyReward()` function to withdraw/pull his bounty winnings into his account

- The Administrator or the Owner of the contract can pause or un-pause the contract features depending on any vulnerability using the `toggleContractActive()`[**ONLY OWNER**] function inherited from the _CircuitBreakerContract.sol_ contract

- When the contract is paused `stopped` bool is `true`, the user will only be able to withdraw any bounty winnings and browse

## 5. Tests

To run the tests, run the following command

``` truffle test ```

The Test cases and their explanations can be found here [tests](./test.md)

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


## 9. Rinkeby Test Network, IPFS and ENS

 - Any application can take advantage of the Bounty Contract, which is currently deployed on the Rinkeby network at `0x402f40fdf6d210578041f50bdc03be94c33b0af9`   
 All deployed addresses are available in the file [deployed addresses](./deployed_addresses.txt)

 - An _INFURA_ hosted Ethereum node is used to connect and deploy to the Rinkeby Testnet. The configuration can be seen in the _truffle.config_ file

 - The Admin/Owner address used to deploy the contract to the Rinkeby TestNet is `0x4dE2481FD30c938C5E9cFBCFe6D243f4946bf6BD`
 The private key for importing this account for testing the features of the App can be provided on request
 
- The static assets are deployed to the IPFS name hash `QmXmyJdaBYfqeBrJRmKtkxPFiJ8xrUSLaxegvhCT1WqvW9`
and can be accessed at [https://gateway.ipfs.io/ipns/hashname](https://gateway.ipfs.io/ipns/QmXmyJdaBYfqeBrJRmKtkxPFiJ8xrUSLaxegvhCT1WqvW9/)

- Since the IPFS network is smaller and leads to longer load times, the App is also hosted on Github Pages and can be accessed at http://sandhyachandramohan.in/bountyDApp/#

- The ENS name `bountyDApp.test` resolves to the _BountyContract.sol_ address `0x402f40fdf6d210578041f50bdc03be94c33b0af9` via the `ensutils-rinkeby.js` script pointing to the Rinkeby network contracts:  
    ```
    ens contract address: 0xe7410170f87102df0055eb195163a03b7f2bff4a (line 220)
    publicResolver address: 0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc (line 1314)
    ```
    This can be verified by interacting with the public resolver contract at `0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc` on [https://rinkeby.etherscan.io](https://rinkeby.etherscan.io/address/0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc#readContract)

    In the Geth console:
    ```
    > namehash("bountyDApp.test")
    "0x6392e5a64fd88c1daad350ddb726990eabf8ba54f74259a46bd2005e8d5b3c55"
    ```
    Calling the `addr()` function with `node(bytes32)` input value as the namehash of "bountyDApp.test" which is `0x6392e5a64fd88c1daad350ddb726990eabf8ba54f74259a46bd2005e8d5b3c55`. The address returned is `0x402f40fdf6d210578041f50bdc03be94c33b0af9` which is the _BountyContract.sol_ address


