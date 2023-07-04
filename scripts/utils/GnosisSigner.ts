import type Safe from "@safe-global/protocol-kit"
import { ethers } from "ethers"
import { defineReadOnly } from "@ethersproject/properties";
import { hexlify, toUtf8Bytes } from "ethers/lib/utils"

export class GnosisSigner extends ethers.Signer {
	constructor(private readonly safe: Safe) {
		super()
		defineReadOnly(this, "_isSigner", true);
	}

	getAddress(): Promise<string> {
		return this.safe.getAddress()
	}

	signMessage = async (message: string): Promise<string> => {
		return (await this.safe.signTransactionHash(hexlify(toUtf8Bytes(message)))).data
	}

	sendTransaction = async (/*transaction: ethers.providers.TransactionRequest*/): Promise<ethers.providers.TransactionResponse> => {
		// return this.safe.executeTransaction(transaction)
		throw new Error("Method not implemented.")
	}

	signTransaction(/*transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>*/): Promise<string> {
		throw new Error("Method not implemented.")
	}

	connect(/*provider: ethers.providers.Provider*/): ethers.Signer {
		throw new Error("Method not implemented.")
	}
}
