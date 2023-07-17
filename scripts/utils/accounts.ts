import { LocalRelayer } from '@0xsequence/relayer'
import { Orchestrator, signers as hubsigners } from '@0xsequence/signhub'
import { Wallet, type WalletV2 } from '@0xsequence/wallet'
import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import type { EthAdapter } from '@safe-global/safe-core-sdk-types'
import { BigNumber, ethers } from 'ethers'
import { GnosisSigner } from './GnosisSigner'
import { V2_CODERS, V2_WALLET_CONTEXT } from './constants'

const deploySequence = async (
  relayer: LocalRelayer,
  provider: ethers.providers.Provider,
  owner: ethers.Signer,
  ownerName: string,
  chainId: number,
) => {
  console.log(`Creating Sequence owned by ${ownerName}`)
  const sequenceWallet = Wallet.newWallet({
    coders: V2_CODERS,
    context: V2_WALLET_CONTEXT,
    config: V2_CODERS.config.fromSimple({
      threshold: 1,
      checkpoint: 0,
      signers: [{ address: await owner.getAddress(), weight: 1 }],
    }),
    orchestrator: new Orchestrator([new hubsigners.SignerWrapper(owner)]),
    chainId,
    provider,
    relayer,
  }) as WalletV2

  const sequenceAddress = await sequenceWallet.getAddress()
  console.log(`Sequence owned by ${ownerName} Address: ${sequenceAddress}`)
  if (!(await sequenceWallet.reader().isDeployed(sequenceAddress))) {
    const tx = await sequenceWallet.deploy()
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

  // Create your rpc relayer instance with relayer node you want to use
  const relayer = new LocalRelayer(eoa)

  // Create Sequence owned by EOA
  const sequenceEoaOwned = await deploySequence(
    relayer,
    provider,
    eoa,
    'EOA',
    chainId,
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

  // Hack Gnosis type into ethers.Singer
  const gnosisEoaOwnedSigner = new GnosisSigner(gnosisEoaOwned)

  // Create Sequence owned by Gnosis
  const sequenceGnosisOwned = await deploySequence(
    relayer,
    provider,
    gnosisEoaOwnedSigner,
    'Gnosis',
    chainId,
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
  console.log(`EOA funds: ${await eoa.getBalance()}`)

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
