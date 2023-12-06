import { FC, useEffect, useMemo, useState, Fragment, useCallback, CSSProperties } from 'react'
import { styled } from '@mui/system'

import useApi from '@/shared/useApi'
import { CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP } from '@/shared/constant'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { useDIDContent } from '@/hooks/content'

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
  const { brandNotLoaded } = useDIDContent({ brandName: communityInfo.node?.node, brandInfo: communityInfo })

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

  const brandColor = communityInfo.tokenUri?.brand_color || themeColor.primary
  const BrandColorButtonCard = styled('button')({
    color: brandColor,
    '&:hover': {
      backgroundColor: `${brandColor}1A`
    }
  });

  const BrandColorButton = styled('button')({
    backgroundColor: brandColor,
    '&:hover': {
      backgroundColor: `${brandColor}cc`
    }
  });


  return (
    <div className='mb-12'>
      <Tabs defaultValue={0} style={{ '--var-brand-color': brandColor } as CSSProperties}>
        <TabsList className='pt-[20px] pb-6 sm:pt-0 sm:pb-3'>
          <Tab value={0}>
            User DID
          </Tab>
        </TabsList>
      </Tabs>
      <InfiniteList<CommunityMember>
        className='card-grid grid gap-5'
        items={[{} as CommunityMember, ...((members.length === 20 && !noMore) ? members.slice(0, members.length - 1) : members)]}
        loadMore={loadMore}
        renderItem={(row: CommunityMember, index?: number) => {
          if (index === 0) {
            return (
              <BrandColorButtonCard
                className='group border-2 border-dashed w-full h-full rounded-[20px] flex flex-col items-center justify-center text-primary relative bg-white'
                style={{
                  color: communityInfo.tokenUri?.brand_color,
                }}
                onClick={() => {
                  showGlobalDialog('member-mint', { brandName: communityInfo.node?.node, brandInfo: communityInfo, options: {} })
                }}
              >
                <div>
                  <PlusIconWithColor color={brandColor} />
                </div>
                <div className="mt-2.5">Join Community</div>
              </BrandColorButtonCard>
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
          brandNotLoaded ? (
            <div
              className='border-2 border-dashed w-full h-[306px] rounded-[20px] flex flex-col items-center justify-center text-primary relative bg-white'
              style={{
                color: brandColor,
              }}
            >
              <div className='sm:w-3/4 text-center'>
                Mint setting has not finished yet, user cannot join this brand now
              </div>
              { communityInfoSet.isOwner && (
                <BrandColorButton
                  className="button-md text-white mt-5"
                  onClick={() => {
                    showGlobalDialog('brand-manage-setting', { brandName: communityInfo.node?.node, brandInfo: communityInfo, options: {} })
                  }}
                >
                  <MintSettingIcon className="mr-1.5" />
                  <span>Update mint setting</span>
                </BrandColorButton>
              )
              }
            </div>
          ) : (
            <BrandColorButtonCard
              className='group border-2 border-dashed w-full h-[306px] rounded-[20px] flex flex-col items-center justify-center text-primary relative  bg-white'
              style={{
                color: brandColor,
              }}
              onClick={() => {
                showGlobalDialog('member-mint', { brandName: communityInfo.node?.node, brandInfo: communityInfo, options: {} })
              }}
            >
              <div>
                <PlusIconWithColor color={brandColor} />
              </div>
              <div className="mt-2.5">Join Community</div>
            </BrandColorButtonCard>
          )
        }
      />
    </div>
  )
}

export default CommunityMembers