import { FC, useEffect, useMemo, useState, useCallback } from 'react'

import { useDetails } from '@/contexts/details'
import { searchAddressMember } from '@/shared/useApi';

import InfiniteList from '@/components/common/infiniteList'
import ListCard from '@/components/search/card'
import Empty from '@/components/search/empty'
import Loading from '@/components/loading/list';

import { PersonIdentity } from '@/types';
import { CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP } from '@/shared/constant';

interface Props {
}

const Identities: FC<Props> = () => {
  const { address } = useDetails()
  
  const [loading, setLoading] = useState(true)
  const [identities, setIdentities] = useState<PersonIdentity[]>([])
  const [fetchInfo, setFetchInfo] = useState<{ page: number; pageSize: number; total: number; error?: string }>({ page: 1, pageSize: 20, total: 0 })

  const isEmpty = useMemo(() => {
    return identities.length === 0 && !loading
  }, [loading, identities])

  const noMore = useMemo(() => {
    return fetchInfo.total && (fetchInfo.page - 1) * fetchInfo.pageSize >= fetchInfo.total
  }, [fetchInfo.page, fetchInfo.total])

  async function fetchData({ page, pageSize }: { page: number; pageSize: number }, force = false) {
    if (!address || (!force && noMore)) return
    try {
      setLoading(true)
      const { type, message, list, total } = await searchAddressMember(address, page, pageSize)
      const _list = list.filter(i => !!i.memberInfo)
      setIdentities(pre => page === 1 ? _list : [...pre, ..._list])
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
      <InfiniteList<PersonIdentity>
        className='card-grid grid gap-5'
        items={identities}
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
        renderEmpty={<Empty text='There is no identities under this address.'/>}
      />
    </div>
  )
}

export default Identities