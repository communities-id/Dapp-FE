import { useAccount } from "wagmi"

export default function useWallet() {
  const { address, isConnected } = useAccount()

  const isMetaMaskInjected =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

  return {
    isMetaMaskInjected,
    account: address,
    isConnected,
    inWhiteList: true
  }
}