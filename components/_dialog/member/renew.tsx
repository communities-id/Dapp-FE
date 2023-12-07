import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import MemberRenewContent from '@/components/_member/renew'
 
interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberRenew: FC<Props> = ({ open, handleClose }) => {
  
  return (
    <Dialog
      className='min-h-[260px] w-[600px]'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberRenewContent open={open} />
    </Dialog>
  )
}

export default MemberRenew