import { FC, useRef, ReactNode, forwardRef } from 'react'
import classnames from 'classnames'

import Modal from '@/components/_common/modal';
import { Box, styled } from '@mui/system';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
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

const Dialog: FC<Props> = ({ open, center, hiddenCloseIcon, handleClose, wrapClassName, containerClassName, backdropClassName, contentClassName, className, children }) => {

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
            'max-h-[80vh] rounded-[30px] bg-white outline-none',
            className
          )
        }>
        {
          !hiddenCloseIcon && (
            <div
              className='absolute top-[30px] right-[30px] z-icon w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-[1px] border-solid border-gray-1'
              onClick={handleClose}
            >
              <CloseIcon width='16' height='16' className='text-gray-1' />
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
