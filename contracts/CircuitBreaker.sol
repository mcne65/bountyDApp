pragma solidity ^0.4.24;

contract CircuitBreakerContract {
    bool private stopped = false;
    address private owner;

    modifier isAdmin() {
        require(msg.sender == owner, "Sender is not Owner");
        _;
    }

    function toggleContractActive() public isAdmin {
        stopped = !stopped;
    }

    modifier stopInEmergency { if (!stopped) _; }
    modifier onlyInEmergency { if (stopped) _; }

    function deposit() stopInEmergency public {
        // some code
    }

    function withdraw() onlyInEmergency public {
        // some code
    }
}