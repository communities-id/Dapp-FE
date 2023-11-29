import { FC, Fragment } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import Modal from '@/components/_common/modal'
import MobileBrandInvitationContent from '@/components/_brand/invitation/mobile'

import CloseIcon from '~@/_brand/close.svg'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
  handleChooseTab?: (tabName: string) => void
}

const MobileBrandInvitation: FC<Props> = ({ brandName, brandInfo, open, handleClose, handleChooseTab }) => {
  const { address: account } = useWallet()

  return (
    <Modal
      open={open}
      wrapClassName='w-full !items-end'
      containerClassName='w-full'
      slideProps={{
        direction: 'Y',
        offset: 400
      }}
      enableBackdropClick
      onBackdropClick={handleClose}
      handleClose={handleClose}
    >
      <div className='relative w-full pb-[30px] bg-white rounded-t-[10px]'>
        <div className='absolute top-[14px] right-[10px] z-icon' onClick={handleClose}>
          <CloseIcon width='20' height='20' className='text-gray-1' />
        </div>
        <MobileBrandInvitationContent brandName={brandName} brandInfo={brandInfo} />
      </div>
    </Modal>
  )
}

export default MobileBrandInvitation