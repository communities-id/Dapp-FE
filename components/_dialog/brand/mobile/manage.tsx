import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import Modal from '@/components/_common/modal'
import BrandManageContent from '@/components/_brand/manage'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
}

const BrandManageDialog: FC<Props> = ({ brandName, brandInfo, open, handleClose }) => {
  const { address: account } = useWallet()
  
  return (
    <Modal
      open={open}
      slideProps={{
        direction: 'X',
        offset: 800
      }}
      handleClose={handleClose}
    >
      <div className='w-full h-screen bg-primary'>
        <button onClick={handleClose}>close</button>
      </div>
      {/* <BrandManageContent account={account} brandName={brandName} brandInfo={brandInfo} /> */}
    </Modal>
  )
}

export default BrandManageDialog