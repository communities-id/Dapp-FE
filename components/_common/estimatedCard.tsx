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
  theme?: 'primary' | 'black' | 'variable',
  className?: string
}

const EstimatedCard: FC<Props> = ({ list, theme, className }) => {
  const total = list.reduce((acc, cur) => {
    return acc.add(BigNumber.from(cur.amount))
  }, BigNumber.from(0))

  return (
    <div className={`py-5 px-7.5 w-full bg-gray-6 rounded-xs text-md text-gray-1 ${className}`}>
      <ul className='flex flex-col gap-4'>
        {
          list.map((item, index) => {
            return (
              <li key={index} className='flex-itmc justify-between'>
                <span>{ item.name }</span>
                <b className={classNames('whitespace-nowrap', {
                  'text-primary': theme === 'primary',
                  'text-main-black': theme === 'black',
                  'var-brand-textcolor': theme === 'variable',
                })}>{ formatPrice(total) } { list[0].symbol }</b>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default EstimatedCard