import { FC, useState } from 'react'

import { useDetails } from '@/contexts/details'
import { CHAIN_ID } from '@/shared/constant'

import Tabs from '@/components/_common/tabs'
import TargetedInvitation from '@/components/_brand/invite/targeted'

interface Props {

}

const BrandInviteContent: FC<Props> = () => {
  const { communityInfo } = useDetails()

  const brand = communityInfo?.node?.node || ''
  const chainId = communityInfo?._chaninId || CHAIN_ID
  const registry = communityInfo?.node?.registry || ''
  const registryInterface = communityInfo?.node?.registryInterface || ''

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
    <div className='p-[30px] w-[520px]'>
      <h1 className='text-xl text-main-black text-center'>Invite Member</h1>
      <div className='mt-5'>
        <Tabs value={tab} tabs={tabs} onChange={(val) => setTab(val)} />
      </div>
    </div>
  )
}

export default BrandInviteContent