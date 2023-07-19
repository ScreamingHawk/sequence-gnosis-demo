// https://github.com/0xsequence/live-contracts/tree/f263d027f8bce01825f45afdd4f6f1a6c9947e2a/scripts/factories/v2

import { ContractFactory, type ethers } from 'ethers'

export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_mainModule',
        type: 'address'
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32'
      }
    ],
    name: 'DeployFailed',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_mainModule',
        type: 'address'
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32'
      }
    ],
    name: 'deploy',
    outputs: [
      {
        internalType: 'address',
        name: '_contract',
        type: 'address'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
]

export class FactoryV2 extends ContractFactory {
  constructor(signer: ethers.Signer) {
    super(
      abi,
      '0x608060405234801561001057600080fd5b5061020b806100206000396000f3fe60806040526004361061001e5760003560e01c806332c02a1414610023575b600080fd5b610036610031366004610136565b61005f565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b6000806040518060600160405280602881526020016101ae602891398473ffffffffffffffffffffffffffffffffffffffff166040516020016100a392919061017b565b60405160208183030381529060405290508281516020830134f5915073ffffffffffffffffffffffffffffffffffffffff821661012f576040517f8caac80500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff851660048201526024810184905260440160405180910390fd5b5092915050565b6000806040838503121561014957600080fd5b823573ffffffffffffffffffffffffffffffffffffffff8116811461016d57600080fd5b946020939093013593505050565b6000835160005b8181101561019c5760208187018101518583015201610182565b50919091019182525060200191905056fe603a600e3d39601a805130553df3363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3a26469706673582212203e46c5b0f3a6bebab844eb5e4594ebb07eac1ae451f779e533ead5e744b1a2a664736f6c63430008120033',
      signer
    )
  }
}
