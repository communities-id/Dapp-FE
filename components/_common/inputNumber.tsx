import { FC, useEffect, useState } from 'react'

import BaseButton from '@/components/_common/baseButton'

import MinusIcon from '~@/_brand/minus.svg'
import PlusIcon from '~@/_brand/plus.svg'

interface Props {
  value?: number
  range?: [number, number]
  handleChange?: (value: number) => void
  children?: React.ReactNode
}

const InputNumber: FC<Props> = ({ value = 0, range = [0, 10], handleChange, children }) => {
  const isMinimum = value <= range[0]
  const isMaximum = value >= range[1]

  const handleAdd = () => {
    if (isMaximum) return
    handleChange?.(value + 1)
  }

  const handleMinus = () => {
    if (isMinimum) return
    handleChange?.(value - 1)
  }

  return (
    <div className='w-full h-11 flex-center gap-1'>
      <BaseButton
        className='flex-center bg-white rounded-l-xs'
        size='medium'
        disabled={isMinimum}
        onClick={handleMinus}>
        <MinusIcon width='30' height='30' className='text-main-black' />
      </BaseButton>
      <div className='h-full flex-1 flex-center bg-white text-md !font-bold'>
        { children }
      </div>
      <BaseButton
        className='flex-center bg-white rounded-r-xs'
        size='medium'
        disabled={isMaximum}
        onClick={handleAdd}>
        <PlusIcon width='30' height='30' className='text-main-black' />
      </BaseButton>
    </div>
  )
}

export default InputNumber