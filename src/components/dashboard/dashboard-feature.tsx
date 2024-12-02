'use client'

import { AppHero } from '../ui/ui-layout'

export default function DashboardFeature() {
  return (
    <div className="p-4 rounded-md w-full h-full mx-auto flex items-center flex-col justify-center">
      <AppHero title="GM!" subtitle="Welcome to Paskrypt on Solana!" />
      <AppHero title="Paskrypt" subtitle="Create and manage your Passwords!" />
    </div>
  )
}
