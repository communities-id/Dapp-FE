import { EIP1193Provider } from "viem";

type InjectedProviderFlags = {
  isApexWallet?: true;
  isAvalanche?: true;
  isBackpack?: true;
  isBifrost?: true;
  isBitKeep?: true;
  isBitski?: true;
  isBlockWallet?: true;
  isBraveWallet?: true;
  isCoinbaseWallet?: true;
  isDawn?: true;
  isDefiant?: true;
  isEnkrypt?: true;
  isExodus?: true;
  isFrame?: true;
  isFrontier?: true;
  isGamestop?: true;
  isHyperPay?: true;
  isImToken?: true;
  isKuCoinWallet?: true;
  isMathWallet?: true;
  isMetaMask?: true;
  isOkxWallet?: true;
  isOKExWallet?: true;
  isOneInchAndroidWallet?: true;
  isOneInchIOSWallet?: true;
  isOpera?: true;
  isPhantom?: true;
  isPortal?: true;
  isRabby?: true;
  isRainbow?: true;
  isStatus?: true;
  isTalisman?: true;
  isTally?: true;
  isTokenPocket?: true;
  isTokenary?: true;
  isTrust?: true;
  isTrustWallet?: true;
  isXDEFI?: true;
  isZerion?: true;
  isHaloWallet?: true;
};
type InjectedProviders = InjectedProviderFlags & {
  isMetaMask: true;
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void;
  };
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[];
    initialized?: boolean;
    isConnected?: boolean;
    isPermanentlyDisconnected?: boolean;
    isUnlocked?: boolean;
  };
};
interface WindowProvider extends InjectedProviders {
  providers?: WindowProvider[];
}

declare global {
  interface Window {
    ethereum?: WindowProvider;
  }
}
