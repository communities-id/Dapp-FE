import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

import { useDetails } from '@/contexts/details'
import { useRoot } from '@/contexts/root'
import { updateCommunity } from '@/shared/apis'
import { DEFAULT_AVATAR } from '@/shared/constant'
import { isColor, toastError } from '@/shared/helper'
import useApi from '@/shared/useApi'

import SettingNotice from "@/components/_common/settingNotice"
import ColorPicker from '@/components/_common/colorPicker'
import Button from '@/components/_common/button'
import AwsUploader from '@/components/_common/awsUploader'
import TextArea from '@/components/_common/textarea'
import PrimaryDID from '@/components/common/primaryDID'
import { CommunityProfileLabels } from '@/components/settings/community/profile'

import { CommunityInfo } from '@/types'

import PencilIcon from '~@/_brand/pencil.svg'

interface Props {
  brandInfo: Partial<CommunityInfo>
  onBrandColorChange?: (color: string) => void
}

const BrandMannageProfileSettings: FC<Props> = ({ brandInfo, onBrandColorChange }: Props) => {
  const { message, NetOps } = useRoot()
  const { updateCommunityBrandConfig } = useApi()
  
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})
  
  const [form, setForm] = useState<Record<CommunityProfileLabels, string>>({
    image: brandInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (brandInfo?.tokenUri?.image ?? ''),
    brandImage: brandInfo?.tokenUri?.brand_image ?? '',
    brandColor: brandInfo?.tokenUri?.brand_color ?? '',
    description: brandInfo?.tokenUri?.description ?? '',
    externalUrl: brandInfo?.tokenUri?.external_url ?? '',
    discord: String(brandInfo?.tokenUri?.attr?.discord ?? ''),
    twitter: String(brandInfo?.tokenUri?.attr?.twitter ?? ''),
    telegram: String(brandInfo?.tokenUri?.attr?.telegram ?? ''),
  })

  const pending = loading || NetOps.loading

  const brandName = useMemo(() => {
    return brandInfo?.node?.node
  }, [brandInfo])

  const brandOwner = useMemo(() => {
    return brandInfo?.owner ?? ''
  }, [brandInfo])

  const changed = useMemo(() => {
    return {
      profileConfig: needUpdate(),
    }
  }, [form, needUpdate])

  function validateForm() {
    const rules: Record<string, (value: string) => string | undefined> = {
      image: (value: string) => {
        if (value.startsWith('http') || value.startsWith('https') || value.startsWith('ipfs') || !value) {
          return
        }
        return 'Please enter a valid url'
      },
      brandImage: (value: string) => {
        if (value.startsWith('http') || value.startsWith('https') || !value) {
          return
        }
        return 'Please enter a valid url'
      },
      brandColor: (value: string) => {
        if (isColor(value) || !value) {
          return
        }
        return 'Please enter a valid color code'
      },
    }
    const results: Record<string, string | undefined> = {}
    for(let i in rules) {
      const result = rules[i]?.((form as any)[i])
      if (result) {
        results[i] = result
      }
    }
    return results
  }

  function needUpdate() {
    const isImageChanged = (form.image || DEFAULT_AVATAR) !== brandInfo?.tokenUri?.image
    const isBrandImageChanged = form.brandImage !== brandInfo?.tokenUri?.brand_image
    const isBackgroundColorChanged = form.brandColor !== brandInfo?.tokenUri?.brand_color
    const isDescriptionChanged = form.description !== brandInfo?.tokenUri?.description
    return isImageChanged || isBrandImageChanged || isBackgroundColorChanged || isDescriptionChanged
  }
  
  const handleSaveOnChain = async () => {
    if (!brandInfo?.node) return
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    if (!changed.profileConfig) {
      message({ type: 'warning', content: 'Nothing to update.' }, { t: 'brand-profile-setting', k: brandInfo.node.node })
      return
    }
    const chainId = brandInfo.chainId as number
    await NetOps.handleSwitchNetwork(chainId)
    try {
      setLoading(true)
      await updateCommunityBrandConfig(brandInfo.node.tokenId, {
        image: form.image || DEFAULT_AVATAR,
        brandImage: form.brandImage,
        brandColor: form.brandColor,
        description: form.description,
        externalUrl: form.externalUrl,
        discord: form.discord,
        twitter: form.twitter,
        telegram: form.telegram
      }, { chainId })
      await updateCommunity(brandInfo.node.node, true)
      message({ type: 'success', content: 'Update successfully!' }, { t: 'brand-profile-setting', k: brandInfo.node.node  })
      // handleClose?.()
      // refreshInfo()
      location.reload()
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to update setting: ', e, { t: 'brand-profile-setting', k: brandInfo.node.node  })
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (payload: Partial<Record<CommunityProfileLabels, string>>) => {
    setForm({
      ...form,
      ...payload
    })
  }

  const handleReset = () => {
    setForm({
      image: brandInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (brandInfo?.tokenUri?.image ?? ''),
      brandImage: brandInfo?.tokenUri?.brand_image ?? '',
      brandColor: brandInfo?.tokenUri?.brand_color ?? '',
      description: brandInfo?.tokenUri?.description ?? '',
      externalUrl: brandInfo?.tokenUri?.external_url ?? '',
      discord: String(brandInfo?.tokenUri?.attr?.discord ?? ''),
      twitter: String(brandInfo?.tokenUri?.attr?.twitter ?? ''),
      telegram: String(brandInfo?.tokenUri?.attr?.telegram ?? ''),
    })
  }

  useEffect(() => {
    onBrandColorChange?.(form.brandColor)
  }, [form.brandColor])

  return (
    <div className="modal-content-container relative h-full flex flex-col">
      <div className='flex-1 modal-content pb-10 overflow-auto'>
        <h1 className='text-main-black text-xl'>Profile Settings</h1>
        <div className='flex gap-10 mt-[30px]'>
          <div className='flex-1 flex flex-col gap-5'>
            <div className='w-full'>
              <ProfileTitle title='Avatar:' />
              <div>
                <Button htmlFor='avatar-uploader' size='normal' className='var-brand-bgcolor'>Change</Button>
              </div>
              <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
            </div>
            <div className='w-full'>
              <ProfileTitle title='Banner:' />
              <div>
                <Button htmlFor='banner-uploader' size='normal' className='var-brand-bgcolor'>Change</Button>
              </div>
              <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
            </div>
            <div className='w-full'>
              <ProfileTitle title='Color:' />
              <div className='py-[6px]'>
                <ColorPicker
                  value={form.brandColor}
                  onChange={(color) => {
                    handleFormChange({ brandColor: color })
                  }}
                />
              </div>
              <div className='w-full h-[1px] bg-gray-3 mt-5'></div>
            </div>
          </div>
          <div className='w-[302px]'>
            <ProfileTitle title='Preview:' />
            <div className='relative rounded-lg shadow-brand-preview'>
              <div className='h-[108px] rounded-t-lg var-brand-bgcolor overflow-hidden'>
                <ProfileBannerUploader
                  relationshipId='banner-uploader'
                  url={form.brandImage}
                  onChange={(val) => handleFormChange({ brandImage: val })}
                  onError={(err) => {
                    message({ type: 'error', content: err })
                  }}
                />
              </div>
              <div className='relative z-normal flex flex-col -mt-[38px] px-10 pb-[52px] rounded-b-lg'>
                <ProfileAvatarUploader
                  relationshipId='avatar-uploader'
                  url={form.image}
                  onChange={(val) => handleFormChange({ image: val })}
                  onError={(err) => {
                    message({ type: 'error', content: err })
                  }}
                />
                <h2 className='mt-5 text-xl text-main-black'>{ brandName }</h2>
                <div className='mt-1 text-xs-b text-main-black'>
                  <PrimaryDID address={brandOwner} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-5'>
          <ProfileTitle title='Bio:' />
          <TextArea
            maxLength={200}
            value={form.description}
            placeholder='Placeholder content'
            onChange={(val) => handleFormChange({ description: val })}
          />
        </div>
      </div>
      {
        changed.profileConfig && (
          <SettingNotice loading={pending} onReset={handleReset} onSaveOnChain={handleSaveOnChain} />
        )
      }
    </div>
  )
}

const ProfileTitle = ({ title, className }: { title: string; className?: string }) => {
  return (
    <h3 className={classNames('mb-[10px] text-main-black text-sm-b !leading-[18px]', className)}>{ title }</h3>
  )
}

interface ProfileAvatarProps {
  relationshipId?: string
  url: string
  onChange?: (url: string) => void
  onError?: (error: string) => void
}
const ProfileAvatarUploader: FC<ProfileAvatarProps> = ({ relationshipId, url, onChange, onError }) => {
  const minWidth = 260
  const minHeight = 260
  return (
    <div className='w-20 h-20 -outline-offset-1 outline outline-4 outline-white rounded-lg overflow-hidden'>
      <AwsUploader
        defaultUrl={url}
        relationshipId={relationshipId}
        aspect={1}
        minWidth={minWidth}
        minHeight={minHeight}
        onComplete={onChange}
        onError={onError}
      >
        {
          !url && (
            <div className='relative full-size flex-center bg-gray-6'>
              <PencilIcon width='20' height='20' className='text-tr-black-4' />
            </div>
          )
        }
        {
          url && (
            <div className='z-normal group-hover:opacity-100 flex-center opacity-fade absolute-full bg-uploader-mask'>
              <PencilIcon width='20' height='20' className='text-white' />
            </div>
          )
        }
      </AwsUploader>
    </div>
  )
}

interface ProfileBannerProps {
  relationshipId?: string
  url: string
  onChange?: (url: string) => void
  onError?: (error: string) => void
}
const ProfileBannerUploader: FC<ProfileBannerProps> = ({ relationshipId, url, onChange, onError }) => {
  const minWidth = 840
  const minHeight = 210
  const aspect = 4 / 1
  return (
    <div className='full-size'>
      <AwsUploader
        defaultUrl={url}
        relationshipId={relationshipId}
        aspect={aspect}
        minWidth={minWidth}
        minHeight={minHeight}
        onComplete={onChange}
        onError={onError}
      >
        <div className='z-normal group-hover:opacity-100 full-size flex-center opacity-fade bg-uploader-mask'>
          <p className='text-xs !font-bold text-white'>upload banner</p>
        </div>
      </AwsUploader>
    </div>
  )
}

export default BrandMannageProfileSettings