import { FC, useEffect, useMemo, useState, Fragment, useCallback } from 'react'
import { styled } from '@mui/system'

import useApi from '@/shared/useApi'
import { CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP } from '@/shared/constant'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'

import { Tabs, TabsList } from '@mui/base'
import Tab from '@/components/common/tab'
import InfiniteList from '@/components/common/infiniteList'
import ListCard from '@/components/search/card'
import Loading from '@/components/loading/list'
import PlusIconWithColor from '@/components/common/PlusWithColor'

import { CommunityMember } from '@/types'
import themeColor from '@/_themes/colors'

import MintSettingIcon from '~@/icons/mint-settings.svg'


interface Props {
}

const CommunityMembers: FC<Props> = () => {
  const { showGlobalDialog } = useGlobalDialog()
  const { communityInfo, communityInfoSet } = useDetails()
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

  const pendingMintSet = useMemo(() => {
    const { config } = communityInfo
    return !config?.publicMint && !config?.signatureMint && !config?.holdingMint
  }, [communityInfo])

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


  const BrandColorButton = styled('button')({
    color: communityInfo.tokenUri?.brand_color || themeColor.primary,
    '&:hover': {
      backgroundColor: `${communityInfo.tokenUri?.brand_color || themeColor.primary}1A`
    }
  });

  return (
    <div className='pt-[10px]'>
      <Tabs defaultValue={0}>
        <TabsList className='pt-[10px] pb-6'>
          <Tab value={0}>
            User DID
          </Tab>
        </TabsList>
      </Tabs>
      <InfiniteList<CommunityMember>
        className='card-grid grid gap-5'
        items={[{} as CommunityMember, ...members]}
        loadMore={loadMore}
        renderItem={(row: CommunityMember, index?: number) => {
          if (index === 0) {
            return (
              <BrandColorButton
                className='group border-2 border-dashed w-full h-full rounded-[8px] flex flex-col items-center justify-center text-primary relative py-25'
                style={{
                  color: communityInfo.tokenUri?.brand_color,
                }}
                onClick={() => {
                  showGlobalDialog('member-mint', { brandName: communityInfo.node?.node, brandInfo: communityInfo })
                }}
              >
                <div>
                  <PlusIconWithColor color={communityInfo.tokenUri?.brand_color ?? ''} />
                </div>
                <div className="mt-2.5">Join Community</div>
              </BrandColorButton>
            )
          }
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
        renderEmpty={
            pendingMintSet ? (
              <div
                className='border-2 border-dashed w-full h-[306px] rounded-[8px] flex flex-col items-center justify-center text-primary relative'
                style={{
                  color: communityInfo.tokenUri?.brand_color,
                }}
              >
                <div>
                  Mint setting has not finished yet, user cannot join this brand now
                </div>
                { communityInfoSet.isOwner && (
                  <button
                    className="button-md btn-primary text-white mt-5"
                    onClick={() => {
                      showGlobalDialog('brand-manage-setting', { brandName: communityInfo.node?.node, brandInfo: communityInfo })
                    }}
                  >
                    <MintSettingIcon className="mr-1.5" />
                    <span>Update mint setting</span>
                  </button>
                )
                }
              </div>
            ) : (
              <BrandColorButton
                className='group border-2 border-dashed w-full h-[306px] rounded-[8px] flex flex-col items-center justify-center text-primary relative'
                style={{
                  color: communityInfo.tokenUri?.brand_color,
                }}
                onClick={() => {
                  showGlobalDialog('member-mint', { brandName: communityInfo.node?.node, brandInfo: communityInfo })
                }}
              >
                <div>
                  <PlusIconWithColor color={communityInfo.tokenUri?.brand_color ?? ''} />
                </div>
                <div className="mt-2.5">Join Community</div>
              </BrandColorButton>
            )
          }
      />
    </div>
  )
}

export default CommunityMembers