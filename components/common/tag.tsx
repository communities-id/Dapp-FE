import { FC } from 'react'

import ToolTip from '@/components/common/tooltip'

import TipIcon from '~@/icons/tip.svg'
import classNames from 'classnames'

interface Props {
  theme?: 'info' | 'success' | 'warning' | 'error'
  text: string
  tooltip?: string
}

const Tag: FC<Props> = ({ theme = 'info', text, tooltip }) => {
  return (
    <div
      className={
        classNames('px-[6px] py-[4px] inline-flex items-center gap-1 rounded-[6px] text-statusTag', {
          'bg-info-tag text-info-tag': theme === 'info',
          'bg-success-tag text-success-tag': theme === 'success',
          'bg-pending-tag text-pending-tag': theme === 'warning',
          'bg-expired-tag text-expired-tag': theme === 'error',
        })
      }>
      <span>{ text }</span>
      <ToolTip mode='sm' content={<p>{ tooltip }</p>}>
        <TipIcon
          width='14'
          height='14'/>
      </ToolTip>
    </div>
  )
}

export default Tag