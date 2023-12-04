import { FC } from 'react'

import Button from '@/components/_common/button'
import BaseButton from '@/components/_common/baseButton'

interface Props {
  loading?: boolean
  onReset?: () => void
  onSaveOnChain?: () => void
}

const SettingNotice: FC<Props> = ({ loading, onReset, onSaveOnChain }) => {
  return (
    <div className='modal-notice'>
      <div className='modal-notice-content bg-white gap-5'>
        <p className='flex-1'>Notice! You haven&apos;t saved your changes yet</p>
        <div className='flex items-center gap-4'>
          <BaseButton
            className='w-auto text-xs text-main-black'
            size='short'
            disabled={loading}
            onClick={onReset}
          >
            <span>Reset</span>
          </BaseButton>
          <Button
            className='w-32 flex-center var-brand-bgcolor'
            size='short'
            theme='primary'
            loading={loading}
            onClick={onSaveOnChain}
          >
            <span>Save On-Chain</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingNotice