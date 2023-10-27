import { FC, useEffect, useMemo, useState, Fragment, useCallback } from 'react'

import useApi from '@/shared/useApi'
import { formatPrice, formatTime, formatTransaction, parseImgSrc } from '@/shared/helper'
import { CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP, SCAN_MAP } from '@/shared/constant'
import { useDetails } from '@/contexts/details'

import InfiniteList from '@/components/common/infiniteList'
import ListCard from '@/components/search/card'
import Empty from '@/components/search/empty'
import Loading from '@/components/loading/list'

import { CommunityMember } from '@/types'

interface Props {
}

const CommunityMembers: FC<Props> = () => {
  const { communityInfo } = useDetails()
  const { getMembersOfCommunity } = useApi()
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [fetchInfo, setFetchInfo] = useState<{ page: number; pageSize: number; total: number; error?: string }>({ page: 1, pageSize: 20, total: 0 })

  const isEmpty = useMemo(() => {
    return members.length === 0 && !loading
  }, [loading, members])

  const noMore = useMemo(() => {
    return fetchInfo.total && (fetchInfo.page - 1) * fetchInfo.pageSize >= fetchInfo.total
  }, [fetchInfo.page, fetchInfo.total])

  async function fetchData({ page, pageSize }: { page: number; pageSize: number }) {
    if (!communityInfo?.node?.registry || noMore) return
    try {
      setLoading(true)
      const { type, message, list, total } = await getMembersOfCommunity(communityInfo.chainId as number, communityInfo.node.registry, page, pageSize)
      setMembers(pre => page === 1 ? list : [...pre, ...list])
      setFetchInfo(prev => ({ ...prev, page: page + 1, total, type, error: message }))
    } catch (error: any) {
      setFetchInfo(prev => ({ ...prev, error: error.message }))
    } finally {
      setLoading(false)
    }
  }

  const loadMore = useCallback(() => {
    if (noMore || loading) return
    fetchData({ page: fetchInfo.page, pageSize: fetchInfo.pageSize })
  }, [noMore, fetchInfo.page, fetchData])

  useEffect(() => {
    fetchData({ page: 1, pageSize: fetchInfo.pageSize })
  }, [])

  return (
    <div className='pt-[10px]'>
      <InfiniteList<CommunityMember>
        className='grid grid-cols-4 gap-5'
        items={members}
        loadMore={loadMore}
        renderItem={(row) => {
          const info = {
            name: row.name,
            avatar: row.memberInfo.tokenUri.image,
            registry: row.registry,
            tokenId: row.tokenId,
          }
          return (
            <ListCard info={info} chainId={CHAIN_ID_MAP[CHAINS_ID_TO_NETWORK[row.chainId]]} />
          )
        }}
        firstLoading={fetchInfo.page === 1 && loading}
        renderFirstLoading={<Loading className=''/>}
        hasMore={!noMore}
        empty={isEmpty}
        renderEmpty={<Empty text={
          <Fragment>
            <p className='text-center'>No User DID found under this Brand DID.</p>
            <p className='mt-4'>Search for a name, ending with <span className='text-mintPurple'>.{communityInfo?.node?.node ?? 'xxx'}</span>, and mint the first User DID for the community.</p>
            <p>Share with your community members and invite them to mint their User DIDs!</p>
          </Fragment>
        }/>}
      />
    </div>
  )
}

export default CommunityMembers