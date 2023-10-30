import { FC, useState } from 'react'

import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'

interface Props {
  url: string
  zoom?: number
  aspect?: number
  objectFit?: 'vertical-cover' | 'horizontal-cover'
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void
}

const ImageCropper: FC<Props> = ({ url, zoom = 1, aspect = 1, objectFit = 'horizontal-cover', onCropComplete }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  
  return (
    <div className='relative w-full h-full min-h-[210px]'>
      <Cropper
        image={url}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        objectFit={objectFit}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
      />
    </div>
  )
}

export default ImageCropper