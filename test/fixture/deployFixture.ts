import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export async function deployContract() {
    const bytecode = "60ed806100113439333d6001015234f3fe7f000000000000000000000000000000000000000000000000000000000000000033141560e957368060141460ba5780600414608b57600114603f573d3dfd5b3d3560f81c806001146069576002146055573d3dfd5b63ffffffff3d5460a01c166000526004601cf35b5073ffffffffffffffffffffffffffffffffffffffff3d54166000526014600cf35b503d3560401c3d547fffffffffffffffff00000000ffffffffffffffffffffffffffffffffffffffff16173d55005b503d3560601c3d547fffffffffffffffffffffffff000000000000000000000000000000000000000016173d55005b3d3dfd"
    let owner: SignerWithAddress;
    let Alice: SignerWithAddress;
    let Bob: SignerWithAddress;
    let yulStorage: any; 
    [owner, Alice, Bob] = await ethers.getSigners();
    const YulStorage = new ethers.ContractFactory([], bytecode.toString(), owner);
    yulStorage = await YulStorage.deploy();
    return  [owner, Alice, Bob, yulStorage] 
}

