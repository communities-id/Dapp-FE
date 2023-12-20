import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
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

const MemberPrimary: FC<Props> = ({ open, brandName, brandInfo: inputBrandInfo, memberName, memberInfo, handleClose }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })
  
  return (
    <Dialog
      className='h-[260px] w-[600px]'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberAsPrimaryContent memberName={memberName} memberInfo={memberInfo} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default MemberPrimary