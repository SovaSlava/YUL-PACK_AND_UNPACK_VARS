import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployContract } from "./fixture/deployFixture"

describe("YUL. Pack&Unpack variables in one storage slot",  function () {

  // bytecode: solc --strict-assembly --optimize --optimize-runs 1000 --bin contracts/contract.yul
  let owner: SignerWithAddress;
  let Alice: SignerWithAddress;
  let Bob: SignerWithAddress;
  let yulStorage: any; 
  let timestamp:string;
  before(async() => {
    [owner, Alice, Bob, yulStorage] =  await loadFixture(deployContract);
  })

  it("Owner store Bob address", async () => {
    await owner.sendTransaction({
      to: yulStorage.address,
      data: Bob.address,
    })

    expect(ethers.utils.getAddress(await ethers.provider.send("eth_call", [
      {
        to: yulStorage.address,
        data: "0x01",
        from: owner.address,
      },
      "latest",
    ]))).to.equal(Bob.address) 
  })

  it("Revert, if Alice try store Bob address", async () => {
    await expect(Alice.sendTransaction({
      to: yulStorage.address,
      data: Bob.address,
    })).reverted;
  })

  it("Owner store timestamp", async () => {
    timestamp = ethers.utils.hexlify( Math.round(+new Date()/1000))
    await owner.sendTransaction({
      to: yulStorage.address,
      data: timestamp,
    })

    expect(await ethers.provider.send("eth_call", [
      {
        to: yulStorage.address,
        data: "0x02",
        from: owner.address,
      },
      "latest",
    ])).to.equal(timestamp) 
  })

  it("All data stored in one storage slot", async () => {
    expect( await ethers.provider.getStorageAt(yulStorage.address, "0x00"))
      .to.equal("0x0000000000000000" + timestamp.substring(2) + Bob.address.substring(2).toLowerCase())
  })

 

});

