import { FC, ReactNode } from 'react'
import classNames from 'classnames'

import Input from '@/components/common/input'
import ToolTip from '@/components/common/tooltip'

import TipIcon from '~@/icons/tip.svg'

interface Props {
  label: string
  tooltip?: string
  unit?: string
  primary?: boolean
  value: string | number
  placeholder?: string
  disabled?: boolean
  endAdornment?: ReactNode
  className?: string
  handleChange?: (value: string | number) => void
}

const LabelInput: FC<Props> = ({ label, tooltip, unit, primary, value, placeholder, disabled, endAdornment, className, handleChange }) => {
  return (
    <div className={classNames('w-full', className)}>
      <div className='flex items-end justify-between'>
        <label className='flex items-center'>
          <span className="mr-1">{ label }</span>
          {
            primary ? <span className='mr-[5px] text-mainRed'>*</span> : null
          }
          {
            tooltip ? (
              <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: tooltip }}></div>}>
                <TipIcon width='14' height='14' className='text-mintPurple' />
              </ToolTip>
            ) : null
          }
        </label>
        { unit && <span className='text-mintUnit text-mainGray'>{ unit }</span> }
      </div>
      <Input
        inputclassname='mt-[10px]'
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        endAdornment={endAdornment}
        onChange={(e) => {
          handleChange?.(e.target.value)
        }} />
    </div>
  )
}

export default LabelInput
