import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import BrandManageContent from '@/components/_brand/manage'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
}

const BrandManageDialog: FC<Props> = ({ brandName, brandInfo, open, handleClose }) => {
  const { address: account } = useWallet()
  
  return (
    <Dialog
      className=''
      open={open}
      center
      handleClose={handleClose}
    >
      <BrandManageContent account={account} brandName={brandName} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default BrandManageDialog