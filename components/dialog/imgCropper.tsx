import { FC, useState } from 'react'

import Dialog from '@/components/common/dialog'
import ImageCropper from '@/components/common/imageCropper'

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
      // className='!p-0 !m-0'
      contentClassName='!p-0 !m-0'
      open={open}
      title={null}
      loading={loading}
      // hiddenTitle
      // title={
      //   <p className='flex items-center justify-center gap-2'>
      //     <span>Image Cropper</span>
      //   </p>
      // }
      closeText='Cancel'
      confirmText='Confirm'
      handleClose={handleClose}
      handleConfirm={() => {
        getCroppedImg(url, pixelsArea).then((buffer) => {
          if (!buffer) return
          onCropComplete?.(buffer)
        })
      }}>
      <ImageCropper
        url={url}
        aspect={aspect}
        objectFit={ Number(aspect) > 1 ? 'horizontal-cover' : 'vertical-cover' }
        onCropComplete={(area, pixelsArea) => {
          setPixelsArea(pixelsArea)
        }}/>
    </Dialog>
  )
}

export default ImgCropperDialog