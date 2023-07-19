import { config as dotenvConfig } from 'dotenv'
import { ContractTransaction, ethers } from 'ethers'
import { createAccounts, fundAccounts } from './utils/accounts'
import {
  EncodeTransactionDataInput,
  buildSignatureBytes,
  encodeGnosisTransaction,
  signGnosisMessage,
  signSequenceMessage,
  validateERC1271SignatureData,
  validateERC1271SignatureHash,
  validateSafeSignature,
} from './utils/signature'
import { SafeContract } from './utils/gnosis/Safe'
import { Transaction, applyTxDefault } from './utils/sequence/sequence'
import { abi as MainModuleABI } from './utils/sequence/MainModuleV2'
import { V2_WALLET_CONTEXT } from './utils/constants'

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

  const seqSig = await signSequenceMessage(
    accounts.sequenceEoaOwned,
    msg,
    chainId,
  )
  if (
    !(await validateERC1271SignatureData(
      provider,
      await accounts.sequenceEoaOwned.getAddress(),
      msg,
      seqSig,
    ))
  ) {
    console.error('Signature check FAILED for sequenceEoaOwned')
  } else {
    console.log(`Signature check passed for sequenceEoaOwned`)
  }

  // Check Gnosis owned by EOA
  const gnoSig = await signGnosisMessage(
    accounts.gnosisEoaOwned,
    accounts.eoa,
    msg,
    chainId,
  )
  if (
    !(await validateERC1271SignatureHash(
      provider,
      await accounts.gnosisEoaOwned.getAddress(),
      ethers.utils.keccak256(msg),
      gnoSig,
    ))
  ) {
    console.error('Signature hash check FAILED for gnosisEoaOwned')
  } else {
    console.log(`Signature hash check passed for gnosisEoaOwned`)
  }

  //
  // Gnosis with Sequence as signer
  //

  /* CHECK the above signature can be passed through */

  const gnoSeqSig = buildSignatureBytes([
    {
      signer: accounts.sequenceEoaOwned.address,
      data: seqSig,
      dynamic: true,
    },
  ])

  if (
    !(await validateSafeSignature(
      provider,
      await accounts.gnosisSequenceOwned.getAddress(),
      msg,
      gnoSeqSig,
    ))
  ) {
    console.error('Signature check FAILED for gnosisSequenceOwned')
  } else {
    console.log(`Signature check passed for gnosisSequenceOwned`)
  }

  //
  // Sequence with Gnosis as signer
  //

  /* CHECK the above signature can be passed through */

  // Encode the message in Sequence format for Gnosis signing

  const seqGnoSig = await signSequenceMessage(
    accounts.sequenceGnosisOwned,
    msg,
    chainId,
  )

  if (
    !(await validateERC1271SignatureData(
      provider,
      await accounts.sequenceGnosisOwned.getAddress(),
      msg,
      seqGnoSig,
    ))
  ) {
    console.error('Signature check FAILED for sequenceGnosisOwned')
  } else {
    console.log(`Signature check passed for sequenceGnosisOwned`)
  }

  /* SENDING ETH */

  const testSendEth = async () => {
    // Fund the wallet owned wallets
    await fundAccounts(
      accounts.eoa,
      [
        await accounts.gnosisSequenceOwned.getAddress(),
        accounts.sequenceGnosisOwned.address,
      ],
      SEND_AMOUNT,
    )

    const sendEthFromGnosis = async () => {
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
      const encodedTxData = await encodeGnosisTransaction(
        txParams,
        await accounts.gnosisSequenceOwned.getAddress(),
      )

      // Sign it with the Sequence wallet
      const encodedTxSeqSigned = await signSequenceMessage(
        accounts.sequenceEoaOwned,
        encodedTxData,
        chainId,
      )
      const signed = buildSignatureBytes([
        {
          signer: accounts.sequenceEoaOwned.address,
          data: encodedTxSeqSigned,
          dynamic: true,
        },
      ])

      // Send it via Contract interface
      console.log('Sending funds back to EOA from Gnosis')
      const safe = new SafeContract(
        await accounts.gnosisSequenceOwned.getAddress(),
        accounts.eoa,
      )
      const tx: ContractTransaction = await safe.execTransaction(
        txParams.to,
        txParams.value,
        txParams.data,
        txParams.operation,
        txParams.safeTxGas,
        txParams.baseGas,
        txParams.gasPrice,
        txParams.gasToken,
        txParams.refundReceiver,
        signed,
      )
      await tx.wait()
      console.log('Funds moved from Gnosis to EOA', tx.hash)
    }
    await sendEthFromGnosis()

    const sendEthFromSequence = async () => {
      // Send 0.01 from Sequence owned by Gnosis
      const txParams: Transaction = applyTxDefault({
        target: accounts.eoa.address,
        value: SEND_AMOUNT,
      })

      // Get nonce
      const mainModule = new ethers.Contract(accounts.sequenceGnosisOwned.address, MainModuleABI, accounts.eoa)
      const nonce = await mainModule.readNonce(0)

      // Relay it
      const sig = await accounts.sequenceGnosisOwned.signTransactions([txParams], nonce, chainId)
      const tx = await mainModule.execute([txParams], nonce, sig)
      await tx.wait()
      console.log('Funds moved from Sequence to EOA', tx.hash)
    }
    await sendEthFromSequence()
  }
  // await testSendEth()
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
