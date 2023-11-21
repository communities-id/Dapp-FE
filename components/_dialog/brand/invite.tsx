import { FC, useEffect, useState } from 'react'

import { useWallet } from '@/hooks/wallet'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'

import Dialog from '@/components/_common/dialog'
import BrandInviteContent from '@/components/_brand/invite'
 
interface Props {
  open: boolean
  handleClose?: () => void
}

const BrandManageDialog: FC<Props> = ({ open, handleClose }) => {
  const { getSigner } = useWallet()
  const { message } = useRoot()
  const { communityInfo } = useDetails()
  
  return (
    <Dialog
      className=''
      open={open}
      handleClose={handleClose}
    >
      <BrandInviteContent />
    </Dialog>
  )
}

export default BrandManageDialog