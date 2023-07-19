// https://github.com/0xsequence/live-contracts/tree/f263d027f8bce01825f45afdd4f6f1a6c9947e2a/scripts/factories/v2

import { ContractFactory, type ethers } from 'ethers'

export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_factory',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_mainModuleUpgradable',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_space',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_provided',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_current',
        type: 'uint256'
      }
    ],
    name: 'BadNonce',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_code',
        type: 'bytes'
      }
    ],
    name: 'CreateFailed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'EmptySignature',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      }
    ],
    name: 'HookAlreadyExists',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      }
    ],
    name: 'HookDoesNotExist',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ImageHashIsZero',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_implementation',
        type: 'address'
      }
    ],
    name: 'InvalidImplementation',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_addr',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'InvalidNestedSignature',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      },
      {
        internalType: 'bytes32',
        name: '_s',
        type: 'bytes32'
      }
    ],
    name: 'InvalidSValue',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'InvalidSignature',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_flag',
        type: 'uint256'
      }
    ],
    name: 'InvalidSignatureFlag',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'InvalidSignatureLength',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes1',
        name: '_type',
        type: 'bytes1'
      }
    ],
    name: 'InvalidSignatureType',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: '_v',
        type: 'uint256'
      }
    ],
    name: 'InvalidVValue',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'threshold',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_weight',
        type: 'uint256'
      }
    ],
    name: 'LowWeightChainedSignature',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_requested',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_available',
        type: 'uint256'
      }
    ],
    name: 'NotEnoughGas',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OnlyDelegatecall',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_sender',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_self',
        type: 'address'
      }
    ],
    name: 'OnlySelfAuth',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'SignerIsAddress0',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: '_type',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: '_recoverMode',
        type: 'bool'
      }
    ],
    name: 'UnsupportedSignatureType',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_current',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_prev',
        type: 'uint256'
      }
    ],
    name: 'WrongChainedCheckpointOrder',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      }
    ],
    name: 'CreatedContract',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_implementation',
        type: 'address'
      }
    ],
    name: 'DefinedHook',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32'
      }
    ],
    name: 'IPFSRootUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'newImageHash',
        type: 'bytes32'
      }
    ],
    name: 'ImageHashUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'ImplementationUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_space',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_newNonce',
        type: 'uint256'
      }
    ],
    name: 'NonceChange',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_imageHash',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_expiration',
        type: 'uint256'
      }
    ],
    name: 'SetExtraImageHash',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_tx',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      }
    ],
    name: 'TxExecuted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: '_tx',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_index',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_reason',
        type: 'bytes'
      }
    ],
    name: 'TxFailed',
    type: 'event'
  },
  {
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    inputs: [],
    name: 'FACTORY',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'INIT_CODE_HASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SET_IMAGE_HASH_TYPE_HASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'UPGRADEABLE_IMPLEMENTATION',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      },
      {
        internalType: 'address',
        name: '_implementation',
        type: 'address'
      }
    ],
    name: 'addHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32[]',
        name: '_imageHashes',
        type: 'bytes32[]'
      }
    ],
    name: 'clearExtraImageHashes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_code',
        type: 'bytes'
      }
    ],
    name: 'createContract',
    outputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'delegateCall',
            type: 'bool'
          },
          {
            internalType: 'bool',
            name: 'revertOnError',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'gasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'target',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct IModuleCalls.Transaction[]',
        name: '_txs',
        type: 'tuple[]'
      },
      {
        internalType: 'uint256',
        name: '_nonce',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_imageHash',
        type: 'bytes32'
      }
    ],
    name: 'extraImageHash',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ipfsRoot',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ipfsRootBytes32',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: '_signatures',
        type: 'bytes'
      }
    ],
    name: 'isValidSignature',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: '_signatures',
        type: 'bytes'
      }
    ],
    name: 'isValidSignature',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes'
      }
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      }
    ],
    name: 'readHook',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_space',
        type: 'uint256'
      }
    ],
    name: 'readNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_signature',
        type: 'bytes4'
      }
    ],
    name: 'removeHook',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'delegateCall',
            type: 'bool'
          },
          {
            internalType: 'bool',
            name: 'revertOnError',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'gasLimit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'target',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
          }
        ],
        internalType: 'struct IModuleCalls.Transaction[]',
        name: '_txs',
        type: 'tuple[]'
      }
    ],
    name: 'selfExecute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_imageHash',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: '_expiration',
        type: 'uint256'
      }
    ],
    name: 'setExtraImageHash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_digest',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes'
      }
    ],
    name: 'signatureRecovery',
    outputs: [
      {
        internalType: 'uint256',
        name: 'threshold',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256'
      },
      {
        internalType: 'bytes32',
        name: 'imageHash',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: 'subdigest',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: 'checkpoint',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_interfaceID',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_hash',
        type: 'bytes32'
      }
    ],
    name: 'updateIPFSRoot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_imageHash',
        type: 'bytes32'
      }
    ],
    name: 'updateImageHash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_imageHash',
        type: 'bytes32'
      },
      {
        internalType: 'bytes32',
        name: '_ipfsRoot',
        type: 'bytes32'
      }
    ],
    name: 'updateImageHashAndIPFS',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_implementation',
        type: 'address'
      }
    ],
    name: 'updateImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
]

export class MainModuleV2 extends ContractFactory {
  constructor(signer: ethers.Signer) {
    super(
      abi,
      '0x6101006040523480156200001257600080fd5b5060405162003a1838038062003a188339810160408190526200003591620000c2565b30608052604080516060810190915260288082528391839160009190620039f060208301396040516200006e91903090602001620000fa565b60408051601f19818403018152919052805160209091012060a052506001600160a01b0391821660c0521660e052506200012e9050565b80516001600160a01b0381168114620000bd57600080fd5b919050565b60008060408385031215620000d657600080fd5b620000e183620000a5565b9150620000f160208401620000a5565b90509250929050565b6000835160005b818110156200011d576020818701810151858301520162000101565b509190910191825250602001919050565b60805160a05160c05160e0516138736200017d600039600081816105b40152611496015260008181610484015261251b015260008181610422015261254c01526000610c5001526138736000f3fe6080604052600436106101bb5760003560e01c80637a9a1628116100ec578063a4ab5f9f1161008a578063bc197c8111610064578063bc197c81146106a0578063c71f1f96146106e8578063d0748f71146106fd578063f23a6e611461071d576101c2565b8063a4ab5f9f1461064b578063affed0e01461066b578063b93ea7ad14610680576101c2565b80638c3f5563116100c65780638c3f5563146105d65780638efa6441146105f657806390042baf14610618578063a38cef191461062b576101c2565b80637a9a16281461053a578063853c50681461055a578063888eeec6146105a2576101c2565b8063257671f5116101595780634598154f116101335780634598154f146104a65780634fcf3eca146104c657806357c56d6b146104e657806361c2926c1461051a576101c2565b8063257671f51461041057806329561426146104525780632dd3100014610472576101c2565b8063150b7a0211610195578063150b7a02146103155780631626ba7e1461038b5780631a9b2337146103ab57806320c13b0b146103f0576101c2565b806301ffc9a7146102a0578063025b22bc146102d5578063038dbaac146102f5576101c2565b366101c257005b6004361061029e5760006101f96000357fffffffff0000000000000000000000000000000000000000000000000000000016610763565b905073ffffffffffffffffffffffffffffffffffffffff81161561029c576000808273ffffffffffffffffffffffffffffffffffffffff16600036604051610242929190612cd1565b600060405180830381855af49150503d806000811461027d576040519150601f19603f3d011682016040523d82523d6000602084013e610282565b606091505b50915091508161029457805160208201fd5b805160208201f35b505b005b3480156102ac57600080fd5b506102c06102bb366004612d0f565b6107b7565b60405190151581526020015b60405180910390f35b3480156102e157600080fd5b5061029e6102f0366004612d55565b6107c2565b34801561030157600080fd5b5061029e610310366004612dbc565b610814565b34801561032157600080fd5b5061035a610330366004612e40565b7f150b7a020000000000000000000000000000000000000000000000000000000095945050505050565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016102cc565b34801561039757600080fd5b5061035a6103a6366004612eaf565b61091f565b3480156103b757600080fd5b506103cb6103c6366004612d0f565b61096c565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016102cc565b3480156103fc57600080fd5b5061035a61040b366004612efb565b610977565b34801561041c57600080fd5b506104447f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016102cc565b34801561045e57600080fd5b5061029e61046d366004612f67565b6109dc565b34801561047e57600080fd5b506103cb7f000000000000000000000000000000000000000000000000000000000000000081565b3480156104b257600080fd5b5061029e6104c1366004612f80565b610a26565b3480156104d257600080fd5b5061029e6104e1366004612d0f565b610aeb565b3480156104f257600080fd5b506104447f8713a7c4465f6fbee2b6e9d6646d1d9f83fec929edfc4baf661f3c865bdd04d181565b34801561052657600080fd5b5061029e610535366004612dbc565b610bb3565b34801561054657600080fd5b5061029e610555366004612fa2565b610c39565b34801561056657600080fd5b5061057a610575366004612eaf565b610d3e565b604080519586526020860194909452928401919091526060830152608082015260a0016102cc565b3480156105ae57600080fd5b506103cb7f000000000000000000000000000000000000000000000000000000000000000081565b3480156105e257600080fd5b506104446105f1366004612f67565b610f06565b34801561060257600080fd5b5061060b610f32565b6040516102cc9190613079565b6103cb6106263660046130bb565b610fb3565b34801561063757600080fd5b5061029e610646366004612f67565b61109d565b34801561065757600080fd5b50610444610666366004612f67565b6110e7565b34801561067757600080fd5b506104446110f2565b34801561068c57600080fd5b5061029e61069b36600461318a565b611103565b3480156106ac57600080fd5b5061035a6106bb3660046131bf565b7fbc197c810000000000000000000000000000000000000000000000000000000098975050505050505050565b3480156106f457600080fd5b506104446111ce565b34801561070957600080fd5b5061029e610718366004612f80565b6111f8565b34801561072957600080fd5b5061035a61073836600461327a565b7ff23a6e61000000000000000000000000000000000000000000000000000000009695505050505050565b60006107b17fbe27a319efc8734e89e26ba4bc95f5c788584163b959f03fa04e2d7ab4b9a1207fffffffff00000000000000000000000000000000000000000000000000000000841661124b565b92915050565b60006107b1826112a9565b333014610808576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044015b60405180910390fd5b61081181611305565b50565b333014610855576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b8060005b81811015610919576000848483818110610875576108756132f2565b9050602002013590506108d5816000604080517f849e7bdc245db17e50b9f43086f1914d70eb4dab6dd89af4d541d53353ad97de602080830191909152818301859052825180830384018152606090920190925280519101208190555050565b807f804f6171d6008d9e16ee3aa0561fec328397f4ba2827a6605db388cfdefa3b0c600060405161090891815260200190565b60405180910390a250600101610859565b50505050565b60008061092d8585856113c0565b509050801561095f57507f1626ba7e000000000000000000000000000000000000000000000000000000009050610965565b50600090505b9392505050565b60006107b182610763565b60008061099c868660405161098d929190612cd1565b604051809103902085856113c0565b50905080156109ce57507f20c13b0b0000000000000000000000000000000000000000000000000000000090506109d4565b50600090505b949350505050565b333014610a1d576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b610811816113fe565b333014610a67576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b604080517f849e7bdc245db17e50b9f43086f1914d70eb4dab6dd89af4d541d53353ad97de602080830191909152818301859052825180830384018152606083019384905280519101208390559082905282907f804f6171d6008d9e16ee3aa0561fec328397f4ba2827a6605db388cfdefa3b0c9060800160405180910390a25050565b333014610b2c576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b6000610b3782610763565b73ffffffffffffffffffffffffffffffffffffffff1603610ba8576040517f1c3812cc0000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000821660048201526024016107ff565b6108118160006114ba565b333014610bf4576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b6000610c278383604051602001610c0c9291906134c9565b6040516020818303038152906040528051906020012061157a565b9050610c348184846115ff565b505050565b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000163003610ca8576040517f0a57d61d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610cb183611787565b600080610ce9858888604051602001610ccc93929190613511565b6040516020818303038152906040528051906020012085856113c0565b9150915081610d2a578084846040517f8f4a234f0000000000000000000000000000000000000000000000000000000081526004016107ff93929190613534565b610d358188886115ff565b50505050505050565b60008060008060008087876000818110610d5a57610d5a6132f2565b909101357fff00000000000000000000000000000000000000000000000000000000000000169150819050610db057610d928961157a565b9250610d9f838989611884565b92985090965094509150610efb9050565b7fff0000000000000000000000000000000000000000000000000000000000000081811601610def57610de28961157a565b9250610d9f8389896118d5565b7ffe000000000000000000000000000000000000000000000000000000000000007fff00000000000000000000000000000000000000000000000000000000000000821601610e4157610de289611901565b7ffd000000000000000000000000000000000000000000000000000000000000007fff00000000000000000000000000000000000000000000000000000000000000821601610ea557610e9589898961196e565b9550955095509550955050610efb565b6040517f6085cd820000000000000000000000000000000000000000000000000000000081527fff00000000000000000000000000000000000000000000000000000000000000821660048201526024016107ff565b939792965093509350565b60006107b17f8d0bf1fd623d628c741362c1289948e57b3e2905218c676d3e69abee36d6ae2e8361124b565b6060610f8f610f8a610f426111ce565b6040517f017012200000000000000000000000000000000000000000000000000000000060208201526024810191909152604401604051602081830303815290604052611aeb565b611d04565b604051602001610f9f919061354e565b604051602081830303815290604052905090565b6000333014610ff6576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b81516020830134f0905073ffffffffffffffffffffffffffffffffffffffff811661104f57816040517f0d2571910000000000000000000000000000000000000000000000000000000081526004016107ff9190613079565b60405173ffffffffffffffffffffffffffffffffffffffff821681527fa506ad4e7f05eceba62a023c3219e5bd98a615f4fa87e2afb08a2da5cf62bf0c9060200160405180910390a1919050565b3330146110de576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b61081181611d2d565b60006107b182611d86565b60006110fe6000610f06565b905090565b333014611144576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b600061114f83610763565b73ffffffffffffffffffffffffffffffffffffffff16146111c0576040517f5b4d6d6a0000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000831660048201526024016107ff565b6111ca82826114ba565b5050565b60006110fe7f0eecac93ced8722d209199364cda3bc33da3bc3a23daef6be49ebd780511d0335490565b333014611239576040517fe12588940000000000000000000000000000000000000000000000000000000081523360048201523060248201526044016107ff565b611242826113fe565b6111ca81611d2d565b600080838360405160200161126a929190918252602082015260400190565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152919052805160209091012054949350505050565b60007f2e74b92a000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316016112fc57506001919050565b6107b182611db2565b73ffffffffffffffffffffffffffffffffffffffff81163b61136b576040517f0c76093700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016107ff565b611373813055565b60405173ffffffffffffffffffffffffffffffffffffffff821681527f310ba5f1d2ed074b51e2eccd052a47ae9ab7c6b800d1fca3db3999d6a592ca03906020015b60405180910390a150565b60008060008060006113d3888888610d3e565b509650919450925090508282108015906113f157506113f181611e0e565b9450505050935093915050565b80611435576040517f4294d12700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61145e7fea7157fa25e3aa17d0ae2d5280fa4e24d421c61842aa85e45194e1145aa72bf8829055565b6040518181527f307ed6bd941ee9fc80f369c94af5fa11e25bab5102a6140191756c5474a30bfa9060200160405180910390a16108117f0000000000000000000000000000000000000000000000000000000000000000611305565b604080517fbe27a319efc8734e89e26ba4bc95f5c788584163b959f03fa04e2d7ab4b9a1206020808301919091527fffffffff000000000000000000000000000000000000000000000000000000008516828401819052835180840385018152606084018086528151919093012073ffffffffffffffffffffffffffffffffffffffff8616908190559152608082015290517f0d7fc113eaf016db4681a1ba86d083ce3e0961f321062a75ac2b0aeb33deeed19181900360a00190a15050565b6040517f190100000000000000000000000000000000000000000000000000000000000060208201524660228201527fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003060601b166042820152605681018290526000906076015b604051602081830303815290604052805190602001209050919050565b8060005b81811015611780573684848381811061161e5761161e6132f2565b90506020028101906116309190613593565b90506040810135805a10156116855782815a6040517f2bb3e3ba0000000000000000000000000000000000000000000000000000000081526004810193909352602483019190915260448201526064016107ff565b600061169460208401846135d1565b156116d3576116cc6116ac6080850160608601612d55565b83156116b857836116ba565b5a5b6116c760a08701876135ec565b611e19565b905061170e565b61170b6116e66080850160608601612d55565b608085013584156116f757846116f9565b5a5b61170660a08801886135ec565b611e34565b90505b801561175357877f5c4eeb02dabf8976016ab414d617f9a162936dcace3cdef8c69ef6e262ad5ae78560405161174691815260200190565b60405180910390a2611775565b61177561176660408501602086016135d1565b8986611770611e51565b611e70565b505050600101611603565b5050505050565b606081901c6bffffffffffffffffffffffff821660006117a683610f06565b90508181146117f2576040517f9b6514f40000000000000000000000000000000000000000000000000000000081526004810184905260248101839052604481018290526064016107ff565b604080517f8d0bf1fd623d628c741362c1289948e57b3e2905218c676d3e69abee36d6ae2e60208083019190915281830186905282518083038401815260609092019092528051910120600183019081905560408051858152602081018390527f1f180c27086c7a39ea2a7b25239d1ab92348f07ca7bb59d1438fcf527568f881910160405180910390a15050505050565b600080808061189f8761189a876006818b613651565b611ebe565b6000908152873560f01c6020818152604080842084526002909a013560e01c908190529890912090999198509695509350505050565b60008080806118f0876118eb876001818b613651565b611884565b935093509350935093509350935093565b6040517f190100000000000000000000000000000000000000000000000000000000000060208201526000602282018190527fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003060601b16604283015260568201839052906076016115e2565b6000808080806004600188013560e81c8261198983836136aa565b905061199b8b61057583868d8f613651565b939b50919950975095509350878710156119f3576119bb81848b8d613651565b89896040517fb006aba00000000000000000000000000000000000000000000000000000000081526004016107ff94939291906136bd565b8092505b88831015611add5760038301928a013560e81c9150611a1683836136aa565b90506000611a38611a2688612354565b8c8c8790869261057593929190613651565b939c50919a5098509091505088881015611a9057611a5882858c8e613651565b8a8a6040517fb006aba00000000000000000000000000000000000000000000000000000000081526004016107ff94939291906136bd565b848110611ad3576040517f37daf62b00000000000000000000000000000000000000000000000000000000815260048101829052602481018690526044016107ff565b93509150816119f7565b505050939792965093509350565b8051606090600381901b60006005600483010467ffffffffffffffff811115611b1657611b1661308c565b6040519080825280601f01601f191660200182016040528015611b40576020820181803683370190505b5090506000806000805b86811015611c5457888181518110611b6457611b646132f2565b01602001516008948501949390931b60f89390931c92909217915b60058410611c4c576040805180820190915260208082527f6162636465666768696a6b6c6d6e6f707172737475767778797a323334353637818301527ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb90950194601f85871c16908110611bf557611bf56132f2565b602001015160f81c60f81b858381518110611c1257611c126132f2565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600190910190611b7f565b600101611b4a565b508215611cf8576040518060400160405280602081526020017f6162636465666768696a6b6c6d6e6f707172737475767778797a3233343536378152508360050383901b601f1681518110611cab57611cab6132f2565b602001015160f81c60f81b848281518110611cc857611cc86132f2565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053505b50919695505050505050565b606081604051602001611d1791906136e4565b6040516020818303038152906040529050919050565b611d567f0eecac93ced8722d209199364cda3bc33da3bc3a23daef6be49ebd780511d033829055565b6040518181527f20d3ef1b5738a9f6d7beae515432206e7a8e2740ca6dcf46a952190ad01bcb51906020016113b5565b60006107b17f849e7bdc245db17e50b9f43086f1914d70eb4dab6dd89af4d541d53353ad97de8361124b565b60007f6ffbd451000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831601611e0557506001919050565b6107b182612388565b60006107b1826124c9565b60006040518284823760008084838989f49695505050505050565b6000604051828482376000808483898b8af1979650505050505050565b60603d604051915060208201818101604052818352816000823e505090565b8315611e7e57805160208201fd5b827fab46c69f7f32e1bf09b0725853da82a211e5402a0600296ab499a2fb5ea3b4198383604051611eb0929190613729565b60405180910390a250505050565b60008060005b8381101561234b57600181019085013560f81c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8101611f6557601582019186013560f881901c9060581c73ffffffffffffffffffffffffffffffffffffffff81169074ff000000000000000000000000000000000000000016811785611f4b5780611f5a565b60008681526020829052604090205b955050505050611ec4565b80611ffb5760018201918681013560f81c906043016000611f918a611f8c84888c8e613651565b6125f7565b60ff841697909701969194508491905060a083901b74ff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff82161786611fe05780611fef565b60008781526020829052604090205b96505050505050611ec4565b60028103612123576000808784013560f881901c9060581c73ffffffffffffffffffffffffffffffffffffffff16601586019550909250905060008885013560e81c600386018162ffffff1691508096508192505050600081860190506120748b848c8c8a90869261206f93929190613651565b6128ba565b6120bc578a8361208683898d8f613651565b6040517f9a9462320000000000000000000000000000000000000000000000000000000081526004016107ff9493929190613742565b60ff8416979097019694508460a084901b74ff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff841617876121075780612116565b60008881526020829052604090205b9750505050505050611ec4565b600381036121565760208201918601358361213e578061214d565b60008481526020829052604090205b93505050611ec4565b600481036121a2576003808301928781013560e81c91908201016000806121838b61189a85898d8f613651565b60009889526020526040909720969097019650909350611ec492505050565b600681036122aa5760008287013560f81c60018401935060ff16905060008784013560f01c60028501945061ffff16905060008885013560e81c600386018162ffffff1691508096508192505050600081860190506000806122108d8d8d8b90879261189a93929190613651565b9398508893909250905084821061222657988501985b604080517f53657175656e6365206e657374656420636f6e6669673a0a0000000000000000602080830191909152603882018490526058820188905260788083018a905283518084039091018152609890920190925280519101208961228c578061229b565b60008a81526020829052604090205b99505050505050505050611ec4565b600581036123165760208201918601358781036122e5577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff94505b60006122f082612aa1565b9050846122fd578061230c565b60008581526020829052604090205b9450505050611ec4565b6040517fb2505f7c000000000000000000000000000000000000000000000000000000008152600481018290526024016107ff565b50935093915050565b7f8713a7c4465f6fbee2b6e9d6646d1d9f83fec929edfc4baf661f3c865bdd04d160009081526020829052604081206107b1565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fec6aba5000000000000000000000000000000000000000000000000000000000148061241b57507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b8061246757507fffffffff0000000000000000000000000000000000000000000000000000000082167f150b7a0200000000000000000000000000000000000000000000000000000000145b806124b357507fffffffff0000000000000000000000000000000000000000000000000000000082167fc0ee0b8a00000000000000000000000000000000000000000000000000000000145b156124c057506001919050565b6107b182612adc565b60006125cb826040517fff0000000000000000000000000000000000000000000000000000000000000060208201527fffffffffffffffffffffffffffffffffffffffff0000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000060601b166021820152603581018290527f000000000000000000000000000000000000000000000000000000000000000060558201526000903090607501604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0818403018152919052805160209091012073ffffffffffffffffffffffffffffffffffffffff161492915050565b156125d857506001919050565b60006125e383611d86565b905080158015906109655750421092915050565b6000604282146126375782826040517f2ee17a3d0000000000000000000000000000000000000000000000000000000081526004016107ff929190613782565b6000612650612647600185613796565b85013560f81c90565b60ff169050604084013560f81c843560208601357f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08111156126c4578686826040517fad4aac760000000000000000000000000000000000000000000000000000000081526004016107ff939291906137a9565b8260ff16601b141580156126dc57508260ff16601c14155b15612719578686846040517fe578897e0000000000000000000000000000000000000000000000000000000081526004016107ff939291906137cd565b60018403612786576040805160008152602081018083528a905260ff851691810191909152606081018390526080810182905260019060a0015b6020604051602081039080840390855afa158015612775573d6000803e3d6000fd5b50505060206040510351945061285e565b60028403612823576040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101899052600190605c01604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600084529083018083525260ff861690820152606081018490526080810183905260a001612753565b86868560016040517f9dfba8520000000000000000000000000000000000000000000000000000000081526004016107ff94939291906137f4565b73ffffffffffffffffffffffffffffffffffffffff85166128af5786866040517f6c1719d20000000000000000000000000000000000000000000000000000000081526004016107ff929190613782565b505050509392505050565b60008181036128f5576040517fac241e1100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008383612904600182613796565b818110612913576129136132f2565b919091013560f81c915050600181148061292d5750600281145b15612972578473ffffffffffffffffffffffffffffffffffffffff166129548786866125f7565b73ffffffffffffffffffffffffffffffffffffffff16149150612a98565b60038103612a5d5773ffffffffffffffffffffffffffffffffffffffff8516631626ba7e87866000876129a6600182613796565b926129b393929190613651565b6040518463ffffffff1660e01b81526004016129d193929190613534565b602060405180830381865afa1580156129ee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a129190613820565b7fffffffff00000000000000000000000000000000000000000000000000000000167f1626ba7e00000000000000000000000000000000000000000000000000000000149150612a98565b83838260006040517f9dfba8520000000000000000000000000000000000000000000000000000000081526004016107ff94939291906137f4565b50949350505050565b6040517f53657175656e636520737461746963206469676573743a0a00000000000000006020820152603881018290526000906058016115e2565b60007fe4a77bbc000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831601612b2f57506001919050565b6107b18260007f1cbec625000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831601612b8657506001919050565b6107b18260006107b18260007ffda4dd44000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831601612be357506001919050565b6107b18260007fffffffff0000000000000000000000000000000000000000000000000000000082167fac6a444e000000000000000000000000000000000000000000000000000000001480612c7a57507fffffffff0000000000000000000000000000000000000000000000000000000082167f36e7817500000000000000000000000000000000000000000000000000000000145b15612c8757506001919050565b7f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff000000000000000000000000000000000000000000000000000000008316146107b1565b8183823760009101908152919050565b7fffffffff000000000000000000000000000000000000000000000000000000008116811461081157600080fd5b600060208284031215612d2157600080fd5b813561096581612ce1565b803573ffffffffffffffffffffffffffffffffffffffff81168114612d5057600080fd5b919050565b600060208284031215612d6757600080fd5b61096582612d2c565b60008083601f840112612d8257600080fd5b50813567ffffffffffffffff811115612d9a57600080fd5b6020830191508360208260051b8501011115612db557600080fd5b9250929050565b60008060208385031215612dcf57600080fd5b823567ffffffffffffffff811115612de657600080fd5b612df285828601612d70565b90969095509350505050565b60008083601f840112612e1057600080fd5b50813567ffffffffffffffff811115612e2857600080fd5b602083019150836020828501011115612db557600080fd5b600080600080600060808688031215612e5857600080fd5b612e6186612d2c565b9450612e6f60208701612d2c565b935060408601359250606086013567ffffffffffffffff811115612e9257600080fd5b612e9e88828901612dfe565b969995985093965092949392505050565b600080600060408486031215612ec457600080fd5b83359250602084013567ffffffffffffffff811115612ee257600080fd5b612eee86828701612dfe565b9497909650939450505050565b60008060008060408587031215612f1157600080fd5b843567ffffffffffffffff80821115612f2957600080fd5b612f3588838901612dfe565b90965094506020870135915080821115612f4e57600080fd5b50612f5b87828801612dfe565b95989497509550505050565b600060208284031215612f7957600080fd5b5035919050565b60008060408385031215612f9357600080fd5b50508035926020909101359150565b600080600080600060608688031215612fba57600080fd5b853567ffffffffffffffff80821115612fd257600080fd5b612fde89838a01612d70565b9097509550602088013594506040880135915080821115612ffe57600080fd5b50612e9e88828901612dfe565b60005b8381101561302657818101518382015260200161300e565b50506000910152565b6000815180845261304781602086016020860161300b565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610965602083018461302f565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000602082840312156130cd57600080fd5b813567ffffffffffffffff808211156130e557600080fd5b818401915084601f8301126130f957600080fd5b81358181111561310b5761310b61308c565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156131515761315161308c565b8160405282815287602084870101111561316a57600080fd5b826020860160208301376000928101602001929092525095945050505050565b6000806040838503121561319d57600080fd5b82356131a881612ce1565b91506131b660208401612d2c565b90509250929050565b60008060008060008060008060a0898b0312156131db57600080fd5b6131e489612d2c565b97506131f260208a01612d2c565b9650604089013567ffffffffffffffff8082111561320f57600080fd5b61321b8c838d01612d70565b909850965060608b013591508082111561323457600080fd5b6132408c838d01612d70565b909650945060808b013591508082111561325957600080fd5b506132668b828c01612dfe565b999c989b5096995094979396929594505050565b60008060008060008060a0878903121561329357600080fd5b61329c87612d2c565b95506132aa60208801612d2c565b94506040870135935060608701359250608087013567ffffffffffffffff8111156132d457600080fd5b6132e089828a01612dfe565b979a9699509497509295939492505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80358015158114612d5057600080fd5b8183528181602085013750600060208284010152600060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116840101905092915050565b81835260006020808501808196508560051b810191508460005b878110156134bc57828403895281357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff418836030181126133d357600080fd5b870160c06133e082613321565b151586526133ef878301613321565b15158688015260408281013590870152606073ffffffffffffffffffffffffffffffffffffffff613421828501612d2c565b16908701526080828101359087015260a080830135368490037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe101811261346757600080fd5b90920187810192903567ffffffffffffffff81111561348557600080fd5b80360384131561349457600080fd5b82828901526134a68389018286613331565b9c89019c97505050928601925050600101613394565b5091979650505050505050565b60408152600560408201527f73656c663a00000000000000000000000000000000000000000000000000000060608201526080602082015260006109d460808301848661337a565b83815260406020820152600061352b60408301848661337a565b95945050505050565b83815260406020820152600061352b604083018486613331565b7f697066733a2f2f0000000000000000000000000000000000000000000000000081526000825161358681600785016020870161300b565b9190910160070192915050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff418336030181126135c757600080fd5b9190910192915050565b6000602082840312156135e357600080fd5b61096582613321565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261362157600080fd5b83018035915067ffffffffffffffff82111561363c57600080fd5b602001915036819003821315612db557600080fd5b6000808585111561366157600080fd5b8386111561366e57600080fd5b5050820193919092039150565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156107b1576107b161367b565b6060815260006136d1606083018688613331565b6020830194909452506040015292915050565b7f620000000000000000000000000000000000000000000000000000000000000081526000825161371c81600185016020870161300b565b9190910160010192915050565b8281526040602082015260006109d4604083018461302f565b84815273ffffffffffffffffffffffffffffffffffffffff84166020820152606060408201526000613778606083018486613331565b9695505050505050565b6020815260006109d4602083018486613331565b818103818111156107b1576107b161367b565b6040815260006137bd604083018587613331565b9050826020830152949350505050565b6040815260006137e1604083018587613331565b905060ff83166020830152949350505050565b606081526000613808606083018688613331565b60208301949094525090151560409091015292915050565b60006020828403121561383257600080fd5b815161096581612ce156fea26469706673582212203c8d5199f30c123dff9711c13e6d1af00442c59755d475d5781636aabab62db364736f6c63430008120033603a600e3d39601a805130553df3363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3',
      signer
    )
  }
}
