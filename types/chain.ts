import { TestnetChainIDs, ChainIDs } from '@communitiesid/id'
import { UnionToNumber } from '@/types'

export type SupportedChainIDs = UnionToNumber<`${ChainIDs}`>
export type SupportedTestnetChainIDs = UnionToNumber<`${TestnetChainIDs}`>

export type TotalSupportedChainIDs = SupportedChainIDs | SupportedTestnetChainIDs

export type RPCKeys = Record<'alchemy' | 'quickNode' | 'chainbase', Record<TotalSupportedChainIDs, string[]>>