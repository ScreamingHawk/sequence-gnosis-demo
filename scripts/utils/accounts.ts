import { Wallet } from '@0xsequence/wallet'
import Safe, {
	EthersAdapter,
	SafeFactory,
} from '@safe-global/protocol-kit'
import type { EthAdapter } from '@safe-global/safe-core-sdk-types'
import { config as dotenvConfig } from 'dotenv'
import { ethers } from 'ethers'
import { WALLET_CONTEXT } from './constants'
import { GnosisSigner } from './GnosisSigner'

dotenvConfig()

const { EOA_PRIVATE_KEY, RPC_URL, RELAYER_URL } = process.env

const deployGnosis = async (safeFactory: SafeFactory, provider: ethers.providers.Provider, ownerAddr: string, ownerDescr: string) => {
	console.log(`Creating Gnosis owned by ${ownerDescr}`)
	const gnosisConfig = {
		owners: [ownerAddr],
		threshold: 1,
  }
	const gnosisAddress = await safeFactory.predictSafeAddress(gnosisConfig)
	let gnosisSafe: Safe
	if (await provider.getCode(gnosisAddress) === '0x') {
		gnosisSafe = await safeFactory.deploySafe({ 
			safeAccountConfig: gnosisConfig,
		})
		gnosisSafe.signTransaction
		if (gnosisAddress !== await gnosisSafe.getAddress()) {
			throw new Error('Gnosis address mismatch')
		}
	} else {
		gnosisSafe = await Safe.create({
			safeAddress: gnosisAddress,
			ethAdapter: safeFactory.getEthAdapter(),
		})
	}
  console.log(`Gnosis owned by ${ownerDescr} Address: ${gnosisAddress}`)
	return gnosisSafe
}

export const createAccounts = async () => {
  if (!EOA_PRIVATE_KEY || !RPC_URL || !RELAYER_URL) {
    throw new Error('Required env vars not set')
  }

  // Create provider and relayer
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

  // Link EOA
  const eoa = new ethers.Wallet(EOA_PRIVATE_KEY, provider)
  const eoaAddress = await eoa.getAddress()
  console.log(`EOA Address: ${eoaAddress}`)
	console.log(`EOA funds: ${await eoa.getBalance()}`)

  // Create Sequence owned by EOA
	console.log('Creating Sequence owned by EOA')
  const sequenceEoaOwned = await Wallet.singleOwner(eoa, WALLET_CONTEXT)
	const sequenceEoaOwnedAddress = await sequenceEoaOwned.getAddress()
  console.log(
    `Sequence owned by EOA Address: ${sequenceEoaOwnedAddress}`,
  )
  sequenceEoaOwned.setProvider(provider)

  // Create Gnosis owned by EOA
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: eoa,
  }) as unknown as EthAdapter // Gnosis types are bad
  const safeFactory = await SafeFactory.create({ ethAdapter })
	const gnosisEoaOwned = await deployGnosis(safeFactory, provider, eoaAddress, 'EOA')

	// Hack Gnosis type into ethers.Singer
	const gnosisEoaOwnedSigner = new GnosisSigner(gnosisEoaOwned)

  // Create Sequence owned by Gnosis
	console.log('Creating Sequence owned by Gnosis')
  const sequenceGnosisOwned = await Wallet.singleOwner(
    gnosisEoaOwnedSigner,
    WALLET_CONTEXT,
  )
  sequenceGnosisOwned.setProvider(provider)
  console.log(
    `Sequence owned by Gnosis Address: ${await sequenceGnosisOwned.getAddress()}`,
  )

  // Create Gnosis owned by Sequence
	const gnosisSequenceOwned = await deployGnosis(safeFactory, provider, sequenceEoaOwnedAddress, 'Sequence')

  return {
    eoa,
    sequenceEoaOwned,
    gnosisEoaOwned,
    sequenceGnosisOwned,
    gnosisSequenceOwned,
  }
}
