import { FC, useEffect, useState } from 'react'

import MobileBrandManageLayout from '@/layouts/brand/mobileManage'
import { useDIDContent } from '@/hooks/content'
import { formatDate, formatPrice, toastError } from '@/shared/helper'

import InputNumber from '@/components/_common/inputNumber'
import Button from '@/components/_common/button'

import { CommunityInfo, State } from '@/types'
import { useRoot } from '@/contexts/root'
import { updateCommunity } from '@/shared/apis'
import useApi, { getRenewCommunityPrice } from '@/shared/useApi'
import { BigNumber } from 'ethers'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  onClose?: () => void
}
export default function MobileBrandMannageRenewContent({ account, brandName, brandInfo: inputBrandInfo, onClose }: Props) {
  const { brandInfo } = useDIDContent({ brandName, brandInfo: inputBrandInfo  })

  const _brandName = brandName ?? brandInfo?.node?.node ?? ''
  const isRenewal = brandInfo?.state === State.RESERVED

  return (
    <MobileBrandManageLayout
      title='Renew'
      brandColor={brandInfo?.tokenUri?.brand_color}
      onClose={onClose}
    >
      {
        isRenewal ? (
          <Expired brandName={_brandName} brandInfo={brandInfo} />
        ) : (
          <Duration expiredTime={brandInfo?.node?.expireTime ?? 0} />
        )
      }
    </MobileBrandManageLayout>
  )
}

interface ExpiredProps {
  brandName: string
  brandInfo: Partial<CommunityInfo>
}
const Expired: FC<ExpiredProps> = ({ brandName, brandInfo }) => {
  const { message, NetOps } = useRoot()
  const { renewCommunity } = useApi()
  
  const [renewPrice, setRenewPrice] = useState<number | BigNumber>(0)
  const [loading, setLoading] = useState(true)
  const [duration, setDuration] = useState(1)
  const range = [1, 1]

  const expiredTime = brandInfo?.node?.expireTime ?? 0

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
        Expire: { formatDate(expiredTime, 'YYYY-MM-DD') }
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
          </li> */}
          {/* <li className='flex justify-between text-sm leading-[32px]'>
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
  expiredTime: number
}
const Duration: FC<DurationProps> = ({ expiredTime }) => {
  return (
    <div className='w-full rounded-md bg-white'>
      <div className='h-[105px] flex-center text-lgx text-white rounded-t-md bg-renew-bg bg-cover'>
        Expire: { formatDate(expiredTime, 'YYYY-MM-DD') }
      </div>
      <div className='flex flex-col gap-[10px] bg-white-tr-50 backdrop-blur-[20px] border border-solid border-gray-7 rounded-b-md'>
        <div className='pt-[55px] pb-[75px] px-[30px] text-md-b text-black-tr-80'>
          You can only renew a Brand DID during the Renewal period. Please wait until the Renewal period begins to perform this action.
        </div>
      </div>
    </div>
  )
}
