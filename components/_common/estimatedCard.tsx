import { FC } from 'react'

import { BigNumber } from 'ethers'
import { formatPrice } from '@/shared/helper'
import classNames from 'classnames'

interface Props {
  list: {
    name: string
    amount: number | BigNumber
    symbol: string
  }[]
  theme?: 'primary' | 'black' | 'variable'
}

const EstimatedCard: FC<Props> = ({ list, theme }) => {
  const total = list.reduce((acc, cur) => {
    return acc.add(BigNumber.from(cur.amount))
  }, BigNumber.from(0))

  return (
    <div className='py-5 px-7.5 w-full bg-gray-6 rounded-xs text-md text-gray-1'>
      <ul className='flex flex-col gap-4'>
        {
          list.map((item, index) => {
            return (
              <li key={index} className='flex-itmc justify-between'>
                <span>{ item.name }</span>
                <span>{ formatPrice(item.amount) } { item.symbol }</span>
              </li>
            )
          })
        }
      </ul>
      <div className='my-4 w-full h-[1px] bg-gray-7'></div>
      <div className='flex-itmc justify-between'>
        <span>Estimated Total</span>
        <b className={classNames({
          'text-primary': theme === 'primary',
          'text-main-black': theme === 'black',
          'var-brand-textcolor': theme === 'variable',
        })}>{ formatPrice(total) } { list[0].symbol }</b>
      </div>
    </div>
  )
}

export default EstimatedCard