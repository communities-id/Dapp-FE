import { useEffect, useMemo, useState } from "react"
import classNames from 'classnames'

import { useDetails } from "@/contexts/details"
import { useRoot } from "@/contexts/root"
import { updateCommunity } from "@/shared/apis"
import { DEFAULT_AVATAR } from "@/shared/constant"
import { isColor, formatContractError } from "@/shared/helper"
import useApi from "@/shared/useApi"

import SettingNotice from "@/components/_common/settingNotice"
import Input from '@/components/_common/input'
import { CommunityProfileLabels } from "@/components/settings/community/profile"

export default function BrandMannageAccountManagement() {
  const { message } = useRoot()
  const { communityInfo, refreshInfo } = useDetails()
  const { updateCommunityBrandConfig } = useApi()
  
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})

  const [form, setForm] = useState<Record<CommunityProfileLabels, string>>({
    image: communityInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (communityInfo?.tokenUri?.image ?? ''),
    brandImage: communityInfo?.tokenUri?.brand_image ?? '',
    brandColor: communityInfo?.tokenUri?.brand_color ?? '',
    description: communityInfo?.tokenUri?.description ?? '',
    externalUrl: communityInfo?.tokenUri?.external_url ?? '',
    discord: String(communityInfo?.tokenUri?.attr?.discord ?? ''),
    twitter: String(communityInfo?.tokenUri?.attr?.twitter ?? ''),
    telegram: String(communityInfo?.tokenUri?.attr?.telegram ?? ''),
  })

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
        if (value.match(/[0-9a-zA-Z-_+]+/i) || !value) {
          return
        }
        return 'Please enter a valid userID'
      },
      telegram: (value: string) => {
        if (value.match(/[0-9a-zA-Z-_+]+/i) || !value) {
          return
        }
        return 'Please enter a valid userID'
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
    const isExternalUrlChanged = form.externalUrl !== communityInfo?.tokenUri?.external_url
    const isDiscordChanged = form.discord !== String(communityInfo?.tokenUri?.attr?.discord ?? '')
    const isTwitterChanged = form.twitter !== String(communityInfo?.tokenUri?.attr?.twitter ?? '')
    const isTelegramChanged = form.telegram !== String(communityInfo?.tokenUri?.attr?.telegram ?? '')
    return isExternalUrlChanged || isDiscordChanged || isTwitterChanged || isTelegramChanged
  }
  
  const handleSaveOnChain = async () => {
    if (!communityInfo?.node) return
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    if (!changed.accountConfig) {
      message({ type: 'warning', content: 'Nothing to update.' }, { t: 'brand-profile-setting', k: communityInfo.node.node })
      return
    }
    try {
      setLoading(true)
      const chainId = communityInfo.chainId as number
      await updateCommunityBrandConfig(communityInfo.node.tokenId, {
        image: form.image || DEFAULT_AVATAR,
        brandImage: form.brandImage,
        brandColor: form.brandColor,
        description: form.description,
        externalUrl: form.externalUrl,
        discord: form.discord,
        twitter: form.twitter,
        telegram: form.telegram
      }, { chainId })
      await updateCommunity(communityInfo.node.node, true)
      message({ type: 'success', content: 'Update successfully!' }, { t: 'brand-profile-setting', k: communityInfo.node.node  })
      // handleClose?.()
      // refreshInfo()
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to update setting: ' + formatContractError(e),
      }, { t: 'brand-profile-setting', k: communityInfo.node.node  })
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
      image: communityInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (communityInfo?.tokenUri?.image ?? ''),
      brandImage: communityInfo?.tokenUri?.brand_image ?? '',
      brandColor: communityInfo?.tokenUri?.brand_color ?? '',
      description: communityInfo?.tokenUri?.description ?? '',
      externalUrl: communityInfo?.tokenUri?.external_url ?? '',
      discord: String(communityInfo?.tokenUri?.attr?.discord ?? ''),
      twitter: String(communityInfo?.tokenUri?.attr?.twitter ?? ''),
      telegram: String(communityInfo?.tokenUri?.attr?.telegram ?? ''),
    })
  }

  useEffect(() => {
    if (!communityInfo.tokenUri) return
    setValidation({})
    handleReset()
  }, [communityInfo])

  return (
    <div className="modal-content-container relative h-full flex flex-col">
      <div className='flex-1 modal-content overflow-auto'>
        <h1 className='text-main-black text-xl'>Social Media</h1>
        <div className='w-full mt-[30px] pb-10'>
          <ul className="w-full flex flex-col gap-5">
            {
              socials.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      classNames(
                        'w-full gap-[10px] flex flex-col',
                      )
                    }
                  >
                    <p className="text-sm-b text-main-black">{ item.label }</p>
                    <div className='flex-1'>
                      <Input
                        inputclassname='w-full'
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
          <div className='mt-10 divider-line'></div>
          <div className="mt-5 text-right">
            <span className="text-md-b text-primary underline underline-offset-2">Set Token-gated Group -&#62;</span>
          </div>
        </div>
      </div>
      {
        changed.accountConfig && (
          <SettingNotice loading={loading} onReset={handleReset} onSaveOnChain={handleSaveOnChain} />
        )
      }
    </div>
  )
}