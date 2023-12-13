import { FC, useRef, ReactNode, forwardRef } from 'react'
import classnames from 'classnames'

import Modal from '@/components/_common/modal';
import { Box, styled } from '@mui/system';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
  theme?: 'small' | 'normal'
  open: boolean
  center?: boolean
  hiddenCloseIcon?: boolean
  wrapClassName?: string
  containerClassName?: string
  backdropClassName?: string
  contentClassName?: string
  className?: string
  handleClose?: () => void
  children: ReactNode
}

const Dialog: FC<Props> = ({ theme = 'normal', open, center, hiddenCloseIcon, handleClose, wrapClassName, containerClassName, backdropClassName, contentClassName, className, children }) => {

  return (
    <Modal
      wrapClassName={wrapClassName}
      containerClassName={containerClassName}
      backdropClassName={backdropClassName}
      open={open}
      center={center}
      handleClose={handleClose}
    >
      <Box
        className={
          classnames(
            'md:max-h-[80vh] bg-white outline-none',
            {
              'rounded-[10px]': theme === 'small',
              'rounded-[30px]': theme === 'normal'
            },
            className
          )
        }>
        {
          !hiddenCloseIcon && (
            <div
              className={
                classnames(
                  'absolute z-icon flex-center cursor-pointer',
                  {
                    'top-[30px] right-[30px] w-8 h-8 rounded-full border-[1px] border-solid border-gray-1': theme === 'normal',
                    'top-[14px] right-[14px] w-5 h-5 cursor-pointer': theme === 'small'
                  }
                )
              }
              onClick={handleClose}
            >
              <CloseIcon width='20' height='20' className='text-gray-1' />
            </div>
          )
        }
        <div className={classnames('w-full overflow-auto rounded-[30px]', contentClassName)}>
          {children}
        </div>
      </Box>
    </Modal>
  )
}

export default Dialog
