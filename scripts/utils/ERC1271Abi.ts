export const ERC1271_ABI = [
  {
    type: 'function',
    name: 'isValidSignature',
    constant: true,
    inputs: [
      {
        type: 'bytes32'
      },
      {
        type: 'bytes'
      }
    ],
    outputs: [
      {
        type: 'bytes4'
      }
    ],
    payable: false,
    stateMutability: 'view'
  }
]

export const ERC1271_MAGIC_NUMBER = '0x1626ba7e'
