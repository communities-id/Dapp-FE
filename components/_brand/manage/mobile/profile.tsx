import { FC, useMemo, useState } from 'react'

import { useRoot } from '@/contexts/root'
import { updateCommunity } from '@/shared/apis'
import { DEFAULT_AVATAR } from '@/shared/constant'
import { isColor, formatContractError } from '@/shared/helper'
import useApi from '@/shared/useApi'
import { useDIDContent } from '@/hooks/content'
import MobileBrandManageLayout from '@/layouts/brand/mobileManage'

import { CommunityProfileLabels } from '@/components/settings/community/profile'
import IpfsUploader from '@/components/_common/ipfsUploader'
import TextArea from '@/components/_common/textarea'
import ColorPicker from '@/components/_common/colorPicker'

import { CommunityInfo } from '@/types'

import PencilIcon from '~@/_brand/pencil.svg'
import ArrowRightIcon from '~@/_brand/arrow-right.svg'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  onClose?: () => void
}
export default function MobileBrandMannageProfileSettingContent({ account, brandName, brandInfo: inputBrandInfo, onClose }: Props) {
  const { brandInfo, brandInfoLoading, brandNotLoaded } = useDIDContent({ brandName, brandInfo: inputBrandInfo  })

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

  // const brandOwner = useMemo(() => {
  //   return brandInfo?.owner ?? ''
  // }, [brandInfo])

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
      message({
        type: 'error',
        content: 'Failed to update setting: ' + formatContractError(e),
      }, { t: 'brand-profile-setting', k: brandInfo.node.node  })
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

  // const handleReset = () => {
  //   setForm({
  //     image: brandInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (brandInfo?.tokenUri?.image ?? ''),
  //     brandImage: brandInfo?.tokenUri?.brand_image ?? '',
  //     brandColor: brandInfo?.tokenUri?.brand_color ?? '',
  //     description: brandInfo?.tokenUri?.description ?? '',
  //     externalUrl: brandInfo?.tokenUri?.external_url ?? '',
  //     discord: String(brandInfo?.tokenUri?.attr?.discord ?? ''),
  //     twitter: String(brandInfo?.tokenUri?.attr?.twitter ?? ''),
  //     telegram: String(brandInfo?.tokenUri?.attr?.telegram ?? ''),
  //   })
  // }

  return (
    <MobileBrandManageLayout
      title='Profile Settings'
      loading={pending}
      brandColor={form.brandColor}
      footer
      onClose={onClose}
      onClick={handleSaveOnChain}
    >
      <ul className='flex flex-col gap-4 text-main-black'>
        <li className='w-full'>
          <div className='h-10 flex-center gap-[10px]'>
            <h3 className='flex-1 text-md-b !leading-5'>Avatar</h3>
            <ProfileAvatarUploader
              relationshipId='mobile-avatar-uploader'
              url={form.image || DEFAULT_AVATAR}
              onChange={(url) => handleFormChange({ image: url })}
            />
            <ArrowRightIcon width='18' height='18' />
          </div>
        </li>
        <li className='w-full'>
          <div className='divider-line'></div>
        </li>
        <li className='w-full'>
          <div className='h-10 flex-center gap-[10px]'>
            <h3 className='flex-1 text-md-b !leading-5'>Banner</h3>
            <ProfileBannerUploader
              relationshipId='mobile-banner-uploader'
              url={form.brandImage}
              onChange={(val) => handleFormChange({ brandImage: val })}
            />
            <ArrowRightIcon width='18' height='18' />
          </div>
        </li>
        <li className='w-full'>
          <div className='divider-line'></div>
        </li>
        <li className='w-full'>
          <div className='h-10 flex-center gap-[10px]'>
            <h3 className='flex-1 text-md-b !leading-5'>Color</h3>
            <div className='w-10 h-10 rounded-full'>
              <ColorPicker
                mobile
                value={form.brandColor}
                onChange={(color) => {
                  handleFormChange({ brandColor: color })
                }}
              />
            </div>
            <ArrowRightIcon width='18' height='18' />
          </div>
        </li>
        <li className='w-full'>
          <div className='divider-line'></div>
        </li>
        <li className='w-full'>
          <div className='flex flex-col gap-[10px]'>
            <h3 className='flex-1 text-md-b !leading-5'>Bio:</h3>
            <TextArea
              value={form.description}
              placeholder='Placeholder content'
              onChange={(val) => handleFormChange({ description: val })}
            />
          </div>
        </li>
      </ul>
    </MobileBrandManageLayout>
  )
}


interface ProfileAvatarProps {
  relationshipId?: string
  url: string
  onChange?: (url: string) => void
}
const ProfileAvatarUploader: FC<ProfileAvatarProps> = ({ relationshipId, url, onChange }) => {
  const minWidth = 260
  const minHeight = 260
  return (
    <div className='w-10 h-10 -outline-offset-1 outline outline-4 outline-white rounded-lg overflow-hidden'>
      <IpfsUploader defaultUrl={url} relationshipId={relationshipId} aspect={1} minWidth={minWidth} minHeight={minHeight} onComplete={onChange}>
        {
          !url && (
            <div className='relative full-size flex-center bg-gray-6'>
              <PencilIcon width='20' height='20' className='text-tr-black-4' />
            </div>
          )
        }
      </IpfsUploader>
    </div>
  )
}

interface ProfileBannerProps {
  relationshipId?: string
  url: string
  onChange?: (url: string) => void
}
const ProfileBannerUploader: FC<ProfileBannerProps> = ({ relationshipId, url, onChange }) => {
  const minWidth = 840
  const minHeight = 210
  const aspect = 4 / 1
  return (
    <div className='w-[70px] h-10'>
      <IpfsUploader defaultUrl={url} relationshipId={relationshipId} aspect={aspect} minWidth={minWidth} minHeight={minHeight} onComplete={onChange}>
        {
          !url && (
            <div className='relative full-size flex-center bg-gray-6'>
              <PencilIcon width='20' height='20' className='text-tr-black-4' />
            </div>
          )
        }
      </IpfsUploader>
    </div>
  )
}