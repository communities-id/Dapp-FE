import { FC, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'

import { useRoot } from '@/contexts/root'
import { formatDate, formatPrice, toastError } from '@/shared/helper'
import { updateCommunity } from '@/shared/apis'
import useApi, { getRenewCommunityPrice } from '@/shared/useApi'
import { useDIDContent } from '@/hooks/content'

import InputNumber from '@/components/_common/inputNumber'
import Button from '@/components/_common/button'

import { CommunityInfo, State } from '@/types'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

const BrandMannageRenew: FC<Props> = ({ account, brandName, brandInfo: inputBrandInfo }) => {
  const { brandInfo  } = useDIDContent({ brandName, brandInfo: inputBrandInfo  })

  const _brandName = brandName ?? brandInfo?.node?.node ?? ''
  const isRenewal = brandInfo?.state === State.RESERVED
  const renewalTimeStart = brandInfo?.node?.expireTime ?? 0
  const renewalTimeEnd = (brandInfo?.node?.expireTime ?? 0) + 30 * 24 * 3600

  return (
    <div className="modal-content-container modal-content">
      <h1 className='text-main-black text-xl'>Renew</h1>
      <div className='w-full mt-[30px]'>
        {
          isRenewal ? (
            <Expired brandName={_brandName} brandInfo={brandInfo} renewalTimeStart={renewalTimeStart} renewalTimeEnd={renewalTimeEnd} />
          ) : (
            <Duration renewalTimeStart={renewalTimeStart} renewalTimeEnd={renewalTimeEnd} />
          )
        }
      </div>
    </div>
  )
}

export default BrandMannageRenew

interface ExpiredProps {
  brandName: string
  brandInfo: Partial<CommunityInfo>
  renewalTimeStart: number
  renewalTimeEnd: number
}
const Expired: FC<ExpiredProps> = ({ brandName, brandInfo, renewalTimeStart, renewalTimeEnd }) => {
  const { message, NetOps } = useRoot()
  const { renewCommunity } = useApi()
  
  const [renewPrice, setRenewPrice] = useState<number | BigNumber>(0)
  const [loading, setLoading] = useState(true)
  const [duration, setDuration] = useState(1)
  const range = [1, 1]

  const pending = loading || NetOps.loading

  const estimatePrice = `${formatPrice(renewPrice)}${brandInfo.communityCoinSymbol}`

  const handleGetCommunityRenewPrice = async () => {
    if (!brandInfo?.chainId) return
    try {
      setLoading(true)
      const { price } = await getRenewCommunityPrice(brandName, brandInfo.chainId)
      setRenewPrice(price || 0)
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to get renew price: ', e, { t: 'brand-renew', k: brandName, i: 1 })
    } finally {
      setLoading(false)
    }
  }
  
  const handleRenew = async () => {
    if (!brandInfo?.node) return
    const chainId = brandInfo.chainId as number
    await NetOps.handleSwitchNetwork(chainId)
    try {
      setLoading(true)
      await renewCommunity(brandInfo.node.node, { price: renewPrice, chainId })
      // handleClose?.()
      // refreshInfo()
      await updateCommunity(brandInfo.node.node, true)
      message({ type: 'success', content: 'Renew successfully!' }, { t: 'brand-renew', k: brandName  })
      location.reload()
    } catch (e) {
      console.error(e)
      toastError(message, 'Failed to renew: ', e, { t: 'brand-renew', k: brandName, i: 1  })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetCommunityRenewPrice()
  }, [])
  return (
    <div className='w-full rounded-md'>
      <div className='h-[105px] flex-center text-lgx text-white rounded-t-md bg-renew-bg bg-cover'>
        Next Renewal Date: &nbsp;<span className='font-normal'>{ formatDate(renewalTimeStart, 'YYYY/MM/DD') } - { formatDate(renewalTimeEnd, 'YYYY/MM/DD') }</span>
      </div>
      <div className='p-[30px] flex flex-col gap-[10px] bg-gray-6 rounded-b-md'>
        <InputNumber value={duration} range={range} onChange={setDuration}>
          { duration } Year
        </InputNumber>
        <div className='mt-5 w-full h-[1px] bg-gray-3'></div>
        <ul>
          <li className='flex justify-between text-sm leading-[32px]'>
            <span>Estimate Price</span>
            <b>{ estimatePrice }</b>
          </li>
          {/* <li className='flex justify-between text-sm leading-[32px]'>
            <span>Gas fee</span>
            <span>0.001341 ETH</span>
          </li>
          <li className='flex justify-between text-sm leading-[32px]'>
            <span>Extimated Total</span>
            <b>0.10134 ETH</b>
          </li> */}
        </ul>
      </div>
      <div className='mt-[30px] text-center'>
        <Button loading={pending} size='medium' className='w-60' onClick={handleRenew}>Renew</Button>
      </div>
    </div>
  )
}

interface DurationProps {
  renewalTimeStart: number
  renewalTimeEnd: number
}
const Duration: FC<DurationProps> = ({ renewalTimeStart, renewalTimeEnd }) => {

  return (
    <div className='w-full rounded-md bg-white'>
      <div className='h-[105px] flex-center text-lgx text-white rounded-t-md bg-renew-bg bg-cover'>
      Next Renewal Date:&nbsp;<span className='font-normal'>{ formatDate(renewalTimeStart, 'YYYY/MM/DD') } - { formatDate(renewalTimeEnd, 'YYYY/MM/DD') }</span>
      </div>
      <div className='flex flex-col gap-[10px] bg-white-tr-50 backdrop-blur-[20px] border border-solid border-gray-7 rounded-b-md'>
        <div className='pt-[100px] pb-[148px] px-[120px] text-md-b'>
          You can only renew a Brand DID during the Renewal period. Please wait until the Renewal period begins to perform this action.
        </div>
      </div>
    </div>
  )
}

