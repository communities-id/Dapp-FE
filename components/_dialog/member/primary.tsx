import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import MemberAsPrimaryContent from '@/components/_member/primary'
 
interface Props {
  memberName: string
  open: boolean
  handleClose?: () => void
}

const MemberPrimary: FC<Props> = ({ memberName, open, handleClose }) => {
  
  return (
    <Dialog
      className='h-[260px] w-[600px]'
      contentClassName='h-full !overflow-hidden'
      open={open}
      center
      handleClose={handleClose}
    >
      <MemberAsPrimaryContent memberName={memberName} />
    </Dialog>
  )
}

export default MemberPrimary