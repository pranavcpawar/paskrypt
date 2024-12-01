import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Paskrypt} from '../target/types/paskrypt'

describe('paskrypt', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Paskrypt as Program<Paskrypt>

  const paskryptKeypair = Keypair.generate()

  it('Initialize Paskrypt', async () => {
    await program.methods
      .initialize()
      .accounts({
        paskrypt: paskryptKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([paskryptKeypair])
      .rpc()

    const currentCount = await program.account.paskrypt.fetch(paskryptKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Paskrypt', async () => {
    await program.methods.increment().accounts({ paskrypt: paskryptKeypair.publicKey }).rpc()

    const currentCount = await program.account.paskrypt.fetch(paskryptKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Paskrypt Again', async () => {
    await program.methods.increment().accounts({ paskrypt: paskryptKeypair.publicKey }).rpc()

    const currentCount = await program.account.paskrypt.fetch(paskryptKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Paskrypt', async () => {
    await program.methods.decrement().accounts({ paskrypt: paskryptKeypair.publicKey }).rpc()

    const currentCount = await program.account.paskrypt.fetch(paskryptKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set paskrypt value', async () => {
    await program.methods.set(42).accounts({ paskrypt: paskryptKeypair.publicKey }).rpc()

    const currentCount = await program.account.paskrypt.fetch(paskryptKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the paskrypt account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        paskrypt: paskryptKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.paskrypt.fetchNullable(paskryptKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
