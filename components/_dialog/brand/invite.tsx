import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import BrandInviteContent from '@/components/_brand/invite'

import { CommunityInfo } from '@/types'
 
interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
}

const BrandManageDialog: FC<Props> = ({ brandName, brandInfo, open, handleClose }) => {
  
  return (
    <Dialog
      className='h-screen'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <BrandInviteContent brandName={brandName} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default BrandManageDialog