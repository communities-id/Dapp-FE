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
      className={classnames('relative py-[10px] mr-12.5 sm:mr-10 text-searchTab', className)}>
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
    width: 100%;
    height: 3px;
    background-color: #8840FF;
    transform: translateX(-50%);
    pointer-events: none;
    visibility: hidden;
  }
  &.${tabClasses.selected} {
    --tw-text-opacity: 1;
    color: #363e49;
    &::after {
      visibility: visible;
    }
  }
`