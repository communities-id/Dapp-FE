import { Chain, WindowProvider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected"
import { InjectedConnectorOptions, ConnectorNotFoundError } from "@wagmi/core"

export type GateWalletConnectorOptions = Pick<
  InjectedConnectorOptions,
  'shimDisconnect'
> & {
  /**
   * While "disconnected" with `shimDisconnect`, allows user to select a different GateWallet account (than the currently connected account) when trying to connect.
   */
  UNSTABLE_shimOnConnectSelectAccount?: boolean
}

export class GateWalletConnector extends InjectedConnector {
  readonly id = 'gatewallet'

  protected shimDisconnectKey = `${this.id}.shimDisconnect`

  UNSTABLE_shimOnConnectSelectAccount: GateWalletConnectorOptions['UNSTABLE_shimOnConnectSelectAccount']

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[]
    options?: GateWalletConnectorOptions
  } = {}) {
    const options = {
      name: 'Gate Wallet',
      shimDisconnect: true,
      getProvider() {
        function getReady(gatewallet?: WindowProvider & { isWeb3Wallet?: boolean }) {
          const isGateWallet = !!gatewallet?.isWeb3Wallet
          if (!isGateWallet) return
          // Brave tries to make itself look like GateWallet
          // Could also try RPC `web3_clientVersion` if following is unreliable
          if (gatewallet.isBraveWallet && !gatewallet._events && !gatewallet._state)
            return
          // if (gatewallet.isApexWallet) return
          // if (gatewallet.isAvalanche) return
          // if (gatewallet.isBitKeep) return
          // if (gatewallet.isBlockWallet) return
          // if (gatewallet.isCoin98) return
          // if (gatewallet.isFordefi) return
          // if (gatewallet.isMathWallet) return
          // if (gatewallet.isOkxWallet || gatewallet.isOKExWallet) return
          // if (gatewallet.isOneInchIOSWallet || gatewallet.isOneInchAndroidWallet)
          //   return
          // if (gatewallet.isOpera) return
          // if (gatewallet.isPortal) return
          // if (gatewallet.isRabby) return
          // if (gatewallet.isDefiant) return
          // if (gatewallet.isTokenPocket) return
          // if (gatewallet.isTokenary) return
          // if (gatewallet.isZeal) return
          // if (gatewallet.isZerion) return
          return gatewallet
        }

        if (typeof window === 'undefined') return
        const gatewallet = (window as unknown as { gatewallet?: WindowProvider })
          .gatewallet
        if (gatewallet?.providers) return gatewallet.providers.find(getReady)
        return getReady(gatewallet)
      },
      ...options_,
    }
    super({ chains, options })

    this.UNSTABLE_shimOnConnectSelectAccount =
      options.UNSTABLE_shimOnConnectSelectAccount
  }
}