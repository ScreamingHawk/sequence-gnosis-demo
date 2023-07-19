import { BigNumberish, BytesLike, ethers } from 'ethers'
import {
  ERC1271_ABI,
  ERC1271_ABI_HASH,
  ERC1271_MAGIC_NUMBER,
  ERC1271_MAGIC_NUMBER_HASH,
} from './ERC1271Abi'
import Safe from '@safe-global/protocol-kit'
import { SafeContract } from './gnosis/Safe'
import type { SequenceWallet } from './sequence/wallet'

// Sequence v2 signing functions

export const signSequenceMessage = async (
  wallet: SequenceWallet,
  message: BytesLike,
  chainId: BigNumberish,
): Promise<string> => {
  return await wallet.signMessage(message, chainId)
}

// Gnosis Safe signing functions

export const EIP712_SAFE_MESSAGE_TYPE = {
  // "SafeMessage(bytes message)"
  SafeMessage: [{ type: 'bytes', name: 'message' }],
}

// keccak256("SafeMessage(bytes message)");
export const SAFE_MSG_TYPEHASH =
  '0x60b3cbf8b4a223d68d641b3b6ddf9a298e7f33710cf3d3a9d1146b5a6150fbca'

export const signGnosisMessage = async (
  wallet: Safe,
  signer: ethers.Wallet,
  message: BytesLike,
  chainId: number,
): Promise<string> => {
  const digest = ethers.utils.keccak256(message)
  return signGnosisDigest(wallet, signer, digest, chainId)
}

export const signGnosisDigest = async (
  wallet: Safe,
  signer: ethers.Wallet,
  digest: BytesLike,
  chainId: number,
): Promise<string> => {
  const typedDataSig = {
    signer: signer.address,
    data: await signer._signTypedData(
      { verifyingContract: await wallet.getAddress(), chainId },
      EIP712_SAFE_MESSAGE_TYPE,
      { message: digest },
    ),
    dynamic: false,
  }
  return buildSignatureBytes([typedDataSig])
}

// keccak256(
//     "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
// )
const SAFE_TX_TYPEHASH =
  '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8'

// keccak256(
//     "EIP712Domain(uint256 chainId,address verifyingContract)"
// );
const DOMAIN_SEPARATOR_TYPEHASH =
  '0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218'

export interface EncodeTransactionDataInput {
  to: string
  value: BigNumberish
  data: string
  operation: BigNumberish
  safeTxGas: BigNumberish
  baseGas: BigNumberish
  gasPrice: BigNumberish
  gasToken: string
  refundReceiver: string
  nonce: BigNumberish
  chainId: number
}

export const encodeGnosisTransaction = (
  input: EncodeTransactionDataInput,
  walletAddress: string,
) => {
  const {
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
    chainId,
  } = input

  const safeTxHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      [
        'bytes32',
        'address',
        'uint256',
        'bytes32',
        'uint8',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'address',
        'uint256',
      ],
      [
        SAFE_TX_TYPEHASH,
        to,
        value,
        ethers.utils.keccak256(data),
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce,
      ],
    ),
  )

  const domainSeparator = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'uint256', 'address'],
      [DOMAIN_SEPARATOR_TYPEHASH, chainId, walletAddress],
    ),
  )

  return (
    ethers.utils.solidityPack(
      ['bytes1', 'bytes1', 'bytes32'],
      [0x19, 0x01, domainSeparator],
    ) + safeTxHash.slice(2)
  )
}

// https://github.com/safe-global/safe-contracts/blob/7e20a7abd2f6242537eedb2fdd0f2043849babcd/src/utils/execution.ts#L142C49-L142C49
type SafeSignature = {
  signer: string
  data: string
  dynamic?: boolean
}
export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  const SIGNATURE_LENGTH_BYTES = 65
  signatures.sort((left, right) =>
    left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()),
  )

  let signatureBytes = '0x'
  let dynamicBytes = ''
  for (const sig of signatures) {
    if (sig.dynamic) {
      /* 
              A contract signature has a static part of 65 bytes and the dynamic part that needs to be appended at the end of 
              end signature bytes.
              The signature format is
              Signature type == 0
              Constant part: 65 bytes
              {32-bytes signature verifier}{32-bytes dynamic data position}{1-byte signature type}
              Dynamic part (solidity bytes): 32 bytes + signature data length
              {32-bytes signature length}{bytes signature data}
          */
      const dynamicPartPosition = (
        signatures.length * SIGNATURE_LENGTH_BYTES +
        dynamicBytes.length / 2
      )
        .toString(16)
        .padStart(64, '0')
      const dynamicPartLength = (sig.data.slice(2).length / 2)
        .toString(16)
        .padStart(64, '0')
      const staticSignature = `${sig.signer
        .slice(2)
        .padStart(64, '0')}${dynamicPartPosition}00`
      const dynamicPartWithLength = `${dynamicPartLength}${sig.data.slice(2)}`

      signatureBytes += staticSignature
      dynamicBytes += dynamicPartWithLength
    } else {
      signatureBytes += sig.data.slice(2)
    }
  }

  return signatureBytes + dynamicBytes
}

// Validation

// isValidSignature(bytes, bytes)
export const validateERC1271SignatureData = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddr: string,
  data: BytesLike,
  signature: string,
) => {
  const contract = new ethers.Contract(contractAddr, ERC1271_ABI, provider)
  try {
    const result = await contract.callStatic.isValidSignature(
      data,
      signature,
    )
    return result === ERC1271_MAGIC_NUMBER
  } catch (e) {
    console.error('Unable to validate signature', e)
    return false
  }
}

// isValidSignature(bytes32, bytes)
export const validateERC1271SignatureHash = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddr: string,
  hash: BytesLike,
  signature: string,
) => {
  const contract = new ethers.Contract(contractAddr, ERC1271_ABI_HASH, provider)
  try {
    const result = await contract.callStatic.isValidSignature(hash, signature)
    return result === ERC1271_MAGIC_NUMBER_HASH
  } catch (e) {
    console.error('Unable to validate signature', e)
    return false
  }
}

export const validateSafeSignature = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddr: string,
  message: BytesLike,
  signature: string,
) => {
  const hash = ethers.utils.keccak256(message)

  const contract = new SafeContract(contractAddr, provider)
  try {
    // Call reverts on error
    await contract.callStatic.checkSignatures(hash, message, signature)
    return true
  } catch (e) {
    console.error('Unable to validate signature', e)
    return false
  }
}
