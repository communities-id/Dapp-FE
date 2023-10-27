import { FC, useState } from 'react'
import styled from '@emotion/styled'
import classnames from 'classnames'

import { Tab, tabClasses } from '@mui/base'

interface Props {
  value: number
  children?: React.ReactNode
  className?: string
}

const _Tab: FC<Props> = ({ value, children, className }) => {
  
  return (
    <Tab
      value={value}
      className={classnames('relative ml-[-20px] px-[20px] py-[10px] text-searchTab', className)}>
        { children }
    </Tab>
  )
}

export default styled(_Tab)`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 30px;
    height: 3px;
    background-color: #8840FF;
    transform: translateX(-50%);
    pointer-events: none;
    visibility: hidden;
  }
  &.${tabClasses.selected} {
    --tw-text-opacity: 1;
    color: rgb(136 63 255 / var(--tw-text-opacity));
    &::after {
      visibility: visible;
    }
  }
`