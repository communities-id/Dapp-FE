import { ReactNode, useEffect } from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'

import { chains, wagmiConfig } from '@/config/rainbowKit'

interface RainbowKitLayoutProps {
  children: ReactNode
}
export default function RainbowKitLayout({ children }: RainbowKitLayoutProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
  }, [])
  return (
    <RainbowKitProvider chains={chains} initialChain={chains[0]}>
      {children}
    </RainbowKitProvider>
  )
}