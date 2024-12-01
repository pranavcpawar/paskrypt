// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import PaskryptIDL from '../target/idl/paskrypt.json'
import type { Paskrypt } from '../target/types/paskrypt'

// Re-export the generated IDL and type
export { Paskrypt, PaskryptIDL }

// The programId is imported from the program IDL.
export const PASKRYPT_PROGRAM_ID = new PublicKey(PaskryptIDL.address)

// This is a helper function to get the Paskrypt Anchor program.
export function getPaskryptProgram(provider: AnchorProvider) {
  return new Program(PaskryptIDL as Paskrypt, provider)
}

// This is a helper function to get the program ID for the Paskrypt program depending on the cluster.
export function getPaskryptProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Paskrypt program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return PASKRYPT_PROGRAM_ID
  }
}
