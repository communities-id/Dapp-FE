// import { Container, Box } from '@mui/base'
import { Fragment, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import useAccount from '@/shared/useWallet'

import SearchHeaderInfo from '@/components/search/pageInfo'
import SearchContent from '@/components/search/pageContent'
import SearchHeader from '@/components/solid/SearchHeader'
import WalletConnect from '@/components/search/connect'
import WrongChain from '@/components/search/wrongChain'

const TransitRule = () => {
  const router = useRouter()
  const { account } = useAccount()

  useEffect(() => {
    if (account) {
      router.replace(`/address/${account}/connect`)
    }
  }, [account])
  return null
}

export default function ConnectTransit() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  return (
    <Fragment>
      <SearchHeader/>
        {
          mounted && <ConnectButton.Custom>
            {
              ({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted: connectMounted,
              }) => {
                const connected = connectMounted && account && chain
                if (!connected && connectMounted) {
                  return (
                    <WalletConnect handleConnect={() => {
                      openConnectModal()
                    }} />
                  )
                }
                if (chain?.unsupported) {
                  return (
                    <WrongChain handleConnect={() => {
                      openChainModal()
                    }} />
                  )
                }
                return (
                  <main className='min-h-screen bg-[#FAFAFA]'>
                    <header className='bg-white relative z-1'>
                      <SearchHeaderInfo />
                    </header>
                    <TransitRule/>
                  </main>
                )
              }
            }
          </ConnectButton.Custom>
        }
    </Fragment>
  )
}