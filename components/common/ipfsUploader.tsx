import { FC, useEffect, useState } from 'react'

import { useIpfs } from '@/hooks/ipfs'

import LoadingIcon from '~@/icons/loading.svg'
import UploadIcon from '~@/icons/upload.svg'
import classNames from 'classnames'

interface Props {
  defaultUrl?: string
  handleComplete?: (url: string) => void
}

const IpfsUploader: FC<Props> = ({ defaultUrl, handleComplete }) => {
  const { upload } = useIpfs()

  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = e.target.files?.[0]
    if (!file) return
    const { Hash } = await upload(file)
    const url = `https://ipfs.io/ipfs/${Hash}`
    setUrl(url)
    handleComplete?.(url)
    setLoading(false)
  }

  useEffect(() => {
    if (defaultUrl) {
      setUrl(defaultUrl)
    }
  }, [defaultUrl])

  return (
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
        <input type='file' accept='image/png,image/jpeg,image/jpg,image/svg' className='w-0 h-0 overflow-hidden invisible' onChange={handleUpload} />
      </label>
    </div>
  )
}

export default IpfsUploader