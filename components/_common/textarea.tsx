import { FC, forwardRef } from 'react';
import classnames from 'classnames'

import Input from '@/components/_common/input';

interface Props {
  value: string
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  maxLength?: number
  onChange?: (value: string) => void
}
const TextArea: FC<Props> = ({ value, placeholder, loading, disabled, maxLength, onChange }) => {
  return (
    <div className='w-full relative'>
      <Input
        inputclassname='!p-5'
        multiline
        rows={4}
        placeholder={placeholder}
        value={value}
        disabled={loading || disabled}
        onChange={(e) => {
          const _value = e.target.value
          onChange?.(maxLength ? _value.slice(0, maxLength) : _value)
        }}
      />
      {
        maxLength && (
          <div className='absolute right-5 bottom-0 w-full z-normal flex justify-end'>
            <b>{ value.length }</b>
            <span>&nbsp;/&nbsp;</span>
            <span>{ maxLength }</span>
          </div>
        )
      }
    </div>
  )
}

export default TextArea;