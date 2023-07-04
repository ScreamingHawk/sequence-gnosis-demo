import { createAccounts } from './utils/create-accounts'

createAccounts()
  .then(() => {
    console.log('Done')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
