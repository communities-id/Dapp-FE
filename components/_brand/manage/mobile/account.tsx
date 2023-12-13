import { CSSProperties, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

import { useRoot } from '@/contexts/root'
import { useDIDContent } from '@/hooks/content'
import MobileBrandManageLayout from '@/layouts/brand/mobileManage'
import { updateCommunity } from '@/shared/apis'
import { DEFAULT_AVATAR } from '@/shared/constant'
import { toastError } from '@/shared/helper'
import useApi from '@/shared/useApi'

import { CommunityProfileLabels } from '@/components/settings/community/profile'
import Input from '@/components/_common/input'

import { CommunityInfo } from '@/types'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  onClose?: () => void
}
export default function MobileBrandMannageAccountSettingContent({ account, brandName, brandInfo: inputBrandInfo, onClose }: Props) {
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

  const socials = [
    {
      name: 'externalUrl',
      label: 'Official Website',
      value: form.externalUrl,
      placeholder: 'https://',
    },
    {
      name: 'twitter',
      label: 'Twitter',
      value: form.twitter,
      placeholder: 'https://',
    },
    {
      name: 'discord',
      label: 'Discord',
      value: form.discord,
      placeholder: 'https://',
    },
    {
      name: 'telegram',
      label: 'Telegram',
      value: form.telegram,
      placeholder: 'https://',
    }
  ]

  const changed = useMemo(() => {
    return {
      accountConfig: needUpdate(),
    }
  }, [form, needUpdate])

  function validateForm() {
    const rules: Record<string, (value: string) => string | undefined> = {
      // image: (value: string) => {
      //   if (value.startsWith('http') || value.startsWith('https') || value.startsWith('ipfs') || !value) {
      //     return
      //   }
      //   return 'Please enter a valid url'
      // },
      // brandImage: (value: string) => {
      //   if (value.startsWith('http') || value.startsWith('https') || !value) {
      //     return
      //   }
      //   return 'Please enter a valid url'
      // },
      // brandColor: (value: string) => {
      //   if (isColor(value) || !value) {
      //     return
      //   }
      //   return 'Please enter a valid color code'
      // },
      externalUrl: (value: string) => {
        if (value.startsWith('http') || value.startsWith('https') || !value) {
          return
        }
        return 'Please enter a valid url'
      },
      discord: (value: string) => {
        if (value.startsWith('http') || value.startsWith('https') || !value) {
          return
        }
        return 'Please enter a valid url'
      },
      twitter: (value: string) => {
        // if (value.match(/[0-9a-zA-Z-_+]+/i) || !value) {
        //   return
        // }
        // return 'Please enter a valid userID'
        if (value.startsWith('http') || value.startsWith('https') || !value) {
          return
        }
        return 'Please enter a valid url'
      },
      telegram: (value: string) => {
        // if (value.match(/[0-9a-zA-Z-_+]+/i) || !value) {
        //   return
        // }
        // return 'Please enter a valid userID'
        if (value.startsWith('http') || value.startsWith('https') || !value) {
          return
        }
        return 'Please enter a valid url'
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
    const isExternalUrlChanged = form.externalUrl !== brandInfo?.tokenUri?.external_url
    const isDiscordChanged = form.discord !== String(brandInfo?.tokenUri?.attr?.discord ?? '')
    const isTwitterChanged = form.twitter !== String(brandInfo?.tokenUri?.attr?.twitter ?? '')
    const isTelegramChanged = form.telegram !== String(brandInfo?.tokenUri?.attr?.telegram ?? '')
    return isExternalUrlChanged || isDiscordChanged || isTwitterChanged || isTelegramChanged
  }
  
  const handleSaveOnChain = async () => {
    if (!brandInfo?.node) return
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    if (!changed.accountConfig) {
      message({ type: 'warning', content: 'Nothing to update.' }, { t: 'brand-profile-setting', k: brandInfo.node.node })
      return
    }
    try {
      setLoading(true)
      const chainId = brandInfo.chainId as number
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
      toastError(message, 'Failed to update setting: ', e, { t: 'brand-profile-setting', k: brandInfo.node.node })
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (name: string, value: string) => {
    console.log('- handleFormChange -', name, value)
    setForm({
      ...form,
      [name]: value
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
    if (!brandInfo.tokenUri) return
    setValidation({})
    handleReset()
  }, [brandInfo])

  return (
    <MobileBrandManageLayout
      contentClassName='!pt-5'
      title='Official Link Settings'
      brandColor={brandInfo?.tokenUri?.brand_color}
      footer
      loading={pending}
      onClose={onClose}
      onClick={handleSaveOnChain}
    >
      <ul className="w-full flex flex-col gap-5">
        {
          socials.map((item, index) => {
            return (
              <li
                key={index}
                className={
                  classNames(
                    'w-full flex flex-col',
                  )
                }
              >
                <div className="flex-itmc h-[38px] text-sm !font-medium text-black-tr-80">
                  <span>{ item.label }</span>
                </div>
                <div className='flex-1'>
                  <Input
                    inputclassname='w-full !p-3 !leading-5'
                    value={item.value}
                    placeholder={item.placeholder}
                    onChange={(e) => handleFormChange(item.name, e.target.value)}
                  />
                </div>
              </li>
            )
          })
        }
      </ul>
    </MobileBrandManageLayout>
  )
}