import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import ToolTip from '@/components/common/tooltip'
import TipIcon from '~@/icons/tip.svg'

interface Props {
  sub?: boolean
  label: string
  tooltip?: string
  disabled?: boolean
  children?: ReactNode
}

const InfoLabel: FC<Props> = ({ sub, label, tooltip, disabled, children }) => {
  return (
    <div className={
      classnames(
        'w-full px-4 py-3 flex items-center justify-between bg-white',
        'text-mintProfileInput text-secondaryBlack placeholder:text-mintLabelGray placeholder:text-mintTipTitle',
        'rounded-[6px] border-[1px] border-solid border-[#e8e8e8] hover:border-[#757575]',
        {
          'cursor-not-allowed !bg-disabled !border-transparent': disabled,
        },
      )
    }>
      <span className={classnames('flex items-center gap-1 !font-medium text-mintLabelGray', {
        'text-mintTipTitle': !sub,
        'text-mintTipSubTitle': sub,
      })}>
        <span>{ label }</span>
        {
          tooltip && (
            <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: tooltip }}></div>}>
              <TipIcon width='16' height='16' className='text-mintPurple'/>
            </ToolTip>
          )
        }
      </span>
      { children }
    </div>
  )
}

export default InfoLabel