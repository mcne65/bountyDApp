# Design Pattern Desicions

1. [Checks-Effects-Interactions Pattern](#1-Checkers-Effects-Interactions-Pattern)
2. [Circuit Breaker Pattern](#2-Circuit-Breaker-Pattern)
3. [Mapped Struct with Index](#3-mapped-struct-with-index)

Design Pattern Desicions for BountyDApp

## 1. Checks-Effects-Interactions Pattern

- Modifiers are used to perform appropriate checks and validate the input.
- If all checks passed, then effects to the state variables of the current contract are made
- Interactions with other contracts are the last step in the function
- all logic that changes state variables happen before ether is sent out of the contract (or any external call)

## 2. Circuit Breaker Pattern

- When any bugs or vulnerabilities are discovered, the administrator/owner of the contract can pause/stop the contract. 
- Most of the actions of the contract are suspended and the only available action now is withdrawal/pull of the funds
- The administrator/owner can unpause/start the contract again once the threat has been addressed

## 3. Mapped Struct with Index design pattern

- Each object can be accessed by lookup via it's unique index key 
- No need for iterating through an array for an object
- Enclose arrays, mappings and structs within each "record"
- It maintains the order of declaration
- Gives a counts of the records