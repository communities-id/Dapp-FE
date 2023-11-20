import { FC, ReactNode, useState } from 'react'
import classNames from 'classnames'

import ColorPicker from '@/components/_common/colorPicker'
import Button from '@/components/_common/button'
import IpfsUploader from '@/components/_common/ipfsUploader'
import TextArea from '@/components/_common/textarea'

import PencilIcon from '~@/_brand/pencil.svg'

interface Props {

}

const BrandMannageProfileSettings: FC<Props> = () => {
  const [form, setForm] = useState({
    avatar: '',
    banner: '',
    color: '',
    bio: ''
  })

  const handleFormChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  return (
    <div className="modal-content-container modal-content">
      <h1 className='text-main-black text-xl'>Profile Settings</h1>
      <div className='flex gap-10 mt-[30px]'>
        <div className='flex-1 flex flex-col gap-5'>
          <div className='w-full'>
            <ProfileTitle title='Avatar:' />
            <div>
              <Button size='normal'>Change</Button>
            </div>
            <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
          </div>
          <div className='w-full'>
            <ProfileTitle title='Banner:' />
            <div>
              <Button size='normal'>Change</Button>
            </div>
            <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
          </div>
          <div className='w-full'>
            <ProfileTitle title='Color:' />
            <div className='py-[6px]'>
              <ColorPicker/>
            </div>
            <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
          </div>
        </div>
        <div className='w-[302px]'>
          <ProfileTitle title='Preview:' />
          <div className='relative rounded-lg shadow-brand-preview'>
            <div className='h-[108px] rounded-t-lg bg-primary overflow-hidden'>
              <ProfileBannerUploader url='' />
            </div>
            <div className='relative z-normal flex flex-col -mt-[38px] px-10 pb-[52px] rounded-b-lg'>
              <ProfileAvatarUploader url='' />
              <h2 className='mt-5 text-xl text-main-black'>Azuki</h2>
              <p className='mt-1 text-xs-b text-main-black'>jerry.communitiesid</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-5'>
        <ProfileTitle title='Bio:' />
        <TextArea
          value={form.bio}
          placeholder='Placeholder content'
          onChange={(val) => handleFormChange('bio', val)}
        />
      </div>
    </div>
  )
}

const ProfileTitle = ({ title, className }: { title: string; className?: string }) => {
  return (
    <h3 className={classNames('mb-[10px] text-main-black text-sm-b !leading-[18px]', className)}>{ title }</h3>
  )
}

interface ProfileAvatarProps {
  url: string
  onChange?: (url: string) => void
}
const ProfileAvatarUploader: FC<ProfileAvatarProps> = ({ url, onChange }) => {
  const minWidth = 260
  const minHeight = 260
  return (
    <div className='w-20 h-20 -outline-offset-1 outline outline-4 outline-white rounded-lg overflow-hidden'>
      <IpfsUploader aspect={1} minWidth={minWidth} minHeight={minHeight} onComplete={onChange}>
        <div className='relative full-size flex-center bg-gray-6'>
          {
            !url && (
              <PencilIcon width='20' height='20' className='text-tr-black-4' />
            )
          }
          {
            url && (
              <div className='flex-center opacity-fade absolute-full bg-uploader-mask'>
                <PencilIcon width='20' height='20' className='text-white' />
              </div>
            )
          }
        </div>
      </IpfsUploader>
    </div>
  )
}

interface ProfileBannerProps {
  url: string
  onChange?: (url: string) => void
}
const ProfileBannerUploader: FC<ProfileBannerProps> = ({ url, onChange }) => {
  const minWidth = 840
  const minHeight = 210
  const aspect = 4 / 1
  return (
    <div className='full-size'>
      <IpfsUploader aspect={aspect} minWidth={minWidth} minHeight={minHeight} onComplete={onChange}>
        <div className='full-size flex-center opacity-fade bg-uploader-mask'>
          <p className='text-xs !font-bold text-white'>upload banner</p>
        </div>
      </IpfsUploader>
    </div>
  )
}

export default BrandMannageProfileSettings