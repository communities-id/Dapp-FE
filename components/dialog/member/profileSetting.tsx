import { FC, useEffect, useState } from 'react'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi from '@/shared/useApi'

import Dialog from '@/components/common/dialog'
import MemberProfileSetting, { MemberProfileLabels } from '@/components/settings/member/profile'
import { formatContractError } from '@/shared/helper'
import { updateMember as updateMemberInDB } from '@/shared/apis'

interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberSettingDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { communityInfo, memberInfo, refreshInfo } = useDetails()
  const { updateMember } = useApi()
  
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<Record<MemberProfileLabels, string>>({
    externalUrl: memberInfo?.tokenUri?.external_url ?? '',
    discord: String(memberInfo?.tokenUri?.attr?.discord ?? ''),
    twitter: String(memberInfo?.tokenUri?.attr?.twitter ?? ''),
    telegram: String(memberInfo?.tokenUri?.attr?.telegram ?? ''),
  })

  const needUpdate = () => {
    const isExternalUrlChanged = form.externalUrl !== memberInfo?.tokenUri?.external_url
    const isDiscordChanged = form.discord !== String(memberInfo?.tokenUri?.attr?.discord ?? '')
    const isTwitterChanged = form.twitter !== String(memberInfo?.tokenUri?.attr?.twitter ?? '')
    const isTelegramChanged = form.telegram !== String(memberInfo?.tokenUri?.attr?.telegram ?? '')
    return isExternalUrlChanged || isDiscordChanged || isTwitterChanged || isTelegramChanged
  }
  
  const handleUpdate = async () => {
    if (!communityInfo?.node || !memberInfo?.node) return
    if (!needUpdate()) {
      message({ type: 'success', content: 'Nothing to update.' })
      return
    }
    try {
      setLoading(true)
      const chainId = communityInfo.chainId as number
      await updateMember(communityInfo.node.registry, memberInfo.node.node, {
        externalUrl: form.externalUrl,
        discord: form.discord,
        twitter: form.twitter,
        telegram: form.telegram
      }, { chainId })
      // handleClose?.()
      // refreshInfo()
      await updateMemberInDB(`${memberInfo.node.node}.${communityInfo.node.node}`)
      message({ type: 'success', content: 'Update successfully!' })
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to update: ' + formatContractError(e),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!memberInfo?.tokenUri) return
    setForm({
      externalUrl: memberInfo?.tokenUri?.external_url ?? '',
      discord: String(memberInfo?.tokenUri?.attr?.discord ?? ''),
      twitter: String(memberInfo?.tokenUri?.attr?.twitter ?? ''),
      telegram: String(memberInfo?.tokenUri?.attr?.telegram ?? ''),
    })
  }, [memberInfo])
  
  return (
    <Dialog
      open={open}
      title='Profile Setting'
      loading={loading}
      confirmText='Save on-chain'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleUpdate}>
      <MemberProfileSetting
        form={form}
        loading={loading}
        handleChange={(name, value) => {
          setForm({ ...form, [name]: value })
        }}
      />
    </Dialog>
  )
}

export default MemberSettingDialog