pragma solidity ^0.4.24;

contract CircuitBreakerContract {

  bool private stopped = false;
  address private admin;

  constructor () public {
    admin = msg.sender;
  }

  /**
   * @dev Check if the current user is Admin
   */
  function isUserAdmin() public view returns(bool) {
    return msg.sender == admin;
  }
  
  modifier isAdmin() {
    require(isUserAdmin(), "Sender is not Admin");
    _;
  }

  /**
   * @dev Toggle the contract state as active or in-active
   */
  function toggleContractActive() public isAdmin {
    stopped = !stopped;
  }

  modifier stopInEmergency {if (!stopped) _;}
  modifier onlyInEmergency {if (stopped) _;}

  /**
   * @dev Check if the contract state is Stopped
   */
  function isStopped() public view returns (bool) {
    return stopped;
  }

}