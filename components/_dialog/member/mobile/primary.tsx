import { FC, Fragment } from 'react'

import Modal from '@/components/_common/modal'
import CloseIcon from '~@/_brand/close.svg'
import MemberAsPrimaryContent from '@/components/_member/primary'
import { CommunityInfo, MemberInfo } from '@/types'
import { useDIDContent } from '@/hooks/content'

interface Props {
  memberName: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  memberInfo?: Partial<MemberInfo>
  open: boolean
  handleClose?: () => void
}

const MobileMemberPrimary: FC<Props> = ({ open, brandName, brandInfo: inputBrandInfo, memberName, memberInfo, handleClose }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })
  
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
          <MemberAsPrimaryContent memberName={memberName} memberInfo={memberInfo} brandInfo={brandInfo} />
      </div>
    </Modal>
  )
}

export default MobileMemberPrimary