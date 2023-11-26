import { FC } from 'react'

import Dialog from '@/components/_common/dialog'
import Button from '@/components/_common/button'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleConfirm?: (payload: { brandName?: string; brandInfo?: Partial<CommunityInfo> }) => void
  handleClose?: () => void
}

const BrandNotLoaded: FC<Props> = ({ brandName, brandInfo, open, handleConfirm, handleClose }) => {
  
  return (
    <Dialog
      className=''
      open={open}
      center
      handleClose={handleClose}
    >
      <div className='p-10 flex-itmc flex-col'>
        <img alt='' src='/_brand/unloaded.svg' className='w-[160px] h-[100px]'/>
        <h2 className='mt-[30px] text-lgx'>
          <span>Brand</span>
          <span className='mx-1 text-primary'>.{brandName}</span>
          <span>was not ready</span>
        </h2>
        <p className='mt-[10px] text-sm !font-medium'>brand should be setting first.</p>
        <div className='mt-[30px]'>
          <Button
            size='medium'
            className='w-60'
            onClick={() => {
              handleConfirm?.({ brandName, brandInfo })
            }}
          >Go to Setting</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default BrandNotLoaded