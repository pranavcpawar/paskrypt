'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { useParams } from 'next/navigation'

import { ExplorerLink } from '../cluster/cluster-ui'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])
  if (!address) {
    return <div>Error loading account</div>
  }

  return (
    <div className="p-2 rounded-md w-full h-full mx-auto flex items-center flex-col justify-center">
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="my-4">
            <ExplorerLink className="font-parkinsans" path={`account/${address}`} label={ellipsify(address.toString())} />
          </div>
        }
      >
        <div className="my-4 w-full">
          <AccountButtons address={address} />
        </div>
      </AppHero>
      <div className="space-y-2 mt-2 w-full max-w-4xl mx-auto">
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  )
}
