import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Confidential", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploymentState() {

    // Contracts are deployed using the first signer/account by default
    const [owner, attacker] = await ethers.getSigners();

    const Confidential = await ethers.getContractFactory("Confidential");
    const confidential = await Confidential.deploy();

    return { confidential,owner, attacker };
  }

  describe("Deployment", function () {
    it("Should return true for checkthehash", async function () {
      const {confidential} = await loadFixture(deploymentState);
      
      const key1 = await ethers.provider.getStorageAt(confidential.address,4);
      const key2 = await ethers.provider.getStorageAt(confidential.address,9);

      const hash = await confidential.hash(key1,key2);

      const checkthehash_tx = await confidential.checkthehash(hash);
      await expect(checkthehash_tx).to.equal(true)
    });

  })
})
