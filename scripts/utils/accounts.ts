import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import type { EthAdapter } from '@safe-global/safe-core-sdk-types'
import { BigNumber, ethers } from 'ethers'
import { V2_WALLET_CONTEXT } from './constants'
import { GnosisWallet } from './gnosis/GnosisSigner'
import { SequenceWallet } from './sequence/wallet'
import { abi as FactoryABI } from './sequence/FactoryV2'

const deploySequence = async (
  signer: ethers.Signer,
  owner: ethers.Wallet | GnosisWallet,
  ownerName: string,
) => {
  console.log(`Creating Sequence owned by ${ownerName}`)
  const sequenceWallet = SequenceWallet.detailedWallet(V2_WALLET_CONTEXT, { threshold: 1, signers: [{weight: 1, value: owner}] })

  console.log(`Sequence owned by ${ownerName} Address: ${sequenceWallet.address}`)
  if (signer.provider && await signer.provider.getCode(sequenceWallet.address) === '0x') {
    // Create factory
    console.log(`Deploying Sequence owned by ${ownerName}`)
    const factory = new ethers.Contract(V2_WALLET_CONTEXT.factory, FactoryABI, signer)
    const tx = await factory.deploy(V2_WALLET_CONTEXT.mainModule, sequenceWallet.imageHash)
    await tx.wait()
  }

  return sequenceWallet
}

const deployGnosis = async (
  safeFactory: SafeFactory,
  provider: ethers.providers.Provider,
  ownerAddr: string,
  ownerName: string,
) => {
  console.log(`Creating Gnosis owned by ${ownerName}`)
  const gnosisConfig = {
    owners: [ownerAddr],
    threshold: 1,
  }
  const gnosisAddress = await safeFactory.predictSafeAddress(gnosisConfig)
  let gnosisSafe: Safe
  if ((await provider.getCode(gnosisAddress)) === '0x') {
    gnosisSafe = await safeFactory.deploySafe({
      safeAccountConfig: gnosisConfig,
    })
    if (gnosisAddress !== (await gnosisSafe.getAddress())) {
      throw new Error('Gnosis address mismatch')
    }
  } else {
    gnosisSafe = await Safe.create({
      safeAddress: gnosisAddress,
      ethAdapter: safeFactory.getEthAdapter(),
    })
  }
  console.log(`Gnosis owned by ${ownerName} Address: ${gnosisAddress}`)
  return gnosisSafe
}

export const createAccounts = async (
  provider: ethers.providers.JsonRpcProvider,
  eoaPk: string,
  chainId: number,
) => {
  // Link EOA
  const eoa = new ethers.Wallet(eoaPk, provider)
  const eoaAddress = await eoa.getAddress()
  console.log(`EOA Address: ${eoaAddress}`)
  console.log(`EOA funds: ${await eoa.getBalance()}`)

  // Create Sequence owned by EOA
  const sequenceEoaOwned = await deploySequence(
    eoa,
    eoa,
    'EOA',
  )

  // Create Gnosis owned by EOA
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: eoa,
  }) as unknown as EthAdapter // Gnosis types are bad
  const safeFactory = await SafeFactory.create({ ethAdapter })
  const gnosisEoaOwned = await deployGnosis(
    safeFactory,
    provider,
    eoaAddress,
    'EOA',
  )

  // Hack Safe into type usable by Sequence Wallet
  const gnosisEoaOwnedSigner = new GnosisWallet(gnosisEoaOwned, await gnosisEoaOwned.getAddress(), eoa, chainId)

  // Create Sequence owned by Gnosis
  const sequenceGnosisOwned = await deploySequence(
    eoa,
    gnosisEoaOwnedSigner,
    'Gnosis',
  )

  // Create Gnosis owned by Sequence
  const gnosisSequenceOwned = await deployGnosis(
    safeFactory,
    provider,
    sequenceEoaOwned.address,
    'Sequence',
  )

  return {
    eoa,
    sequenceEoaOwned,
    gnosisEoaOwned,
    sequenceGnosisOwned,
    gnosisSequenceOwned,
    utils: {
      ethAdapter,
    }
  }
}

export const fundAccounts = async (
  eoa: ethers.Wallet,
  addresses: string[],
  amount: BigNumber,
) => {
  if (!eoa.provider) {
    throw new Error('EOA provider not set')
  }

  // Link EOA
  const eoaAddress = await eoa.getAddress()
  console.log(`EOA Address: ${eoaAddress}`)
  console.log(`EOA funds: ${ethers.utils.formatEther(await eoa.getBalance())}`)

  // Send ETH to each address
  const txs = []
  for (const address of addresses) {
    const bal = await eoa.provider.getBalance(address)
    if (bal.lt(amount)) {
      txs.push(
        await eoa.sendTransaction({
          to: address,
          value: amount.sub(bal),
        }),
      )
    }
  }
  await Promise.all(txs.map(tx => tx.wait()))
}
