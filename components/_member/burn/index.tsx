import { FC, use, useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { useRoot } from '@/contexts/root'
import useApi, { getBurnMemberPrice } from '@/shared/useApi'
import { formatPrice, toastError } from '@/shared/helper'
import { BrandDID } from '@communitiesid/id'
import { updateCommunity } from '@/shared/apis'
import { useMemberContent } from '@/hooks/content'

import Button from '@/components/_common/button'
import InfoLabel from '@/components/common/infoLabel'

import { CommunityInfo, MemberInfo } from '@/types'
interface Props {
  open: boolean
  name?: string
  memberInfo?: Partial<MemberInfo>
  brandInfo?: Partial<CommunityInfo>
}

const MemberBurnContent: FC<Props> = ({ open, name, memberInfo: inputMemberInfo, brandInfo }) => {
  const { message } = useRoot()
  const { burnMember } = useApi()
  const { memberSetStatus, memberInfo } = useMemberContent({ memberName: name ?? '', memberInfo: inputMemberInfo, brandInfo })
  
  const [burnIncome, setBurnIncome] = useState(BigNumber.from(0))
  const [loading, setLoading] = useState(true)

  const handleGetMemberBurnIncome = async () => {
    if (!brandInfo?.chainId || !brandInfo?.node || !memberInfo?.node) return
    try {
      setLoading(true)
      const income = await getBurnMemberPrice(brandInfo as BrandDID, memberInfo.node.node)
      setBurnIncome(income)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }
  
  const handleBurn = async () => {
    if (!brandInfo?.node || !memberInfo?.node) return
    const DIDName = `${memberInfo.node.node}.${brandInfo?.tokenUri?.name}`
    try {
      setLoading(true)
      await burnMember(brandInfo as BrandDID, DIDName)
      // handleClose?.()
      // refreshInfo()
      message({ type: 'success', content: 'Burn successfully!' }, { t: 'member-burn', k: DIDName })
      await updateCommunity(brandInfo?.node.node, true)
      location.reload()
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to burn: ', e, { t: 'member-burn', k: DIDName, i: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    handleGetMemberBurnIncome()
  }, [open])

  if (!memberSetStatus.isRenewal && !brandInfo?.config?.burnAnytime) {
    return (
      <div className='pt-[30px] px-[40px] h-full flex flex-col'>
        <h1 className='text-xl text-main-black text-center'>Burn User DID</h1>
        <p className='mt-10 sm:mt-5'>You can only burn a User DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
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
      content: 'burn'
    },
    {
      label: 'estimate income',
      content: `${formatPrice(burnIncome)}${brandInfo?.coinSymbol}`
    }
  ]
  
  return (
    <div className='pt-[30px] px-[40px] h-full flex flex-col'>
      <h1 className='text-xl text-main-black text-center'>Burn User DID</h1>
      <ul className='flex flex-col gap-3 mt-10  sm:mt-5'>
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
      <p className='mt-5'>Are you sure you want to burn { `<${name}>` } to receive a refund? This action is irreversible, and the associated DID will be permanently removed.</p>
      <Button
        className='my-5'
        mode='full'
        theme='primary'
        loading={loading}
        disabled={loading}
        size='medium'
        onClick={() => handleBurn()}
      >Burn</Button>
    </div>
  )
}

export default MemberBurnContent