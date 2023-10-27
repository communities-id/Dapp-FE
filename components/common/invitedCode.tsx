import { FC } from 'react'

import Input from '@/components/common/input'
import ToolTip from '@/components/common/tooltip'

import TipIcon from '~@/icons/tip.svg'

interface Props {
  value: string
  handleChange?: (value: string) => void
}

const InvitedCodeForm: FC<Props> = ({ value, handleChange }) => {
  const signatureTip = `If this is a private community, your should enter the signed message provided by your community in the "Generate Invited Code" field to verify your identity.`
  return (
    <div className='mt-[30px] w-full flex items-center'>
      <span>Invited Code</span>
      <span className='mr-[5px] text-mainRed'>*</span>
      <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: signatureTip }}></div>}>
        <TipIcon width='14' height='14' className='text-mintPurple' />
      </ToolTip>
      <span>:</span>
      <Input
        // className='flex-1'
        inputclassname='ml-1 flex-1'
        value={value}
        placeholder='input your Invited Code...'
        onChange={(e) => {
          handleChange?.(e.target.value)
        }} />
    </div>
  )
}

export default InvitedCodeForm