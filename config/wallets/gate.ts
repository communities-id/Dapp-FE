import {
  Wallet,
  getWalletConnectConnector
} from "@rainbow-me/rainbowkit";
import { WalletConnectConnectorOptions } from "@rainbow-me/rainbowkit/dist/wallets/getWalletConnectConnector";
import { Chain } from "wagmi";
import { GateWalletConnector } from '../connectors/gate'

export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
  walletConnectVersion?: '2';
  walletConnectOptions?: WalletConnectConnectorOptions;
}

export const gateIOWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = '2',
}: MyWalletOptions): Wallet => {
  let gateEtheruem = typeof window !== 'undefined' ? (window as any).gatewallet : undefined;
  const isGateWalletInjected = typeof gateEtheruem !== 'undefined';
  const shouldUseWalletConnect = !isGateWalletInjected;
  return ({
    id: 'my-wallet',
    name: 'Gate Wallet',
    iconUrl: '/icons/wallet/gate.svg',
    iconBackground: 'transparent',
    // installed: !shouldUseWalletConnect ? isGateWalletInjected : undefined,
    installed: isGateWalletInjected,
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=com.gateio.gateio',
      ios: 'https://apps.apple.com/gb/app/gate-io-buy-btc-eth-shib/id1294998195%7Chttps://testflight.apple.com/join/SGq28113',
      chrome: 'https://chromewebstore.google.com/detail/gate-web3-%E9%92%B1%E5%8C%85/cpmkedoipcpimgecpmgpldfpohjplkpp?hl=zh-CN&utm_source=ext_sidebar',
      qrCode: '/icons/wallet/gate-qr.png',
    },
    createConnector: () => {
      const connector: any = shouldUseWalletConnect
      ? getWalletConnectConnector({
          chains,
          projectId,
          options: walletConnectOptions,
          version: walletConnectVersion,
        })
      : new GateWalletConnector({ chains } as any);

      // const getUri = async () => {
      //   const uri = await getWalletConnectUri(connector, walletConnectVersion);
      //   return isMobile()
      //     ? `tpoutside://wc?uri=${encodeURIComponent(uri)}`
      //     : uri;
      // };

      // Gate Wallet not support in wallet connect
      const getUri = undefined

      return {
        connector,
        mobile: {
          // getUri: shouldUseWalletConnect ? getUri : undefined,
          getUri
        },
        qrCode: undefined,
        // qrCode: shouldUseWalletConnect
        //   ? {
        //       getUri,
        //       instructions: {
        //         learnMoreUrl: 'https://www.gate.io/web3',
        //         steps: [
        //           {
        //             description:
        //               'wallet_connectors.token_pocket.qr_code.step1.description',
        //             step: 'install',
        //             title: 'wallet_connectors.token_pocket.qr_code.step1.title',
        //           },
        //           {
        //             description:
        //               'wallet_connectors.token_pocket.qr_code.step2.description',
        //             step: 'create',
        //             title: 'wallet_connectors.token_pocket.qr_code.step2.title',
        //           },
        //           {
        //             description:
        //               'wallet_connectors.token_pocket.qr_code.step3.description',
        //             step: 'scan',
        //             title: 'wallet_connectors.token_pocket.qr_code.step3.title',
        //           },
        //         ],
        //       },
        //     }
        //   : undefined,
        extension: {
          instructions: {
            learnMoreUrl: 'https://www.gate.io/web3',
            steps: []
            // steps: [
            //   {
            //     description:
            //       'wallet_connectors.token_pocket.extension.step1.description',
            //     step: 'install',
            //     title: 'wallet_connectors.token_pocket.extension.step1.title',
            //   },
            //   {
            //     description:
            //       'wallet_connectors.token_pocket.extension.step2.description',
            //     step: 'create',
            //     title: 'wallet_connectors.token_pocket.extension.step2.title',
            //   },
            //   {
            //     description:
            //       'wallet_connectors.token_pocket.extension.step3.description',
            //     step: 'refresh',
            //     title: 'wallet_connectors.token_pocket.extension.step3.title',
            //   },
            // ],
          },
        },
      };
    },
  })
};