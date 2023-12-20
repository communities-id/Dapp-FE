import { FC } from 'react'
import classNames from 'classnames';

import { useDIDContent } from '@/hooks/content'

import Dialog from '@/components/_common/dialog'
import MemberDetailContent from '@/components/_member/detail';

import { CommunityInfo, MemberInfo } from '@/types';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  memberName?: string
  memberInfo?: Partial<MemberInfo>
  open: boolean
  handleClose?: () => void
}

const MobileMemberDetail: FC<Props> = ({ open, brandName, brandInfo: inputBrandInfo, memberName, memberInfo, handleClose }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })
  
  return (
    <Dialog
      className='w-[320px] min-h-[320px] flex-center'
      theme='small'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      closeIcon={
        <div
          className={
            classNames(
              'absolute z-icon flex-center top-[14px] right-[14px] p-2 bg-black-tr-20 rounded-full cursor-pointer',
            )
          }
          onClick={handleClose}
        >
          <CloseIcon width='16' height='16' className='text-white' />
        </div>
      }
      handleClose={handleClose}
    >
      <MemberDetailContent isMobile name={memberName} memberInfo={memberInfo} brandInfo={brandInfo} handleClose={handleClose} />
    </Dialog>
  )
}

export default MobileMemberDetail