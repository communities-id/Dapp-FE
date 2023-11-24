import { FC } from 'react'

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
  
  return (
    <Dialog
      className=''
      open={open}
      center
      handleClose={handleClose}
    >
      <BrandManageContent brandName={brandName} brandInfo={brandInfo} />
    </Dialog>
  )
}

export default BrandManageDialog