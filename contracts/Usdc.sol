// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "hardhat/console.sol";

contract Usdc is ERC20PresetFixedSupply {
    constructor() ERC20PresetFixedSupply("Usd Coin", "USDC", 1000, msg.sender) {}

    // when hit with delegatecall from Scam contract, in this function
    // we will have here msg.sender == owner (and not msg.sender = address(contract)
    // function approve() {}
}
