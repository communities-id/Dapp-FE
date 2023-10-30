import { FC, Fragment, useEffect, useState } from 'react'

import { useIpfs } from '@/hooks/ipfs'
import { readFileSize } from '@/utils/media'

import ImageCropperDialog from '@/components/dialog/imgCropper'

import LoadingIcon from '~@/icons/loading.svg'
import UploadIcon from '~@/icons/upload.svg'
import classNames from 'classnames'

interface Props {
  aspect?: number
  description?: string
  defaultUrl?: string
  minWidth?: number
  minHeight?: number
  handleComplete?: (url: string) => void
  handleError?: (msg: string) => void
}

const IpfsUploader: FC<Props> = ({ aspect, description, defaultUrl, minWidth = 0, minHeight = 0, handleComplete, handleError }) => {
  const { upload } = useIpfs()

  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropUrl, setCropUrl] = useState('')

  const handleUpload = async (buffer: Buffer) => {
    setLoading(true)
    const { Hash } = await upload(buffer)
    const url = `https://ipfs.io/ipfs/${Hash}`
    setUrl(url)
    handleComplete?.(url)
    setCropperOpen(false)
    setLoading(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = e.target.files?.[0]
    if (!file) return
    const { width, height } = await readFileSize(file)
    if (width < minWidth || height < minHeight) {
      handleError?.(`The minimum image size should be at least: ${minWidth} * ${minHeight}`)
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
      <div className='group w-full h-full rounded-[6px] overflow-hidden bg-ipfs-uploader'>
        <label className={
          classNames(
            'relative w-full h-full flex items-center justify-center leading-none cursor-pointer',
            'border-dashed border-[1px] border-[rgba(117,117,117,0.5)] rounded-[6px]'
          )
        }>
          {
            loading ? (
              <LoadingIcon width='32' height='32' />
            ) : (
              url && (
                <img alt='' src={url} className='w-full h-full object-cover'/>
              )
            )
          }
          {
            (description && !url) && (
              <p className='absolute bottom-2 left-2 text-[12px] text-linkGray'>{ description }</p>
            )
          }
          <div className={
            classNames(
              'absolute z-1 top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none',
            )
          }>
            <UploadIcon
              width="36"
              height="36"
              className={
                classNames(
                  'text-[rgba(117, 117, 117, 0.5)] invisible',
                  { '!visible': !url && !loading }
                )
              }
            />
          </div>
          <input type='file' accept='image/png,image/jpeg,image/jpg,image/svg' className='w-0 h-0 overflow-hidden invisible' onChange={handleFileChange} />
        </label>
      </div>
    </Fragment>
  )
}

export default IpfsUploader