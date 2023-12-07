import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Modal from '@/components/_common/modal'
import MobileBrandManageAccountSettingContent from '@/components/_brand/manage/mobile/account'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
}

const MobileBrandManageAccountSettingDialog: FC<Props> = ({ brandName, brandInfo, open, handleClose }) => {
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
        <MobileBrandManageAccountSettingContent
          account={account}
          brandName={brandName}
          brandInfo={brandInfo}
          onClose={handleClose}
        />
      </div>
    </Modal>
  )
}

export default MobileBrandManageAccountSettingDialog