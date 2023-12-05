import { FC, use, useEffect, useState } from 'react'

import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import useApi, { getBurnMemberPrice } from '@/shared/useApi'

import { formatContractError, formatPrice } from '@/shared/helper'
import InfoLabel from '@/components/common/infoLabel'
import { BigNumber } from 'ethers'
import { BrandDID } from '@communitiesid/id'
import { updateCommunity } from '@/shared/apis'
import Button from '@/components/_common/button'

interface Props {
  open: boolean
}

const MemberBurnContent: FC<Props> = ({ open }) => {
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
      <div className='pt-[30px] px-[40px] h-full flex flex-col'>
        <h1 className='text-xl text-main-black text-center'>Burn User DID</h1>
        <p className='mt-10 sm:mt-5'>You can only burn a User DID during the Renewal period. Please wait until the Renewal period begins to perform this action.</p>
     </div>
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
      <p className='mt-5'>Are you sure you want to burn { `<${keywords}>` } to receive a refund? This action is irreversible, and the associated DID will be permanently removed.</p>
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