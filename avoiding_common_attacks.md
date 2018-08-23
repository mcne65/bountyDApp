# Avoiding Common Attacks

1. [Race Conditions](#1-race-conditions)
2. [Integer Overflow and Underflow](#2-integer-overflow-and-underflow)
3. [Underflow in depth: Storage manipulation](#3-underflow-in-depth)
4. [DoS with (Unexpected) revert](#4-DoS-with-revert)
5. [DoS with Block gas limit](#5-DoS-with-block-gas-limit)

Avoiding Common Attacks for BountyDApp

## 1. Race Conditions
### 1.1 Reentrancy
### 1.2 Cross-function Race conditions     
### 1.3 Pitfalls in Race condition solutions 

- External functions are called only after all the internal work is complete as can be seen in the function `untrustedAcceptSolution()`
- All functions that call external functions have been marked with the _untrusted_ suffix such as 
    - `untrustedCreditTransfer()`
    - `untrustedWithdrawBountyReward()`
    - `untrustedCheckBountyWinnings()`
- All functions have been decorated with the appropriate modifiers to enforce checks prior to every function execution, for example: [**solutionNotAccepted**] and [**onlyOpenBounty**] against `untrustedAcceptSolution()` 
- The functions inherited from the _PullPayment.sol_ contract: `asyncTransfer()`, `withdrawPayments()` and `payments()` also follow the same pattern of completeing all internal work first, followed by any external function calls
- All functions have been assigned appropriate visibility - external, public, internal, private

## 2. Integer Overflow and Underflow

- The bountyId (index of the Bounty struct) and solutionId (index of the Solution struct) are uint32 integers and are protected against Integer overflow via the modifiers -> [**bountiesCountDoesNotOverflow**] and [**solutionsCountDoesNotOverflow**]

- The inherited _PullPayment.sol_ contract from the Open Zeppelin package uses the _Esrow.sol_ contract which in turn uses the _SafeMath.sol_ contract for all calculations which provides Integer Underflow and overflow resilient functions

## 3. Underflow in Depth: Storage manipulation

- Instead of a dynamic array, a container data structure i.e. a Struct is used and stored in a mapping against an index
- The modifiers [**validateBountiesIndex**] and [**validateSolutionsIndex**] are used to protect against this

## 4. DoS with (Unexpected) revert 

- A pull payment system is used. The ETH is credited to the payee in an escrow contract and pulled/withdrawn by the payee when appropriate  

- In the case of an attack, when the contract is Stopped in an emergency, there is an option for the Admin/Owner of the contract to withdraw all the funds in the escrow to the corresponding payee. This action **does not** occur in a loop in the contract by iterating through the objects, so there is **no danger** of an (Unexpected revert). An individual call is made to withdraw funds for each user by index mapping.

## 5. DoS with Block gas limit

- There exists no loop in the contract. Each operation is performed on an individual object accessed by index mapping  

- Each transaction is an individual function call  

- the _Withdraw all to payee_ admin feature processes each withdrawal in an individual tranasction, can resume from any point it stopped and can only happen when the contract is paused/stopped and no other action can take place simultaneously