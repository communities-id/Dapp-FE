import { FC, useEffect, useState } from 'react'
import Link from 'next/link'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi from '@/shared/useApi'
import { updateCommunity } from '@/shared/apis'

import Dialog from '@/components/common/dialog'
import CommunityProfileSetting, { CommunityProfileLabels } from '@/components/settings/community/profile'
import { formatContractError, isColor } from '@/shared/helper'
import { DEFAULT_AVATAR } from '@/shared/constant'

import TipIcon from '~@/icons/tip.svg'

interface Props {
  open: boolean
  handleClose?: () => void
}

const CommunityProfileSettingDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { communityInfo, refreshInfo } = useDetails()
  const { updateCommunityBrandConfig } = useApi()
  
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})

  const [form, setForm] = useState<Record<CommunityProfileLabels, string>>({
    image: communityInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (communityInfo?.tokenUri?.image ?? ''),
    brandImage: communityInfo?.tokenUri?.brand_image ?? '',
    backgroundColor: communityInfo?.tokenUri?.brand_color ?? '',
    description: communityInfo?.tokenUri?.description ?? '',
    externalUrl: communityInfo?.tokenUri?.external_url ?? '',
    discord: String(communityInfo?.tokenUri?.attr?.discord ?? ''),
    twitter: String(communityInfo?.tokenUri?.attr?.twitter ?? ''),
    telegram: String(communityInfo?.tokenUri?.attr?.telegram ?? ''),
  })

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
      backgroundColor: (value: string) => {
        if (isColor(value) || !value) {
          return
        }
        return 'Please enter a valid color code'
      },
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

  const needUpdate = () => {
    const isImageChanged = (form.image || DEFAULT_AVATAR) !== communityInfo?.tokenUri?.image
    const isBrandImageChanged = form.brandImage !== communityInfo?.tokenUri?.brand_image
    const isBackgroundColorChanged = form.backgroundColor !== communityInfo?.tokenUri?.brand_color
    const isDescriptionChanged = form.description !== communityInfo?.tokenUri?.description
    const isExternalUrlChanged = form.externalUrl !== communityInfo?.tokenUri?.external_url
    const isDiscordChanged = form.discord !== String(communityInfo?.tokenUri?.attr?.discord ?? '')
    const isTwitterChanged = form.twitter !== String(communityInfo?.tokenUri?.attr?.twitter ?? '')
    const isTelegramChanged = form.telegram !== String(communityInfo?.tokenUri?.attr?.telegram ?? '')
    return isImageChanged || isBrandImageChanged || isBackgroundColorChanged || isDescriptionChanged || isExternalUrlChanged || isDiscordChanged || isTwitterChanged || isTelegramChanged
  }
  
  const handleUpdate = async () => {
    if (!communityInfo?.node) return
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    if (!needUpdate()) {
      message({ type: 'warning', content: 'Nothing to update.' }, { t: 'brand-profile-setting', k: communityInfo.node.node })
      return
    }
    try {
      setLoading(true)
      const chainId = communityInfo.chainId as number
      await updateCommunityBrandConfig(communityInfo.node.tokenId, {
        image: form.image || DEFAULT_AVATAR,
        brandImage: form.brandImage,
        backgroundColor: form.backgroundColor,
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

  useEffect(() => {
    if (!communityInfo.tokenUri) return
    setValidation({})
    setForm({
      image: communityInfo?.tokenUri?.image === DEFAULT_AVATAR ? '' : (communityInfo?.tokenUri?.image ?? ''),
      brandImage: communityInfo?.tokenUri?.brand_image ?? '',
      backgroundColor: communityInfo?.tokenUri?.brand_color ?? '',
      description: communityInfo?.tokenUri?.description ?? '',
      externalUrl: communityInfo?.tokenUri?.external_url ?? '',
      discord: String(communityInfo?.tokenUri?.attr?.discord ?? ''),
      twitter: String(communityInfo?.tokenUri?.attr?.twitter ?? ''),
      telegram: String(communityInfo?.tokenUri?.attr?.telegram ?? ''),
    })
  }, [communityInfo])
  
  return (
    <Dialog
      open={open}
      title={
        <p className='flex items-center justify-center gap-2'>
          <span>Community Settings</span>
          <Link href='https://docs.communities.id/brand-guide/community-settings' target='_blank'>
            <TipIcon width='16' height='16' className='text-mintPurple'/>
          </Link>
        </p>
      }
      loading={loading}
      confirmText='Save on-chain'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleUpdate}>
      <CommunityProfileSetting
        form={form}
        validation={validation}
        loading={loading}
        handleChange={(name, value) => {
          setForm({ ...form, [name]: value })
        }}
        handleError={(error) => {
          message({ type: 'error', content: error }, { t: 'brand-profile-setting' })
        }}
      />
    </Dialog>
  )
}

export default CommunityProfileSettingDialog