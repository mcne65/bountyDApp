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

Ethereum smart contracts can trivially facilitate transactions of resources (or tokens) between individuals or groups, but service transactions are more complex. Requesting individuals (issuers) must first approve the work they're receiving before paying out funds, meaning bounty hunters must have trust that the issuer will pay them in the spirit of the original contract.

The _StandardBounties.sol_ contract facilitates transactions on qualitative data (often representing artifacts of completion of some service), allowing bounty issuers to systematically approve the work they receive.

## 2. Setup

## 3. Interaction

## 4. Implementation

A bounty can be used to pay amounts of ETH or a given token, based on the successful completion of the given task. The contract aims to reduce the necessary trust in the issuer by forcing them to deposit sufficient Ether (or tokens) to pay out the bounty at least once.

- A bounty begins by being issued, either through the `issueBounty()` function (which issues the bounty into draft stage), or `issueAndActivateBounty()`, which issues the bounty into the active stage

- In the `Draft` state, all bounty details can still be mutated.

  In this state, the various functions which can be called are:
    - `contribute()` [**ANYONE**]: contributes ETH (or tokens) to the bounty
    - `activateBounty()` [**ONLY ISSUER**]: This will activate the bounty
    - `killBounty()` [**ONLY ISSUER**]: This will kill the bounty

  As well as several functions to alter the bounty details:
    - `changeBountyDeadline()` [**ONLY ISSUER**]
    - `changeBountyData()` [**ONLY ISSUER**]
    - `changeBountyFulfillmentAmount()` [**ONLY ISSUER**]
    - `changeBountyArbiter()` [**ONLY ISSUER**]
    - `extendDeadline()` [**ONLY ISSUER**]
    - `transferIssuer()` [**ONLY ISSUER**]
    - `increasePayout()` [**ONLY ISSUER**]

- A bounty transitions to the `Active` state when the issuer calls `activateBounty()`, or if it was initially issued and activated.

  This is only possible if
  - the bounty hasn't expired (isn't past its deadline)
  - the bounty has sufficient funds to pay out at least once

  Once a bounty is `Active`, bounty hunters can submit fulfillments for it, and the bounty issuer can approve fulfillments to pay out the rewards.

  In this state, the various functions which can be called are:
    - `contribute()` [**ANYONE**]: contributes ETH (or tokens) to the bounty
    - `fulfillBounty()` [**ANYONE BUT ISSUER OR ARBITER**]:
    - `updateFulfillment()` [**ONLY FULFILLER**]
    - `acceptFulfillment()` [**ONLY ISSUER OR ARBITER**]:
    - `increasePayout()` [**ONLY ISSUER**]:
    - `transferIssuer()` [**ONLY ISSUER**]
    - `extendDeadline()` [**ONLY ISSUER**]
    - `killBounty()` [**ONLY ISSUER**]:

- A bounty transitions to the `Dead` state when the issuer calls `killBounty()`, which drains the bounty of its remaining balance.

  In this state, the only functions which can be called are:
  - `extendDeadline()` [**ONLY ISSUER**]
  - `activateBounty()` [**ONLY ISSUER**]

## 5. Tests

## 6. Design Pattern Desicions

For all the design pattern desicions, please see [design pattern desicions](./design_pattern_desicions.md)

## 7. Avoiding Common Attacks

For the steps taken to avoid known common attacks, please see [avoiding common attacks](./avoiding_common_attacks.md)

## 8. Library/Contracts Imported

## 9. How to access

Any application can take advantage of the bounties network registry, which is currently deployed on the Rinkeby network at `0xf209d2b723b6417cbf04c07e733bee776105a073`. The `BountiesNetwork.eth` name will also resolve to the BountyContract contract.

All deployed addresses are available in the file [deployed addresses](./deployed_addresses.txt)

