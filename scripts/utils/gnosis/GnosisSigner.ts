import type Safe from '@safe-global/protocol-kit'
import type { ethers } from 'ethers'
import { hexlify, toUtf8Bytes } from 'ethers/lib/utils'
import { signGnosisDigest } from '../signature'

export class GnosisWallet {
  public isDynamic = true

  constructor(
    private readonly safe: Safe,
    public address: string,
    private readonly safeSigner: ethers.Wallet,
    private readonly chainId: number,
  ) {}

  getAddress(): Promise<string> {
    return this.safe.getAddress()
  }

  signMessage = async (message: string): Promise<string> => {
    return (await this.safe.signTransactionHash(hexlify(toUtf8Bytes(message))))
      .data
  }

  signDigest = async (digest: ethers.BytesLike): Promise<string> => {
    return await signGnosisDigest(
      this.safe,
      this.safeSigner,
      digest,
      this.chainId,
    )
  }
}
