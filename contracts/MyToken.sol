pragma solidity ^0.6.0;

/**
 * The MyToken contract does this and that...
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract MyToken is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) public ERC20Detailed("StarDucks Cappucino", "CAPPU", 18) {
        _mint(msg.sender, initialSupply);
    }
}

