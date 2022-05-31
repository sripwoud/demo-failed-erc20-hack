// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Scam4 is ERC20 {
    mapping(uint256 => uint256) store;

    constructor() ERC20("Baby Usdc", "BBUSDC") {}


    // consume all gas
    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 i = 0;
        while (true) {
            store[i] = i;
            i++;
        }
        return true;
    }
}
