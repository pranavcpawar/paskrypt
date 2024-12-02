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

interface CreateEntryArgs {
  username: string;
  password: string;
  owner: PublicKey;
}

export function usePaskryptProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getPaskryptProgramId(cluster.network as Cluster), [cluster])
  const program = getPaskryptProgram(provider)

  const accounts = useQuery({
    queryKey: ['paskrypt', 'all', { cluster }],
    queryFn: () => program.account.passwordEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createPasswordEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: [`createPasswordEntry`, `create`, { cluster }],
    mutationFn: async ({ username, password, owner }) => {
      return program.methods.createPasswordEntry(username, password).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Can not create password entry: ${error}`);
    }
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createPasswordEntry
  }
}

export function usePaskryptProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usePaskryptProgram()

  const accountQuery = useQuery({
    queryKey: ['paskrypt', 'fetch', { cluster, account }],
    queryFn: () => program.account.passwordEntryState.fetch(account),
  })

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: [`updatePasswordEntry`, `update`, { cluster }],
    mutationFn: async ({ username, password }) => {
      return program.methods.updatePasswordEntry(username, password).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Can not update password entry: ${error}`);
    }
  });

  const deleteEntry = useMutation<string, Error, { username: string }>({
    mutationKey: [`deletePasswordEntry`, `delete`, { cluster }],
    mutationFn: ({ username }) => {
      return program.methods.deletePasswordEntry(username).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Can not delete password entry: ${error}`);
    }
  });

  return {
    accountQuery,
    updateEntry,
    deleteEntry
  };
}
