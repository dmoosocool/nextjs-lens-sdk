'use client'
import { Provider as UrQLProvider } from 'urql'
import { WagmiConfig } from 'wagmi'
import { config as wagmiConfig } from '@/config/wagmiConfig'
import { Toaster } from '@/components/ui/toaster'
import { LensProvider } from '@lens-protocol/react-web'
import { lensConfig } from '@/config/lensconfig'
export default function BaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <LensProvider config={lensConfig}>
        {children}
      </LensProvider>
      <Toaster />
    </WagmiConfig>
  )
}
