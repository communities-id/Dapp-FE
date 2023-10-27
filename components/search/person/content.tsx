import { FC, useState, Fragment } from 'react'

import { useDetails } from '@/contexts/details'

import { Tabs, TabsList, TabPanel } from '@mui/base'
import Tab from '@/components/common/tab'
import Identities from '@/components/search/person/identities'
import Comunities from '@/components/search/person/communities'
import Loading from '@/components/loading/content'

interface Props {
}

const PersonContent: FC<Props> = () => {
  const { loadingSet } = useDetails()
  return (
    <div className="">
      <Tabs defaultValue={0}>
        <TabsList className='py-[10px]'>
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