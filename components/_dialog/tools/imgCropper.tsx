import { FC, useState } from 'react'

import Dialog from '@/components/_common/dialog'
import ImageCropper from '@/components/common/imageCropper'
import Button from '@/components/_common/button'

import { getCroppedImg } from '@/utils/cropper'

import { Point, Area } from 'react-easy-crop/types'

interface Props {
  open: boolean
  url: string
  loading?: boolean
  aspect?: number
  handleClose?: () => void
  onCropComplete?: (buffer: Buffer) => void
}

const ImgCropperDialog: FC<Props> = ({ open, url, loading, aspect, onCropComplete, handleClose }) => {
  const [pixelsArea, setPixelsArea] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })

  return (
    <Dialog
      className='w-screen max-w-[600px] overflow-hidden'
      theme='small'
      open={open}
      center
      transparent
      hiddenCloseIcon
      >
        <div>
          <ImageCropper
            url={url}
            aspect={aspect}
            objectFit={ Number(aspect) > 1 ? 'horizontal-cover' : 'vertical-cover' }
            onCropComplete={(area, pixelsArea) => {
              setPixelsArea(pixelsArea)
            }}/>
        </div>
        <div className='px-10 py-5 bg-white flex-center gap-[10px] w-full'>
          <Button
            className='w-[138px] !bg-mintTransparencyPurple var-brand-textcolor'
            disabled={loading}
            onClick={handleClose}>Cancel</Button>
          <Button
            className='w-[138px]'
            theme='variable'
            loading={loading}
            disabled={loading}
            onClick={() => {
              getCroppedImg(url, pixelsArea).then((buffer) => {
                if (!buffer) return
                onCropComplete?.(buffer)
              })
          }}>Confirm</Button>
        </div>
    </Dialog>
  )
}

export default ImgCropperDialog