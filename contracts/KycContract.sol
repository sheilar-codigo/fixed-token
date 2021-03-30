pragma solidity ^0.6.0;

/**
 * The KycContract contract does this and that...
 */

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable {
  
  mapping (address => bool) allowed;


  function setKycCompleted (address _addr) public onlyOwner {
  	allowed[_addr] = true;
  }
  
  function setKycRevoked (address _addr) public onlyOwner {
  	allowed[_addr] = true;
  }
  
  function isKycCompleted (address _addr) public view returns(bool) {
  	return allowed[_addr];
  }
}

