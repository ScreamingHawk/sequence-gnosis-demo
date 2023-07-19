// Modified from https://github.com/0xsequence/wallet-contracts/blob/e0c5382636a88b4db4bcf0a70623355d7cd30fb4/test/utils/wallet.ts

import { ethers, Overrides } from "ethers"
import { addressOf, applyTxDefaults, ConfigTopology, digestOf, encodeSignature, EncodingOptions, imageHash, merkleTopology, optimize2SignersTopology, SequenceContext, SignaturePartType, SignatureType, SimplifiedWalletConfig, subdigestOf, Transaction, WalletConfig } from "./sequence"
import { GnosisWallet } from "../gnosis/GnosisSigner"

export type StaticSigner = (ethers.Signer & { address: string })
export type AnyStaticSigner = StaticSigner | SequenceWallet | GnosisWallet

export function isAnyStaticSigner(s: any): s is AnyStaticSigner {
  return s.address !== undefined
}

let LAST_CHECKPOINT = 0

export function getCheckpoint() {
  // let cand = Math.floor(Date.now() / 1000)
  let cand = 1000

  if (cand === LAST_CHECKPOINT) {
    cand++
  }

  LAST_CHECKPOINT = cand
  return cand
}

export type WalletOptions = {
  context: SequenceContext
  config: WalletConfig
  address?: string
  signers: (ethers.Signer | SequenceWallet | GnosisWallet)[]
  encodingOptions?: EncodingOptions
  chainId?: ethers.BigNumberish
}

export type BasicWalletOptions = {
  address?: string,
  threshold?: number,
  signing: number | number[],
  idle: number | number[],
  encodingOptions?: EncodingOptions,
  topologyConverter: (simple: SimplifiedWalletConfig) => ConfigTopology
}

export type DetailedWalletOptions = {
  address?: string,
  threshold: ethers.BigNumberish,
  signers: (string | AnyStaticSigner | Weighted<string> | Weighted<AnyStaticSigner>)[],
  encodingOptions?: EncodingOptions
}

export type Weighted<T> = { weight: number, value: T }

export function isWeighted<T>(w: any): w is Weighted<T> {
  return w.weight !== undefined && w.value !== undefined
}

export function weightedVal<T>(w: Weighted<T> | T): T {
  return isWeighted(w) ? w.value : w
}

export function isDynamicSigner(signer: ethers.Signer | SequenceWallet | GnosisWallet): signer is SequenceWallet | GnosisWallet {
  return 'isDynamic' in signer && signer.isDynamic
}

const defaultTopology = optimize2SignersTopology

export class SequenceWallet {
  public isDynamic = true
  _isSigner = true

  constructor(public options: WalletOptions) {}

  static detailedWallet(context: SequenceContext, opts: DetailedWalletOptions): SequenceWallet {
    const simplifiedConfig = {
      threshold: opts.threshold,
      checkpoint: getCheckpoint(),
      signers: opts.signers.map((s) => ({
        weight: isWeighted(s) ? s.weight : 1,
        address: (() => { const v = weightedVal(s); return isAnyStaticSigner(v) ? v.address : v })()
      }))
    }

    return new SequenceWallet({
      context,
      encodingOptions: opts.encodingOptions,
      address: opts.address,
      config: {
        ...simplifiedConfig,
        topology: defaultTopology(simplifiedConfig)
      },
      signers: opts.signers.map((s) => weightedVal(s)).filter(isAnyStaticSigner),
    })
  }

  useAddress(address?: string) {
    return new SequenceWallet({ ...this.options, address: address ? address : this.address })
  }

  useConfig(of: SequenceWallet | WalletConfig) {
    const config = 'config' in of ? of.config : of
    return new SequenceWallet({ ...this.options, config })
  }

  useSigners(signers: (ethers.Signer | SequenceWallet)[] | ethers.Signer | SequenceWallet) {
    return new SequenceWallet({ ...this.options, signers: Array.isArray(signers) ? signers : [signers] })
  }

  useEncodingOptions(encodingOptions?: EncodingOptions) {
    return new SequenceWallet({ ...this.options, encodingOptions })
  }

  useChainId(chainId?: ethers.BigNumberish) {
    return new SequenceWallet({ ...this.options, chainId })
  }

  get config() {
    return this.options.config
  }

  get signers() {
    return this.options.signers
  }

  get address() {
    if (this.options.address) return this.options.address
    return addressOf(this.options.context.factory, this.options.context.mainModule, this.imageHash)
  }

  getAddress() {
    return this.address
  }

  get imageHash() {
    return imageHash(this.config)
  }

  async signMessage(message: ethers.BytesLike, chainId?: ethers.BigNumberish): Promise<string> {
    return this.signDigest(ethers.utils.keccak256(ethers.utils.arrayify(message)), chainId)
  }

  async signDigest(digest: ethers.BytesLike, chainId?: ethers.BigNumberish): Promise<string> {
    if (chainId === undefined && this.options.chainId === undefined) {
      return ''
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subdigest = ethers.utils.arrayify(subdigestOf(this.address, digest, (chainId ?? this.options.chainId)!))
    return this.signSubdigest(subdigest)
  }

  staticSubdigestSign(subdigest: ethers.BytesLike, useNoChainId = true): string {
    const signatureType = useNoChainId ? SignatureType.NoChaindDynamic : this.options.encodingOptions?.signatureType
    return encodeSignature(
      this.config,
      [],
      [ ethers.utils.hexlify(subdigest) ],
      { ...this.options.encodingOptions, signatureType }
    )
  }

  async signSubdigest(subdigest: ethers.BytesLike): Promise<string> {
    const sigParts = await Promise.all(this.signers.map(async (s) => {
      if (isDynamicSigner(s)) {
        return {
          address: s.address,
          signature: await s.signDigest(subdigest).then((s) => s + '03'),
          type: SignaturePartType.Dynamic
        }
      }

      return {
        address: await s.getAddress(),
        signature: await s.signMessage(subdigest).then((s) => s + '02'),
        type: SignaturePartType.Signature
      }
    }))

    return encodeSignature(this.config, sigParts, [], this.options.encodingOptions)
  }

  async signTransactions(ptxs: Partial<Transaction>[], nonce: ethers.BigNumberish, chainId: ethers.BigNumberish): Promise<string> {
    const txs = applyTxDefaults(ptxs)
    const digest = digestOf(txs, nonce)
    console.log('tx digest is', digest)

    return this.signDigest(digest, chainId)
  }

  // async relayTransactions(
  //   ptxs: Partial<Transaction>[],
  //   signature: string,
  //   nonce?: ethers.BigNumberish,
  //   overrides: Overrides & { from?: string | Promise<string> } = {}
  // ): Promise<ethers.ContractTransaction> {
  //   if (nonce === undefined) return this.relayTransactions(ptxs, signature, await this.getNonce(), overrides)

  //   const txs = applyTxDefaults(ptxs)

  //   return this.mainModule.execute(txs, nonce, signature, overrides)
  // }

  // async sendTransactions(
  //   ptxs: Partial<Transaction>[],
  //   nonce?: ethers.BigNumberish,
  //   overrides?: Overrides & { from?: string | Promise<string> }
  // ): Promise<ethers.ContractTransaction> {
  //   if (nonce === undefined) return this.sendTransactions(ptxs, await this.getNonce(), overrides)

  //   const txs = applyTxDefaults(ptxs)
  //   const signature = await this.signTransactions(txs, nonce)

  //   return this.relayTransactions(txs, signature, nonce, overrides)
  // }
}
