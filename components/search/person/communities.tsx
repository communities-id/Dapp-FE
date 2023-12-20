import { FC, useEffect, useMemo, useState, Fragment, useCallback } from 'react'
import Link from 'next/link';

import { useDetails } from '@/contexts/details'
import { searchAddressCommunity } from '@/shared/useApi';
import { CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP, CONTRACT_MAP } from '@/shared/constant'

import InfiniteList from '@/components/common/infiniteList'
import ListCard from '@/components/search/card'
import Empty from '@/components/search/empty'
import Loading from '@/components/loading/list'

import { PersonCommunity } from '@/types';

interface Props {
}

const Communities: FC<Props> = () => {
  const { address } = useDetails()
  
  const [loading, setLoading] = useState(true)
  const [communities, setCommunities] = useState<PersonCommunity[]>([])
  const [fetchInfo, setFetchInfo] = useState<{ page: number; pageSize: number; total: number; error?: string }>({ page: 1, pageSize: 20, total: 0 })

  const isEmpty = useMemo(() => {
    return communities.length === 0 && !loading
  }, [loading, communities])

  const noMore = useMemo(() => {
    return fetchInfo.total && (fetchInfo.page - 1) * fetchInfo.pageSize >= fetchInfo.total
  }, [fetchInfo.page, fetchInfo.total])

  async function fetchData({ page, pageSize }: { page: number; pageSize: number }, force = false) {
    if (!address || (!force && noMore)) return
    try {
      setLoading(true)
      const { type, message, list, total } = await searchAddressCommunity(address, page, pageSize)
      const _list = list.filter(i => !!i.communityInfo)
      setCommunities(pre => page === 1 ? _list : [...pre, ..._list])
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
    if (!address) return
    fetchData({ page: 1, pageSize: fetchInfo.pageSize }, true)
    setFetchInfo(prev => ({ ...prev, page: 1 }))
  }, [address])

  
  return (
    <div className=''>
      <InfiniteList<PersonCommunity>
        className='card-grid grid gap-5'
        items={communities}
        loadMore={loadMore}
        renderItem={(row) => {
          if (!row.communityInfo) return <></>
          const info = {
            name: row.name,
            avatar: row.communityInfo.tokenUri?.image ?? '',
            registry: CONTRACT_MAP[row.chainId].CommunityRegistry,
            tokenId: row.communityInfo.node?.tokenId
          }
          const link = `/community/${info.name}`
          return (
            <Link href={link}>
              <ListCard
                info={info}
                noOpensea={!row.communityInfo.totalSupply}
                chainId={row.chainId} />
              </Link>
          )
        }}
        firstLoading={fetchInfo.page === 1 && loading}
        renderFirstLoading={<Loading className=''/>}
        hasMore={!noMore}
        empty={isEmpty}
        renderEmpty={<Empty text='There is no communities under this address.'/>}
      />
    </div>
  )
}

export default Communities