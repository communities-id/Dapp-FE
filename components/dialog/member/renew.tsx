import { FC, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi, { getrenewMemberPrice } from '@/shared/useApi'
import { formatContractError, formatDate, formatPrice } from '@/shared/helper'

import Dialog from '@/components/common/dialog'
import InfoLabel from '@/components/common/infoLabel'
import { ZERO_ADDRESS } from '@/shared/constant'
import { BrandDID, UserDID } from '@communitiesid/id'
import { updateMember } from '@/shared/apis'

interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberRenewDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { communityInfo, memberInfo, memberInfoSet, keywords, refreshInfo } = useDetails()
  const { approveErc20, renewMember } = useApi()
  
  const shouldApproveCoin = useMemo(() => {
    if (!communityInfo.config) return false
    return communityInfo.config.coin !== ZERO_ADDRESS
  }, [communityInfo.config])
  
  const [renewPrice, setRenewPrice] = useState<BigNumber>(BigNumber.from(0))
  const [protocolFee, setProtocolFee] = useState<BigNumber>(BigNumber.from(0))
  const [loading, setLoading] = useState(true)

  const handleGetMemberRenewPrice = async () => {
    if (!memberInfo?.node || !communityInfo?.node || !communityInfo.chainId) return

    try {
      setLoading(true)
      const price = await getrenewMemberPrice(memberInfo.node.node, memberInfo as UserDID)
      setRenewPrice(price.price)
      setProtocolFee(price.protocolFee)
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to get renew price: ' + formatContractError(e),
      }, { t: 'member-renew', k: memberInfo.node.node, i: 1 })
    } finally {
      setLoading(false)
    }
  }
  
  const handleRenew = async () => {
    if (!memberInfo?.node || !communityInfo?.node) return
    const DIDName = `${memberInfo.node.node}.${communityInfo.tokenUri?.name}`
    try {
      setLoading(true)
      const chainId = communityInfo.chainId as number
      if (shouldApproveCoin && communityInfo.config) {
        await approveErc20?.(communityInfo.config.coin, communityInfo.node.registryInterface, { price: renewPrice, chainId })
      }
      const finalPrice = shouldApproveCoin ? protocolFee : renewPrice.add(protocolFee)
      await renewMember(communityInfo as BrandDID, memberInfo as UserDID, DIDName, { price: finalPrice, chainId })
      // handleClose?.()
      // refreshInfo()
      await updateMember(`${memberInfo.node.node}.${communityInfo.node.node}`, true)
      message({ type: 'success', content: 'Renew successfully!' }, { t: 'member-renew', k: DIDName })
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to renew: ' + formatContractError(e),
      }, { t: 'member-renew', k: DIDName, i: 1  })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    handleGetMemberRenewPrice()
  }, [open])

  if (!memberInfoSet.isRenewal) {
    return (
      <Dialog
        open={open}
        title='Renew User DID'
        center={false}
        disableCloseBtn
        confirmText='Close'
        handleClose={handleClose}
        handleConfirm={handleClose}>
          {/* <p>You can only renew this member after {formatDate(Number(memberInfo.node?.expireTime))}</p> */}
          <p>You can only renew a User DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
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
      content: 'renew'
    },
    {
      label: 'duration',
      content: '1 year'
    },
    {
      label: 'Price',
      content: `${formatPrice(renewPrice)}${communityInfo.coinSymbol}`
    },
    {
      label: 'Protocol Fee',
      content: `${formatPrice(protocolFee)}${communityInfo.communityCoinSymbol}`
    }
  ]
  
  return (
    <Dialog
      open={open}
      title='Renew User DID'
      center={false}
      loading={loading}
      confirmText='Renew'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleRenew}>
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
      <p className='mt-3'>Are you sure you want to renew { `<${keywords}>` }? Confirming this action will extend the validity of this DID.</p>
    </Dialog>
  )
}

export default MemberRenewDialog