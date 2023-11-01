import { ABIs as abis } from '@communitiesid/id'
import mainnetConfig from './constant-mainnet'
import testnetConfig from './constant-testnet'
import { getSDKOptions } from '@/utils/provider'

import { MintMode, SequenceMode } from '@/types/contract'

export const DEFAULT_AVATAR = 'ipfs://QmSYEgebBb8PWfsJkdtYQJsXWDTvTAXwjNN5VPYteJZhrw'

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ONE_ADDRESS = "0x0000000000000000000000000000000000000001";
export const ABIs = abis

export const ERROR_MAP: any = {
  '0xcfb3b942': 'ApprovalCallerNotOwnerNorApproved',
  '0x04abfdf5': 'ErrUnreachableCode',
  '0x11845c21': 'ErrForbidden',
  '0xcca1fbcd': 'ErrOnlySignatureMint',
  '0x59c896be': 'TransferCallerNotOwnerNorApproved',
  '0x0df85d3f': 'ErrInvalidNode',
  '0x8aea548b': 'ErrInvalidBalance',
  '0x8f4eb604': 'BalanceQueryForZeroAddress',
  '0x00d58153': 'OwnershipNotInitializedForExtraData',
  '0xeb18674f': 'ErrThresholdLimited',
  '0x3a37a418': 'ErrInvalidAttribute',
  '0x6740ff0a': 'ErrKeyIsNotAllowed',
  '0xcc12cef6': 'ErrUnauthorized',
  '0x4041c54e': 'ErrInvalidArguments',
  '0xdf2d9b42': 'OwnerQueryForNonexistentToken',
  '0xd1a57ed6': 'TransferToNonERC721ReceiverImplementer',
  '0x80ea1cc7': 'ErrPriceModelImmutable',
  '0xea553b34': 'TransferToZeroAddress',
  '0xa14c4b50': 'URIQueryForNonexistentToken',
  '0x3ff0f4f4': 'ErrSignatureDeadlineExceed',
  '0xcf4700e4': 'ApprovalQueryForNonexistentToken',
  '0xdc3bc1f3': 'ErrInvalidBaseNode',
  '0xda543657': 'ErrUnexpectedNodeState',
  '0x3db1f9af': 'MintERC2309QuantityExceedsLimit',
  '0x2e076300': 'MintToZeroAddress',
  '0x34afade1': 'ErrRegistryIsActive',
  '0xe3e9d239': 'ErrSignatureMintDisabled',
  '0xe7f0eab5': 'ErrWrongOmniNodeState',
  '0x4eebc1aa': 'ErrOnlyOwner',
  '0xedf82445': 'ErrInvalidSwapValue',
  '0x4842276b': 'ErrInvalidaNode',
  '0x007afbbb': 'ErrUnknownPriceModelMode',
  '0x8a23d533': 'ErrInvalidBalance',
  '0x98c96854': 'ErrInvalidSignature',
  '0x21fdc356': 'ErrNotPermitted',
  '0x6e5731bc': 'ErrHoldingMintDisabled',
  '0xc1968ea5': 'ErrPublicMintDisabled',
  '0xb562e8dd': 'MintZeroQuantity',
  '0xa1148100': 'TransferFromIncorrectOwner',
  '0xe59b1069': 'ErrOmniNodeIsBeingProtected',
  '0xdeec5d41': 'ErrInvalidHoldingProof',
  '0x68b3ecb6': 'ErrNotImplemented',
}

export const MintModeMap: Record<MintMode, string> = {
  [MintMode.SIGNATURE]: 'Invited mint',
  [MintMode.PUBLIC]: 'Public mint',
  [MintMode.HOLDING]: 'Holding mint',
}

export const SequenceModeMap: Record<SequenceMode, string> = {
  [SequenceMode.INPUT_VALUE]: 'Input Value',
  [SequenceMode.BURN_INDEX]: 'Burn Index',
  [SequenceMode.TOTAL_SUPPLY]: 'Total Supply',
}

export const TG_BOT_ID = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 6453902730 : 6537772128
export const TG_BOT_NAME =  process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'CommunitiesID_testnet_bot': 'CommunitiesIDbot'

export const testGoreliERC20TokenAddress = '0x638E124448196C34cf03C35c6024038d765eEeFa'
export const maxApproveValue = '115792089237316195423570985008687907853269984665640564039457'

export const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true'
const constants = isTestnet ? testnetConfig : mainnetConfig
export const CHAIN_ID = constants.CHAIN_ID
export const MAIN_CHAIN = constants.MAIN_CHAIN
export const MAIN_CHAIN_ID = constants.MAIN_CHAIN_ID
export const OMNINODE_PROTECT_TIME = constants.OMNINODE_PROTECT_TIME
export const CHAIN_ID_MAP = constants.CHAIN_ID_MAP
export const CHAINS_NETWORK_TO_ID = constants.CHAINS_NETWORK_TO_ID
export const CHAINS_ID_TO_NETWORK = constants.CHAINS_ID_TO_NETWORK
export const CONTRACT_MAP = constants.CONTRACT_MAP
export const DEFAULT_TOKEN_SYMBOL = constants.DEFAULT_TOKEN_SYMBOL
export const SCAN_MAP = constants.SCAN_MAP
export const CHAINS_MINT_TOOLTIPS = constants.CHAINS_MINT_TOOLTIPS
export const SDK_OPTIONS = getSDKOptions()