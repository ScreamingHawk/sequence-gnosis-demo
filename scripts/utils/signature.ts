import { BigNumber, BigNumberish, ethers } from 'ethers'
import { ERC1271_ABI, ERC1271_MAGIC_NUMBER } from './ERC1271Abi'
import type { WalletV2 } from '@0xsequence/wallet'
import Safe from '@safe-global/protocol-kit'

// Sequence v2 signing functions

export const signSequenceMessage = async (
  wallet: WalletV2,
  message: Uint8Array,
): Promise<string> => {
  return wallet.signMessage(message)
}

export const signSequenceERC1271Message = async (
  validatorAddr: string, // The address of the ERC1271 contract
  signaturePart: string, // The signature to wrap for ERC1271 validation
): Promise<string> => {
  return ethers.utils.solidityPack(
    ['bytes', 'uint8', 'uint8', 'address', 'uint24', 'bytes'],
    [
      [],
      2, // dynamic sig flag
      1, // not sure what this is
      validatorAddr,
      signaturePart.length,
      signaturePart,
    ],
  )
}

// Gnosis Safe signing functions

export const EIP712_SAFE_MESSAGE_TYPE = {
  // "SafeMessage(bytes message)"
  SafeMessage: [{ type: 'bytes', name: 'message' }],
}

export const signGnosisMessage = async (
  wallet: Safe,
  signer: ethers.Wallet,
  message: Uint8Array,
  chainId: number,
): Promise<string> => {
  const digest = ethers.utils.keccak256(message)
  wallet.signTypedData
  const typedDataSig = {
    signer: signer.address,
    data: await signer._signTypedData(
      { verifyingContract: await wallet.getAddress(), chainId },
      EIP712_SAFE_MESSAGE_TYPE,
      { message: digest },
    ),
  }
  return buildSignatureBytes([typedDataSig])
}

// keccak256(
//     "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
// )
const SAFE_TX_TYPEHASH = '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';

// keccak256(
//     "EIP712Domain(uint256 chainId,address verifyingContract)"
// );
const DOMAIN_SEPARATOR_TYPEHASH = '0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218';

export interface EncodeTransactionDataInput {
  to: string;
  value: BigNumberish;
  data: string;
  operation: BigNumberish;
  safeTxGas: BigNumberish;
  baseGas: BigNumberish;
  gasPrice: BigNumberish;
  gasToken: string;
  refundReceiver: string;
  nonce: BigNumberish;
  chainId: number;
}

export const encodeGnosisTransaction = (input: EncodeTransactionDataInput, walletAddress: string) => {
  const { to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce, chainId } = input;

  const safeTxHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "address", "uint256", "bytes32", "uint8", "uint256", "uint256", "uint256", "address", "address", "uint256"],
      [SAFE_TX_TYPEHASH, to, value, ethers.utils.keccak256(data), operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce]
    )
  );

  const domainSeparator = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256", "address"], [DOMAIN_SEPARATOR_TYPEHASH, chainId, walletAddress])
  );

  return ethers.utils.solidityPack(["bytes1", "bytes1", "bytes32"], [0x19, 0x01, domainSeparator]) + safeTxHash.slice(2);
}



export const signGnosisERC1271Message = async (
  wallet: Safe,
  validatorAddr: string, // The address of the signing ERC1271 contract
  signer: ethers.Wallet, // The signer of the ERC1271 contract
  tx: any,
  chainId: number,
) => {
  const safeAddr = await wallet.getAddress()
  const dataHash = ethers.utils._TypedDataEncoder.encode(
    { verifyingContract: safeAddr, chainId },
    EIP712_SAFE_MESSAGE_TYPE,
    { message: tx },
  )
  const msgHash = ethers.utils._TypedDataEncoder.hash(
    { verifyingContract: validatorAddr, chainId },
    EIP712_SAFE_MESSAGE_TYPE,
    { message: dataHash },
  )
  const typedDataHash = ethers.utils.arrayify(msgHash)
  const signerAddress = await signer.getAddress()
  const signerSig = {
    signer: signerAddress,
    data: (await signer.signMessage(typedDataHash))
      .replace(/1b$/, '1f')
      .replace(/1c$/, '20'),
    dynamic: true,
  }
  return buildSignatureBytes([signerSig])
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

export const validateERC1271Signature = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddr: string,
  message: Uint8Array,
  signature: string,
) => {
  const digest = ethers.utils.keccak256(message)

  const contract = new ethers.Contract(contractAddr, ERC1271_ABI, provider)
  try {
    const result = await contract.isValidSignature(digest, signature)

    return result === ERC1271_MAGIC_NUMBER
  } catch (e) {
    console.error('Unable to validate signature', e)
    return false
  }
}
