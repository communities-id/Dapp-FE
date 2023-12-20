import { FC, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi, { getrenewMemberPrice } from '@/shared/useApi'
import { formatPrice, toastError } from '@/shared/helper'

import InfoLabel from '@/components/common/infoLabel'
import { ZERO_ADDRESS } from '@/shared/constant'
import { BrandDID, UserDID } from '@communitiesid/id'
import { updateMember } from '@/shared/apis'
import Button from '@/components/_common/button'
import { MemberInfo, CommunityInfo } from '@/types'
import { useMemberContent } from '@/hooks/content'

interface Props {
  open: boolean
  name?: string
  memberInfo?: Partial<MemberInfo>
  brandInfo?: Partial<CommunityInfo>
  handleClose?: () => void
}

const MemberRenewContent: FC<Props> = ({ open, name, memberInfo: inputMemberInfo, brandInfo }) => {
  const { message } = useRoot()
  const { memberSetStatus, memberInfo } = useMemberContent({ memberName: name ?? '', memberInfo: inputMemberInfo, brandInfo })
  const { approveErc20, renewMember } = useApi()
  
  const shouldApproveCoin = useMemo(() => {
    if (!brandInfo?.config) return false
    return brandInfo?.config.coin !== ZERO_ADDRESS
  }, [brandInfo?.config])
  
  const [renewPrice, setRenewPrice] = useState<BigNumber>(BigNumber.from(0))
  const [protocolFee, setProtocolFee] = useState<BigNumber>(BigNumber.from(0))
  const [loading, setLoading] = useState(true)

  const handleGetMemberRenewPrice = async () => {
    if (!memberInfo?.node || !brandInfo?.node || !brandInfo.chainId) return

    try {
      setLoading(true)
      const price = await getrenewMemberPrice(memberInfo.node.node, memberInfo as UserDID)
      setRenewPrice(price.price)
      setProtocolFee(price.protocolFee)
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to get renew price: ', e, { t: 'member-renew', k: memberInfo.node.node, i: 1 })
    } finally {
      setLoading(false)
    }
  }
  
  const handleRenew = async () => {
    if (!memberInfo?.node || !brandInfo?.node) return
    const DIDName = `${memberInfo.node.node}.${brandInfo.tokenUri?.name}`
    try {
      setLoading(true)
      const chainId = brandInfo.chainId as number
      if (shouldApproveCoin && brandInfo.config) {
        await approveErc20?.(brandInfo.config.coin, brandInfo.node.registryInterface, { price: renewPrice, chainId })
      }
      const finalPrice = shouldApproveCoin ? protocolFee : renewPrice.add(protocolFee)
      await renewMember(brandInfo as BrandDID, memberInfo as UserDID, DIDName, { price: finalPrice, chainId })
      await updateMember(`${memberInfo.node.node}.${brandInfo.node.node}`, true)
      message({ type: 'success', content: 'Renew successfully!' }, { t: 'member-renew', k: DIDName })
      location.reload()
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to renew: ', e, { t: 'member-renew', k: DIDName, i: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    handleGetMemberRenewPrice()
  }, [open])

  if (!memberSetStatus.isRenewal) {
    return (
      <div className='pt-[30px] px-[40px] h-full flex flex-col'>
        <h1 className='text-xl text-main-black text-center'>Renew User DID</h1>
        <p className='mt-10 sm:mt-5'>You can only renew a User DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
     </div>
    )
  }

  const list = [
    {
      label: 'member',
      content: name
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
      content: `${formatPrice(renewPrice)}${brandInfo?.coinSymbol}`
    },
    {
      label: 'Protocol Fee',
      content: `${formatPrice(protocolFee)}${brandInfo?.communityCoinSymbol}`
    }
  ]
  
  return (
    <div className='pt-[30px] px-[40px] h-full flex flex-col'>
      <h1 className='text-xl text-main-black text-center'>Renew User DID</h1>
      <ul className='flex flex-col gap-3 mt-10 sm:mt-5'>
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
      <p className='mt-5'>Are you sure you want to renew { `<${name}>` }? Confirming this action will extend the validity of this DID.</p>
      <Button
        className='my-5'
        mode='full'
        theme='primary'
        loading={loading}
        disabled={loading}
        size='medium'
        onClick={() => handleRenew()}
      >Renew</Button>
    </div>
  )
}

export default MemberRenewContent