import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import BrandManageContent from '@/components/_brand/manage'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  notLoaded?: boolean
  handleClose?: () => void
}

const BrandManageDialog: FC<Props> = ({ brandName, brandInfo, open, notLoaded, handleClose }) => {
  const { address: account } = useWallet()
  
  return (
    <Dialog
      className=''
      open={open}
      center
      handleClose={handleClose}
    >
      <BrandManageContent account={account} brandName={brandName} brandInfo={brandInfo} notLoaded={notLoaded} />
    </Dialog>
  )
}

export default BrandManageDialog