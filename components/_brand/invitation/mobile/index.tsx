import { FC, useState } from 'react'

import { useDetails } from '@/contexts/details'
import { CHAIN_ID } from '@/shared/constant'

import Tabs from '@/components/_common/tabs'
import TargetedInvitation from '@/components/_brand/invitation/mobile/targeted'

import { CommunityInfo } from '@/types'
import { useDIDContent } from '@/hooks/content'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

const MobileBrandInvitationContent: FC<Props> = ({ brandName, brandInfo: inputBrandInfo }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })

  const brand = brandInfo?.node?.node || ''
  const chainId = brandInfo?._chaninId || CHAIN_ID
  const registry = brandInfo?.node?.registry || ''
  const registryInterface = brandInfo?.node?.registryInterface || ''

  const [tab, setTab] = useState(0)
  const tabs = [
    {
      label: 'Targeted',
      value: 0,
      renderPanel: () => (
        <TargetedInvitation
          brand={brand}
          registry={registry}
          registryInterface={registryInterface}
          chainId={chainId}
        />
      ),
    },
    // {
    //   label: 'Public',
    //   value: 1,
    // }
  ]
  return (
    <div className='pt-[30px] w-full flex flex-col'>
      <h1 className='text-xl text-main-black text-center'>Invite Member</h1>
      <div className='mt-5 flex-1 h-full overflow-hidden'>
        <Tabs
          tabsListClassName='mx-[30px]'
          tabPanelClassName='max-h-[70vh]'
          value={tab}
          tabs={tabs}
          onChange={(val) => setTab(val)}
        />
      </div>
    </div>
  )
}

export default MobileBrandInvitationContent