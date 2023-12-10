import {
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet, walletConnectWallet, injectedWallet, okxWallet, tokenPocketWallet } from "@rainbow-me/rainbowkit/wallets";
import { JoyIdWallet } from '@joyid/rainbowkit'

import { Chain, configureChains, createConfig } from "wagmi";
import { mainnet, polygon, optimism, bsc, base } from 'wagmi/chains'
import { polygonMumbai, goerli, baseGoerli, optimismGoerli, bscTestnet, scrollSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { isTestnet, CHAIN_ID_MAP } from "@/shared/constant";
import { ChainIDs, TestnetChainIDs } from "@communitiesid/id"

import { TotalSupportedChainIDs } from '@/types/chain'

interface ChainConfigOptions {
  currency: {
    name: string
    symbol?: string
    decimals?: number
  }
  rpc: {
    http: string
    wss: string
  }
  scan: {
    name: string
    url: string
  }
  network: string
}

const generateChainConfig = (id: number, name: string, options: ChainConfigOptions) => {
  const { currency, rpc, scan, network } = options

  return {
    id,
    name,
    network,
    nativeCurrency: {
      decimals: 18,
      symbol: 'ETH',
      ...currency
    },
    rpcUrls: {
      public: { http: [rpc.http], webSocket: [rpc.wss] },
      default: { http: [rpc.http], webSocket: [rpc.wss] },
    },
    blockExplorers: {
      etherscan: scan,
      default: scan,
    },
  } as const satisfies Chain
}

export const scroll = generateChainConfig(ChainIDs.Scroll, 'scroll', {
  network: 'scroll',
  currency: {
    name: 'Scroll',
    symbol: 'ETH',
    decimals: 18
  },
  rpc: {
    http: 'https://rpc.scroll.io',
    wss: 'wss://rpc.scroll.io/ws'
  },
  scan: {
    name: 'Blockscout',
    url: 'https://blockscout.com/astar'
  }
})

export const Astar = generateChainConfig(ChainIDs.Astar, 'Astar', {
  network: 'astar ',
  currency: {
    name: 'Astar',
    symbol: 'ASTR',
    decimals: 18
  },
  rpc: {
    http: 'https://evm.astar.network',
    wss: ' wss://rpc.astar.network'
  },
  scan: {
    name: 'AstarScan',
    url: 'https://astar.subscan.io/'
  }
})

export const zKatana = generateChainConfig(TestnetChainIDs["zKatana Testnet"], 'zKatana', {
  network: 'zKatana ',
  currency: {
    name: 'zKatana',
    symbol: 'ETH',
    decimals: 18
  },
  rpc: {
    http: 'https://rpc.startale.com/zkatana',
    wss: 'wss://rpc.startale.com/zkatana'
  },
  scan: {
    name: 'AstarScan',
    url: 'https://zkatana.explorer.startale.com/'
  }
})

const _chains: Record<TotalSupportedChainIDs, Chain> = {
  [ChainIDs.Ethereum]: mainnet,
  [ChainIDs.OP]: optimism,
  [ChainIDs.BSC]: bsc,
  [ChainIDs.Polygon]: polygon,
  [ChainIDs.Base]: base,
  [ChainIDs.Scroll]: scroll,
  [ChainIDs.Astar]: Astar,
  [TestnetChainIDs.Goerli]: goerli,
  [TestnetChainIDs["Polygon Mumbai"]]: polygonMumbai,
  [TestnetChainIDs["Base Goerli Testnet"]]: baseGoerli,
  [TestnetChainIDs["Optimism Goerli Testnet"]]: optimismGoerli,
  [TestnetChainIDs["BNB Smart Chain Testnet"]]: bscTestnet,
  [TestnetChainIDs["Scroll Sepolia Testnet"]]: scrollSepolia,
  [TestnetChainIDs["zKatana Testnet"]]: zKatana,
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
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true, projectId: 'Communities.ID' }),
      // coinbaseWallet({ appName: 'Communities.ID', chains }),
      JoyIdWallet({ chains, options: JoyIDOptions }),
      tokenPocketWallet({ chains, shimDisconnect: true, projectId: 'Communities.ID' }),
    ]
  },
  {
    groupName: 'Popular',
    wallets: [
      okxWallet({ chains, shimDisconnect: true, projectId: '1cd28d38251a0d1a92b1c0f014d618eb' }),
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