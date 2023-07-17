import { config as dotenvConfig } from 'dotenv'
import { ethers } from 'ethers'
import { createAccounts, fundAccounts } from './utils/accounts'
import { EncodeTransactionDataInput, buildSignatureBytes, encodeGnosisTransaction, signGnosisERC1271Message, signGnosisMessage, signSequenceMessage, validateERC1271Signature } from './utils/signature'
import { CreateTransactionProps } from '@safe-global/protocol-kit'
import { SafeContract } from './utils/Safe'

dotenvConfig()

const { EOA_PRIVATE_KEY, RPC_URL, RELAYER_URL, CHAIN_ID } = process.env

const chainId = Number.parseInt(CHAIN_ID || '5')

const SEND_AMOUNT = ethers.utils.parseEther('0.01')

const run = async () => {
  if (!EOA_PRIVATE_KEY || !RPC_URL || !RELAYER_URL) {
    throw new Error('Required env vars not set')
  }

  // Create provider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  // Create accounts
  const accounts = await createAccounts(provider, EOA_PRIVATE_KEY, chainId)

  // Sign a message
  const message = 'Hi! this is a test message'
  const msg = ethers.utils.toUtf8Bytes(message)

  // Check Sequence owned by EOA

  const seqSig = await signSequenceMessage(accounts.sequenceEoaOwned, msg)
  if (!await validateERC1271Signature(provider, await accounts.sequenceEoaOwned.getAddress(), msg, seqSig)) {
    console.error('Signature check failed for sequenceEoaOwned')
  } else {
    console.log(`Signature check passed for sequenceEoaOwned`)
  }

  // Check Gnosis owned by EOA
  const gnoSig = await signGnosisMessage(accounts.gnosisEoaOwned, accounts.eoa, msg, chainId)
  if (!await validateERC1271Signature(provider, await accounts.gnosisEoaOwned.getAddress(), msg, gnoSig)) {
    console.error('Signature check failed for gnosisEoaOwned')
  } else {
    console.log(`Signature check passed for gnosisEoaOwned`)
  }

  /* CHECK the above message encoding */

  


  /* SENDING ETHERS */


  // Fund the wallet owned wallets
  await fundAccounts(accounts.eoa, [await accounts.gnosisSequenceOwned.getAddress(), accounts.sequenceGnosisOwned.address], SEND_AMOUNT)


  // Send 0.01 from Gnosis owned by Sequence
  const txParams: EncodeTransactionDataInput = {
    to: accounts.eoa.address,
    value: SEND_AMOUNT,
    data: '0x',
    operation: 0,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: ethers.constants.AddressZero,
    refundReceiver: ethers.constants.AddressZero,
    nonce: await accounts.gnosisSequenceOwned.getNonce(),
    chainId,
  }

  // Encode it
  const encodedTxData = await encodeGnosisTransaction(txParams, await accounts.gnosisSequenceOwned.getAddress())
  const encodedTxHash = ethers.utils.keccak256(encodedTxData)
  console.log(encodedTxHash)

  // Sign it with the Sequence wallet
  const encodedTxSeqSigned = await signSequenceMessage(accounts.sequenceGnosisOwned, ethers.utils.toUtf8Bytes(encodedTxHash))
  const signed = await buildSignatureBytes([{
    signer: accounts.sequenceEoaOwned.address,
    data: encodedTxSeqSigned,
    dynamic: true,
  }])

  process.exit(1)

  // Send it via Contract interface
  console.log('Sending funds back to eoa')
  const safe = new SafeContract(await accounts.gnosisSequenceOwned.getAddress(), accounts.eoa);
  const tx = await safe.execTransaction(txParams, signed)
  console.log('txhash is', tx.hash)
  await tx.wait()
  console.log('sent')

  // Check Sequence owned by Gnosis
  // const seqSig2 = await signSequenceERC1271Message(await accounts.gnosisEoaOwned.getAddress(), gnoSig)
  // console.log('seqSig2', seqSig2)
  // if (!await validateERC1271Signature(provider, accounts.sequenceGnosisOwned.address, msg, seqSig2)) {
  //   console.error('Signature check failed for sequenceGnosisOwned')
  // } else {
  //   console.log(`Signature check passed for sequenceGnosisOwned`)
  // }
}

run()
  .then(() => {
    console.log('Done')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
