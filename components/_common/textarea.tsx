import { FC, forwardRef } from 'react';
import classnames from 'classnames'

import Input from '@/components/_common/input';

interface Props {
  value: string | number
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
}
const TextArea: FC<Props> = ({ value, placeholder, loading, disabled, onChange }) => {
  return (
    <Input
      inputclassname='!p-5'
      multiline
      rows={4}
      placeholder={placeholder}
      value={value}
      disabled={loading || disabled}
      onChange={(e) => {
        onChange?.(e.target.value)
      }}
    />
  )
}

export default TextArea;