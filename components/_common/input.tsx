import { forwardRef, useState } from 'react';
import classnames from 'classnames'
import styled from '@emotion/styled';

import { Input, InputProps } from '@mui/base';

const CustomInput = forwardRef(function CustomInput(
  props: InputProps & { inputclassname?: string; mode?: 'normal' | 'greyish' },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { mode = 'normal' } = props
  const [focused, setFocused] = useState(false)

  return (
    <Input
      className={
        classnames(
          'w-full px-4 py-3 flex items-center',
          'text-md-b text-main-black placeholder:text-tr-black-4',
          'rounded-[6px] border-[1px] border-solid border-gray-3',
          {
            'cursor-not-allowed !bg-disabled !border-transparent': props.disabled,
            '!bg-white': focused,
            'bg-gray-6': mode === 'greyish'
          },
          props.inputclassname
        )
      }
      slots={{ input: StyledInputElement, textarea: StyledTextareaElement }}
      slotProps={{ input: { className: 'disabled:bg-disabled disabled:cursor-not-allowed' }, ...props.slotProps }}
      {...props}
      ref={ref}
      onFocusCapture={() => {
        setFocused(true)
      }}
      onBlurCapture={() => {
        setFocused(false)
      }}
    />
  );
});

export default CustomInput;

const StyledInputElement = styled('input')`
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  background: inherit;
  border: none;
  border-radius: inherit;
  outline: 0;
`;

const StyledTextareaElement = styled('textarea')`
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  background: inherit;
  border: none;
  border-radius: inherit;
  outline: 0;
  resize: none;
`;