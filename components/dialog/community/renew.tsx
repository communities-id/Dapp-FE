import { FC, use, useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi, { getRenewCommunityPrice } from '@/shared/useApi'
import { formatContractError, formatPrice, formatDate } from '@/shared/helper'

import Dialog from '@/components/common/dialog'
import InfoLabel from '@/components/common/infoLabel'
import { updateCommunity } from '@/shared/apis'

interface Props {
  open: boolean
  handleClose?: () => void
}

const CommunityRenewDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { communityInfo, communityInfoSet, community, refreshInfo } = useDetails()
  const { renewCommunity } = useApi()
  
  const [renewPrice, setRenewPrice] = useState<number | BigNumber>(0)
  const [loading, setLoading] = useState(true)

  const handleGetCommunityRenewPrice = async () => {
    if (!communityInfo?.chainId) return
    try {
      setLoading(true)
      const { price } = await getRenewCommunityPrice(community, communityInfo.chainId)
      setRenewPrice(price || 0)
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to get renew price: ' + formatContractError(e),
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleRenew = async () => {
    if (!communityInfo?.node) return
    try {
      setLoading(true)
      const chainId = communityInfo.chainId as number
      await renewCommunity(communityInfo.node.node, { price: renewPrice, chainId })
      // handleClose?.()
      // refreshInfo()
      await updateCommunity(communityInfo.node.node, true)
      message({ type: 'success', content: 'Renew successfully!' })
      location.reload()
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to renew: ' + formatContractError(e),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    handleGetCommunityRenewPrice()
  }, [open])
  
  if (!communityInfoSet.isRenewal) {
    return (
      <Dialog
        open={open}
        title='Renew Brand DID'
        center={false}
        disableCloseBtn
        confirmText='Close'
        handleClose={handleClose}
        handleConfirm={handleClose}>
          {/* <p>You can only renew this community after {formatDate(Number(communityInfo.node?.expireTime))}</p> */}
          <p>You can only renew a Brand DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
      </Dialog>
    )
  }

  const list = [
    {
      label: 'community',
      content: community
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
      label: 'estimate price',
      content: `${formatPrice(renewPrice)}${communityInfo.communityCoinSymbol}`
    },
    // {
    //   label: 'estimate gas',
    //   content: `${formatPrice(gasFee)}${communityInfo.communityCoinSymbol}`
    // }
  ]
  
  return (
    <Dialog
      open={open}
      title='Renew Brand DID'
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
        <p className='mt-3'>Are you sure you want to renew { `<.${community}>` }? Confirming this action will extend the validity of this DID.</p>
    </Dialog>
  )
}

export default CommunityRenewDialog