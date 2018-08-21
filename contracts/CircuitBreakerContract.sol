pragma solidity ^0.4.24;

contract CircuitBreakerContract {

  bool private stopped = false;
  address private admin;

  constructor () public {
    admin = msg.sender;
  }

  function isUserAdmin() public view returns(bool) {
    return msg.sender == admin;
  }
  
  modifier isAdmin() {
    require(isUserAdmin(), "Sender is not Admin");
    _;
  }

  function toggleContractActive() public isAdmin {
    stopped = !stopped;
  }

  modifier stopInEmergency {if (!stopped) _;}
  modifier onlyInEmergency {if (stopped) _;}

  function isStopped() public view returns (bool) {
    return stopped;
  }

}