import { BigNumber } from 'ethers'
import { ABIs } from '@/shared/constant'

export enum ContractVerison {
  V1 = 1,
  V2,
  V3
}

export enum MintMode {
  SIGNATURE = 1,
  PUBLIC = 2,
  HOLDING = 3
}

export enum MintModeLabels {
  SIGNATURE = 'Invited mint',
  PUBLIC = 'Public mint',
  HOLDING = 'Holding mint',
}

export enum SequenceMode {
  INPUT_VALUE = 0,
  BURN_INDEX = 1,
  TOTAL_SUPPLY = 2
}

export enum SequenceModeLabels {
  INPUT_VALUE = 'Input Value',
  BURN_INDEX = 'Burn Index',
  TOTAL_SUPPLY = 'Total Supply',
}

export enum PriceMode {
  CONSTANT = 1,
  LINEAR = 2,
  EXPONENTIAL = 3,
  SQUARE = 4
}

export enum PriceModeLabels {
  CONSTANT = 'Constant',
  LINEAR = 'Linear',
  EXPONENTIAL = 'Exponential',
  SQUARE = 'Square'
}

export type PriceModeKeys = keyof typeof PriceMode

export interface ContractAddresses {
  BaseNodeValidator: string,
  SubNodeValidator: string,
  CommunityTokenURIValidator: string,
  CommunityTokenURI: string,
  CommunityRegistry: string,
  MemberRouter: string,
  MemberProtocolFee: string,
  MemberRegistry: string,
  MemberTokenomics: string,
  MemberTokenURI: string,
  CommunityRegistryInterface: string,
  RelayerReplicaCommunityRegistryInterface: string,
  RelayerCommunityRegistryInterface: string,
  MemberRegistryInterfaceFactory: string,
  TextRecord: string,
  PrimaryRecord: string,
}

export type ContractAddressesKeys = keyof ContractAddresses
export type ABIKeys = keyof typeof ABIs

export interface CommunityMemberConfig {
  reserveDuration: number
  burnAnytime: boolean
}

export interface CommunityMintConfig {
  signatureMint: boolean
  publicMint: boolean
  holdingMint: boolean
  proofOfHolding: string
  signer: string
  coin: string
  sequenceMode?: SequenceMode
  durationUnit?: number
}

export interface CommunityPrice<T = string> {
  mode: PriceMode
  commissionRate: number
  a: T
  b: T
  c: T
  d: T
}
