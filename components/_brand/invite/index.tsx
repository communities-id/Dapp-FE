import { FC, useState } from 'react'

import Tabs from '@/components/_common/tabs'
import TargetedInvitation from '@/components/_brand/invite/targeted'

interface Props {

}

const BrandInviteContent: FC<Props> = () => {
  const [tab, setTab] = useState(0)
  const tabs = [
    {
      label: 'Targeted',
      value: 0,
      renderPanel: () => <TargetedInvitation />,
    },
    {
      label: 'Public',
      value: 1,
    }
  ]
  return (
    <div className='p-[30px] w-[520px]'>
      <h1>Invite Member</h1>
      <div>
        <Tabs value={tab} tabs={tabs} onChange={(val) => setTab(val)} />
      </div>
    </div>
  )
}

export default BrandInviteContent