import { BrandDID, UserDID } from '@communitiesid/id'
import { BigNumber } from 'ethers'

export enum State {
  FREE = 0, // unregist
  LOCK,
  HOLD, // registed
  RESERVED, // reserved for renew
  EXPIRED // expired
}

export enum SearchMode {
  unknown = 0,
  community = 1,
  member = 2,
  address = 3,
}

export type SearchModeType = keyof typeof SearchMode

export interface CommunityNode {
  createTime: number
  expireTime: number
  label: string // community name
  registry: string // community contract address
  registryInterface: string // community interface contract address
  registTime: number // community regist time, mutable time
  tokenId: number // community token id
}

export interface CommunityInfo extends BrandDID {
  _chaninId: number
  coinSymbol: string // coin symbol when mint members
  communityCoinSymbol: string // coin symbol when mintd community
  mintPrice: BigNumber // member mint price
  tgGroupId: string //Telegram group id
  tokenUri: BrandDID["tokenUri"] & { // community custom info
    attr: Record<string, BigNumber | number | string>
  }
}

export interface MemberInfo extends UserDID {
  isPrimary: boolean
  tokenUri: BrandDID["tokenUri"] & {
    attr: Record<string, BigNumber | number | string>
  }
}

export interface CommunityMember {
  name: string
  blockNumber: string
  blockTimestamp: string
  chainId: number
  from: string
  id: string
  price: string
  to: string
  tokenId: number
  transactionHash: string
  registry: string
  memberInfo: UserDID
}

export interface PersonIdentity {
  name: string
  blockNumber: string
  blockTimestamp: string
  chainId: number
  from: string
  id: string
  price: string
  to: string
  tokenId: number
  transactionHash: string
  registry: string
  memberInfo: UserDID
}

export interface PersonCommunity {
  name: string
  blockNumber: string
  blockTimestamp: string
  chainId: number
  from: string
  id: string
  latestBlock: string
  pool: string
  price: string
  registry: string
  to: string
  tokenId: number
  transactionHash: string
  communityInfo: BrandDID
}

export type UnionToNumber<S> = S extends `${infer N extends number}` ? N : never