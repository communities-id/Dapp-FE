import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import Modal from '@/components/_common/modal'
import BrandManageContent from '@/components/_brand/manage'
import MobileBrandMannageSocialLinkContent from '@/components/_brand/manage/mobile/socialLink'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
}

const MobileBrandManageTGSettingDialog: FC<Props> = ({ brandName, brandInfo, open, handleClose }) => {
  const { address: account } = useWallet()
  
  return (
    <Modal
      containerClassName='w-full'
      open={open}
      slideProps={{
        direction: 'X',
        offset: 475
      }}
      handleClose={handleClose}
    >
      <div className='w-full h-screen bg-white overflow-y-scroll'>
        <MobileBrandMannageSocialLinkContent
          account={account}
          brandName={brandName}
          brandInfo={brandInfo}
          onClose={handleClose}
        />
      </div>
    </Modal>
  )
}

export default MobileBrandManageTGSettingDialog