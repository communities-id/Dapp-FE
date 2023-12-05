import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import MemberBurnContent from '@/components/_member/burn'
 
interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberBurn: FC<Props> = ({ open, handleClose }) => {
  
  return (
    <Dialog
      className='min-h-[260px] w-[600px]'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberBurnContent open={open} />
    </Dialog>
  )
}

export default MemberBurn