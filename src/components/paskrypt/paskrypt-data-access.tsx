'use client'

import {getPaskryptProgram, getPaskryptProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function usePaskryptProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getPaskryptProgramId(cluster.network as Cluster), [cluster])
  const program = getPaskryptProgram(provider)

  const accounts = useQuery({
    queryKey: ['paskrypt', 'all', { cluster }],
    queryFn: () => program.account.paskrypt.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['paskrypt', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ paskrypt: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function usePaskryptProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usePaskryptProgram()

  const accountQuery = useQuery({
    queryKey: ['paskrypt', 'fetch', { cluster, account }],
    queryFn: () => program.account.paskrypt.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['paskrypt', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ paskrypt: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['paskrypt', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ paskrypt: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['paskrypt', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ paskrypt: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['paskrypt', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ paskrypt: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
