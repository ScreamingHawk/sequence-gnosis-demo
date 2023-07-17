# Sequence x Gnosis Demo App

A demo for EIP-1271 compatible wallets. 

## Set Up

Create a new EOA address (or prepare an existing one). Ensure the EOA has enough funds to deploy wallets.

Add the EOA private key to `.env`.

## Script Usage

Install dependencies.

```sh
yarn
```

Run the script to create Sequence and Gnosis accounts.

```sh
yarn demo
```

## Manual Usage

### Create Gnosis Safe with Sequence Wallet as a Signer

Navigate to the [Safe Wallet][0].

Connect your Sequence Wallet using the Wallet Connect option.

1. In the Safe App: Connect > Wallet Connect
2. Copy the generated link
3. Navigate to the [Sequence App][1]
4. Connect your Sequence Wallet
5. Click "Scan", paste the link in the pop up, press Enter
6. Connect
7. Return to the Safe Wallet

Create a new Safe Account and set the Sequence Wallet address as the signer.

1. https://app.safe.global/welcome
2. Click "Create Safe Account"
3. Enter a name
4. Add your Sequence wallet as the owner
5. Follow the prompts to create the Safe account

#### Test Signing

Run the demo safe app

```sh
cd my-safe-app
yarn
yarn start
```

Once the app has loaded, add it to the [Safe Wallet][0].

1. Navigate to "Apps" > "My Custom Apps"
2. Click "Add custom Safe App
3. Enter the URL (http://localhost:3000 by default)
4. Accept the warnings and click Add

Open the Safe App from within the Safe Wallet by clicking on the App icon.

Click the pop up to sign the transaction... I didn't work.

### Create Sequence Wallet with Gnosis Safe as a Signer

The Sequence app currently does not support logging in with ...

[0]: https://app.safe.global
[1]: https://sequence.app
