import { forwardRef } from 'react';
import classnames from 'classnames'
import styled from '@emotion/styled';

import { Input, InputProps } from '@mui/base';

const CustomInput = forwardRef(function CustomInput(
  props: InputProps & { inputclassname?: string },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <Input
      className={
        classnames(
          'w-full px-4 py-3 flex items-center bg-white',
          'text-mintProfileInput text-secondaryBlack placeholder:text-mintLabelGray placeholder:text-mintTipTitle',
          'rounded-[6px] border-[1px] border-solid border-[#e8e8e8] hover:border-[#757575]',
          {
            'cursor-not-allowed !bg-disabled !border-transparent': props.disabled,
          },
          props.inputclassname
        )
      }
      slots={{ input: StyledInputElement, textarea: StyledTextareaElement }}
      slotProps={{ input: { className: 'disabled:bg-disabled disabled:cursor-not-allowed' }, ...props.slotProps }}
      {...props}
      ref={ref} />
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