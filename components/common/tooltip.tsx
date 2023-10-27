import { FC, ReactNode, useState } from 'react'
import classnames from 'classnames'

interface TooltipProps {
  mode?: 'sm' | 'lg' | 'md'
  content: ReactNode | string
  children: ReactNode
  className?: string
}

const ToolTip: FC<TooltipProps> = ({ mode = 'md', content, children, className }) => {

  return (
    <div
      className={classnames('relative group cursor-pointer')}>
      {children}
      <div
        className={classnames(
          'absolute left-0 z-tooltip !translate-y-full ',
          'whitespace-nowrap py-[10px] px-[16px] text-tooltip',
          'bg-white border-solid border-tooltip border-tooltip-border shadow-tooltip rounded-[6px]',
          'bottom-0 invisible opacity-0 group-hover:visible group-hover:opacity-100',
          'transition-all duration-300',
          {
            'group-hover:bottom-[-18px]': mode === 'lg',
            'group-hover:bottom-[-12px]': mode === 'md',
            'group-hover:bottom-[-6px]': mode === 'sm'
          },
          className
        )}>
        { content }
      </div>
    </div>
  )
}

export default ToolTip