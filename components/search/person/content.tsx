import { FC, useState, Fragment, CSSProperties } from 'react'

import { useDetails } from '@/contexts/details'

import { Tabs, TabsList, TabPanel } from '@mui/base'
import Tab from '@/components/common/tab'
import Identities from '@/components/search/person/identities'
import Comunities from '@/components/search/person/communities'
import themeColor from '@/_themes/colors'

interface Props {
}

const PersonContent: FC<Props> = () => {
  return (
    <div className="">
      <Tabs defaultValue={0} style={{ '--var-brand-color': themeColor.primary } as CSSProperties}>
        <TabsList className='pt-[10px] pb-[25px]'>
          <Tab value={0}>
            User DID
          </Tab>
          <Tab value={1}>
            Brand DID
          </Tab>
        </TabsList>
        <TabPanel value={0}>
          <Identities />
        </TabPanel>
        <TabPanel value={1}>
          <Comunities/>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default PersonContent