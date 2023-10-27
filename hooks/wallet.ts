import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

export const useWallet = () => {
  const { connector, isConnected } = useAccount()

  const isProviderReady = useMemo(() => {
    return isConnected && Boolean(connector?.getProvider)
  }, [connector, isConnected])

  const getSigner = async () => {
    const provider = await connector?.getProvider()
    if (!provider) {
      return
    }
    return new ethers.providers.Web3Provider(provider).getSigner()
  }
  
  return {
    ...(useAccount() ?? {}),
    getSigner,
    isProviderReady,
  }
}