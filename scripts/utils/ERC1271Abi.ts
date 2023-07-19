export const ERC1271_ABI = [
  {
    type: 'function',
    name: 'isValidSignature',
    constant: true,
    inputs: [
      {
        type: 'bytes',
      },
      {
        type: 'bytes',
      },
    ],
    outputs: [
      {
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'view',
  },
]

export const ERC1271_ABI_HASH = [
  {
    type: 'function',
    name: 'isValidSignature',
    constant: true,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'bytes',
      },
    ],
    outputs: [
      {
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'view',
  },
]

export const ERC1271_MAGIC_NUMBER = '0x20c13b0b'
export const ERC1271_MAGIC_NUMBER_HASH = '0x1626ba7e'
