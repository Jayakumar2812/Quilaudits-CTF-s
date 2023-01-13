import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("RoadClosed", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploymentState() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attacker] = await ethers.getSigners();

    const RoadClosed = await ethers.getContractFactory("RoadClosed");
    const roadClosed = await RoadClosed.deploy();

    return { roadClosed,owner, attacker };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const {roadClosed,attacker} = await loadFixture(deploymentState);
      
      const AttackerContract = await ethers.getContractFactory("AttackerContract_RoadBlock");
      const attackerContract = await AttackerContract.deploy(roadClosed.address);
      
      expect(await roadClosed.isHacked() ).to.equal(true)
    });

  })
})
