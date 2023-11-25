import { FC } from 'react'

import { formatDate } from '@/shared/helper'

import InputNumber from '@/components/_common/inputNumber'
import Button from '@/components/_common/button'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

const BrandMannageRenew: FC<Props> = ({ brandInfo }) => {
  const expiredTime = brandInfo?.node?.expireTime ?? 0
  console.log('- expiredTime', expiredTime, 'brandInfo', brandInfo)
  return (
    <div className="modal-content-container modal-content">
      <h1 className='text-main-black text-xl'>Renew</h1>
      <div className='w-full mt-[30px]'>
        <Duration expiredTime={expiredTime} />
      </div>
    </div>
  )
}

export default BrandMannageRenew

interface ExpiredProps {

}
const Expired: FC<ExpiredProps> = () => {
  return (
    <div className='w-full rounded-md'>
      <div className='h-[105px] flex-center text-lgx text-white rounded-t-md bg-renew-bg bg-cover'>
        Expire: 2024-11-01
      </div>
      <div className='p-[30px] flex flex-col gap-[10px] bg-gray-6 rounded-b-md'>
        <InputNumber>1 Year</InputNumber>
        <div className='mt-5 w-full h-[1px] bg-gray-3'></div>
        <ul>
          <li className='flex justify-between text-sm leading-[32px]'>
            <span>Extension fee</span>
            <span>0.1 ETH</span>
          </li>
          <li className='flex justify-between text-sm leading-[32px]'>
            <span>Gas fee</span>
            <span>0.001341 ETH</span>
          </li>
          <li className='flex justify-between text-sm leading-[32px]'>
            <span>Extimated Total</span>
            <b>0.10134 ETH</b>
          </li>
        </ul>
      </div>
      <div className='mt-[30px] text-center'>
        <Button size='medium' className='w-60'>Renew</Button>
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
        <div className='pt-[100px] pb-[148px] px-[120px] text-md-b'>
          You can only renew a Brand DID during the Renewal period. Please wait until the Renewal period begins to perform this action.
        </div>
      </div>
    </div>
  )
}

