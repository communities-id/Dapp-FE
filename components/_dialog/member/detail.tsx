import { FC } from 'react'

import { useDIDContent } from '@/hooks/content'

import Dialog from '@/components/_common/dialog'
import MemberDetailContent from '@/components/_member/detail';

import { CommunityInfo, MemberInfo } from '@/types';

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  memberName?: string
  memberInfo?: Partial<MemberInfo>
  open: boolean
  handleClose?: () => void
}

const MemberDetail: FC<Props> = ({ open, brandName, brandInfo: inputBrandInfo, memberName, memberInfo, handleClose }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })
  
  return (
    <Dialog
      className='w-[710px] h-[312px]'
      theme='small'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberDetailContent name={memberName} memberInfo={memberInfo} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default MemberDetail