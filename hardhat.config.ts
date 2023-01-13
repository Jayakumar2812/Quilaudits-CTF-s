import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("hardhat-tracer");

const config: HardhatUserConfig = {
  solidity: "0.8.7",
};

export default config;
