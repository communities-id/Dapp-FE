import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import MemberBurnContent from '@/components/_member/burn'
import { useDIDContent } from '@/hooks/content'
import { CommunityInfo, MemberInfo } from '@/types'
 
interface Props {
  open: boolean
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  memberName?: string
  memberInfo?: Partial<MemberInfo>
  handleClose?: () => void
}

const MemberBurn: FC<Props> = ({ open, brandName, brandInfo: inputBrandInfo, memberName, memberInfo, handleClose }) => {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo })
  
  return (
    <Dialog
      className='min-h-[260px] w-[600px]'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberBurnContent open={open} name={memberName} memberInfo={memberInfo} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default MemberBurn