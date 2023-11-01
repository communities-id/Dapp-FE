import {
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet, walletConnectWallet, injectedWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";
import { JoyIdWallet } from '@joyid/rainbowkit'

import { Chain, configureChains, createConfig } from "wagmi";
import { mainnet, polygon, optimism, bsc, base } from 'wagmi/chains'
import { polygonMumbai, goerli, baseGoerli, optimismGoerli, bscTestnet, scrollSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { isTestnet, CHAIN_ID_MAP } from "@/shared/constant";
import { TotalSupportedChainIDs } from '@/types/chain'

export const scroll = {
  id: 534352,
  name: 'Scroll',
  network: 'scroll',
  nativeCurrency: {
    decimals: 18,
    name: 'Scroll',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.scroll.io'], webSocket: ['wss://rpc.scroll.io/ws'] },
    default: { http: ['https://rpc.scroll.io'], webSocket: ['wss://rpc.scroll.io/ws'] },
  },
  blockExplorers: {
    etherscan: { name: 'Blockscout', url: 'https://blockscout.scroll.io' },
    default: { name: 'Blockscout', url: 'https://blockscout.scroll.io' },
  },
} as const satisfies Chain

const _chains: Record<TotalSupportedChainIDs, Chain> = {
  1: mainnet,
  10: optimism,
  56: bsc,
  137: polygon,
  8453: base,
  534352: scroll,
  5: goerli,
  80001: polygonMumbai,
  84531: baseGoerli,
  420: optimismGoerli,
  97: bscTestnet,
  534351: scrollSepolia
}

// 自定义链信息
const supportedChains: Chain[] = Object.values(CHAIN_ID_MAP).map(chainId => _chains[chainId as TotalSupportedChainIDs])
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  [
    publicProvider(),
  ],
  {
    pollingInterval: 15000, // rpc request polling interval
    retryCount: 5, // request retry times
  }
);

const JoyIDOptions = {
  name: 'Communities ID',
  logo: 'https://ipfs.io/ipfs/QmS1EdZjjipmD6oH93sZ1npzRG95PD3EaLt9A2hieNoNoK',
  joyidAppURL: isTestnet ? 'https://testnet.joyid.dev/' : 'https://app.joy.id/'
}

export const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true, projectId: 'Communities.ID' }),
      okxWallet({ chains, shimDisconnect: true, projectId: '1cd28d38251a0d1a92b1c0f014d618eb' }),
      // coinbaseWallet({ appName: 'Communities.ID', chains }),
      JoyIdWallet({ chains, options: JoyIDOptions }),
      walletConnectWallet({
        chains,
        projectId: '1cd28d38251a0d1a92b1c0f014d618eb'
      })
    ]
  },
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});