import { FC, Fragment } from 'react'

import Modal from '@/components/_common/modal'
import CloseIcon from '~@/_brand/close.svg'
import MemberRenewContent from '@/components/_member/renew'

interface Props {
  open: boolean
  handleClose?: () => void
}

const MobileMemberRenew: FC<Props> = ({ open, handleClose }) => {
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
          <MemberRenewContent open={open} />
      </div>
    </Modal>
  )
}

export default MobileMemberRenew