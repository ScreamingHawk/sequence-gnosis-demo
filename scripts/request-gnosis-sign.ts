import SafeAppsSDK from '@safe-global/safe-apps-sdk'

type Opts = {
  allowedDomains?: RegExp[]
  debug?: boolean
}

const opts: Opts = {
  // allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
  debug: true,
}

const sdk = new SafeAppsSDK(opts)

const run = async () => {
  const message = 'Hello Sequence!'
  const tx = await sdk.txs.signMessage(message)
  console.log(tx)
  console.log(JSON.stringify(tx, null, 2))
  // { safeTxHash: '0x...' }
  const messageHash = sdk.safe.calculateMessageHash(message)
  console.log(messageHash)
	const messageIsSigned = await sdk.safe.isMessageSigned(message)
  console.log(messageIsSigned)

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
