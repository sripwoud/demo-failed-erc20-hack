// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Scam3 is ERC20 {
    constructor() ERC20("Baby Usdc", "BBUSDC") {}


    // does not compile either, can't override a nonpayable function by payable
//    function transfer(address to, uint256 amount) public payable override returns (bool) {
    //        address recipient = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    //        payable(recipient).transfer(msg.value);
    //        return true;
    //    }
}
