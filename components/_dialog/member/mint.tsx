import { FC } from 'react'

import MemberMintContent from '@/components/_member/mint';
import Modal from '@/components/_common/modal';

import { CommunityInfo } from '@/types';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  invitationCode?: string
  memberName?: string
  mintTo?: string
  open: boolean
  handleClose?: () => void
}

const MemberMint: FC<Props> = ({ brandName, brandInfo, invitationCode, memberName, mintTo, open, handleClose }) => {

  return (
    <Modal
      open={open}
      wrapClassName="h-screen justify-end"
      containerClassName="h-full"
      enableBackdropClick
      onBackdropClick={handleClose}
      slideProps={{
        direction: 'X',
        offset: 800
      }}>
        <div className='relative w-[90vw] h-full max-w-[800px] bg-white'>
          <div
            className='absolute left-5 top-8 z-icon p-2 bg-white border border-solid border-gray-7 cursor-pointer rounded-xs'
            onClick={handleClose}
          >
            <CloseIcon width='16' height='16' className='text-gray-1' />
          </div>
          <MemberMintContent brandName={brandName} brandInfo={brandInfo} invitationCode={invitationCode} memberName={memberName} classes={{}} />
        </div>
    </Modal>
  )
}

export default MemberMint