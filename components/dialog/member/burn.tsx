import { FC, use, useEffect, useState } from 'react'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi, { getBurnMemberPrice } from '@/shared/useApi'

import Dialog from '@/components/common/dialog'
import { formatContractError, formatPrice } from '@/shared/helper'
import InfoLabel from '@/components/common/infoLabel'
import { BigNumber } from 'ethers'
import { BrandDID } from '@communitiesid/id'
import { updateCommunity } from '@/shared/apis'


interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberBurnDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { memberInfo, communityInfo, memberInfoSet, community, keywords, refreshInfo } = useDetails()
  const { burnMember } = useApi()
  
  const [burnIncome, setBurnIncome] = useState(BigNumber.from(0))
  const [loading, setLoading] = useState(true)

  const handleGetMemberBurnIncome = async () => {
    if (!communityInfo.chainId || !communityInfo.node || !memberInfo.node) return
    try {
      setLoading(true)
      const income = await getBurnMemberPrice(communityInfo as BrandDID, memberInfo.node.node)
      setBurnIncome(income)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  
  const handleBurn = async () => {
    if (!communityInfo.node || !memberInfo.node) return
    const DIDName = `${memberInfo.node.node}.${communityInfo.tokenUri?.name}`
    try {
      setLoading(true)
      await burnMember(communityInfo as BrandDID, DIDName)
      // handleClose?.()
      // refreshInfo()
      message({ type: 'success', content: 'Burn successfully!' }, { t: 'member-burn', k: DIDName })
      await updateCommunity(communityInfo.node.node, true)
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to burn: ' + formatContractError(e),
      }, { t: 'member-burn', k: DIDName, i: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    handleGetMemberBurnIncome()
  }, [open])

  if (!memberInfoSet.isRenewal && !communityInfo.config?.burnAnytime) {
    return (
      <Dialog
        open={open}
        title='Burn User DID'
        center={false}
        disableCloseBtn
        confirmText='Close'
        handleClose={handleClose}
        handleConfirm={handleClose}>
          <p>You can only burn a User DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
      </Dialog>
    )
  }

  const list = [
    {
      label: 'member',
      content: keywords
    },
    {
      label: 'action',
      content: 'burn'
    },
    {
      label: 'estimate income',
      content: `${formatPrice(burnIncome)}${communityInfo.coinSymbol}`
    }
  ]
  
  return (
    <Dialog
      open={open}
      title='Burn User DID'
      center={false}
      loading={loading}
      confirmText='Burn'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleBurn}>
      <ul className='flex flex-col gap-3'>
        {
          list.map((item, idx) => {
            return (
              <li key={idx}>
                <InfoLabel label={ item.label }>
                  <span>{ item.content }</span>
                </InfoLabel>
              </li>
            )
          })
        }
      </ul>
      <p className='mt-3'>Are you sure you want to burn { `<${keywords}>` } to receive a refund? This action is irreversible, and the associated DID will be permanently removed.</p>
    </Dialog>
  )
}

export default MemberBurnDialog