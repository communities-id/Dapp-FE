import { FC, Fragment, useEffect, useState } from 'react'

import { useIpfs } from '@/hooks/ipfs'
import { readFileSize } from '@/utils/media'

import ImageCropperDialog from '@/components/dialog/imgCropper'

import LoadingIcon from '~@/icons/loading.svg'
import classNames from 'classnames'

interface Props {
  aspect?: number
  defaultUrl?: string
  minWidth?: number
  minHeight?: number
  onComplete?: (url: string) => void
  onError?: (msg: string) => void
  children?: React.ReactNode
}

const IpfsUploader: FC<Props> = ({ aspect, defaultUrl, minWidth = 500, minHeight = 500, onComplete, onError, children }) => {
  const { upload } = useIpfs()

  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropUrl, setCropUrl] = useState('')
  const maxW = minWidth * 5
  const maxH = minWidth * 5

  const handleUpload = async (buffer: Buffer) => {
    setLoading(true)
    const { Hash } = await upload(buffer)
    const url = `https://ipfs.io/ipfs/${Hash}`
    setUrl(url)
    onComplete?.(url)
    setCropperOpen(false)
    setLoading(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = e.target.files?.[0]
    if (!file) return
    const { width, height } = await readFileSize(file)
    if (width < minWidth || height < minHeight) {
      onError?.(`The minimum image size should be at least: ${minWidth} * ${minHeight}`)
      setLoading(false)
      return
    }
    if (width > maxW || height > maxH) {
      onError?.(`The minimum image size should be not exceed: ${maxW} * ${maxH}`)
      setLoading(false)
      return
    }
    setCropUrl(URL.createObjectURL(file))
    setCropperOpen(true)
    setLoading(false)
  }

  useEffect(() => {
    if (defaultUrl) {
      setUrl(defaultUrl)
    }
  }, [defaultUrl])

  return (
    <Fragment>
      <ImageCropperDialog
        open={cropperOpen}
        aspect={aspect}
        url={cropUrl}
        loading={loading}
        handleClose={() => {
          setCropperOpen(false)
        }}
        onCropComplete={(buffer) => {
          handleUpload(buffer)
        }}
      />
      <div className='relative group w-full h-full rounded-[6px] overflow-hidden'>
        <label className={
          classNames(
            'relative w-full h-full flex items-center justify-center leading-none cursor-pointer',
          )
        }>
          <div className='absolute-full z-normal pointer-events-none select-none'>
            {
              loading ? (
                <LoadingIcon width='32' height='32' />
              ) : (
                url && (
                  <img alt='' src={url} className='w-full h-full object-cover'/>
                )
              )
            }
          </div>
          { children }
          <input type='file' accept='image/png,image/jpeg,image/jpg,image/svg' className='w-0 h-0 overflow-hidden invisible' onChange={handleFileChange} />
        </label>
      </div>
    </Fragment>
  )
}

export default IpfsUploader