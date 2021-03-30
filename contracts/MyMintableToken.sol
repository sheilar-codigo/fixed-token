pragma solidity ^0.6.0;

/**
 * The MyMintableToken contract does this and that...
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "./ERC20Mintable.sol";

contract MyMintableToken is ERC20, ERC20Detailed, ERC20Mintable {
    constructor() public ERC20Detailed("Sheilar Zune", "SLZ", 18) {
    }
}

