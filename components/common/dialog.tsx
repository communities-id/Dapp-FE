import { FC, useRef, ReactNode, forwardRef } from 'react'
import classnames from 'classnames'

import Fade from '@/components/transitions/fade'
import FadeSlide from '@/components/transitions/fade-slide'

import MintButton from '@/components/mint/button';

import { Modal } from '@mui/base';
import { Box, styled } from '@mui/system';

import CloseIcon from '~@/icons/close.svg'

interface Props {
  title: string | ReactNode
  open: boolean
  transparent?: boolean
  center?: boolean
  loading?: boolean
  disableCloseBtn?: boolean
  closeText?: string
  confirmText?: string
  hiddenTitle?: boolean
  hiddenCloseIcon?: boolean
  hiddenActions?: boolean
  disabledAnimate?: boolean
  handleClose?: () => void
  handleConfirm?: () => void
  wrapClassName?: string
  backdropClassName?: string
  contentClassName?: string
  className?: string
  children: ReactNode
}

const Dialog: FC<Props> = ({ title, open, transparent, center = true, loading, disableCloseBtn, closeText = 'Cancel', confirmText = 'Save', hiddenTitle, hiddenCloseIcon, hiddenActions = false, disabledAnimate, handleClose, handleConfirm, wrapClassName, backdropClassName, contentClassName, className, children }) => {
  // const nodeRef = useRef(null)

  return (
    <StyledModal
      className={classnames('flex items-center justify-center z-dialog', wrapClassName)}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      closeAfterTransition
      open={open}
      // center={center}
      onClose={handleClose}
      slots={{ backdrop: StyledBackdrop }}
      slotProps={{ backdrop: { className: backdropClassName } }}
    >
      <FadeSlide disabled={disabledAnimate} in={open} className='relative z-dialog-content outline-none'>
        <Box
          className={
            classnames(
              'w-[600px] max-h-[80vh] py-[30px] rounded-[10px] bg-white border-[1px] border-solid border-[#e4e4e4] outline-none',
              'flex flex-col items-center justify-center',
              {
                '!bg-transparent !border-none select-none': transparent,
              },
              // {
              //   'items-center': center,
              //   'mt-[20%]': !center,
              // },
              className
            )
          }>
          {
            !hiddenTitle && (
              <h1 className='pb-[20px] text-mintProfileTitle text-dark'>{ title }</h1>
            )
          }
          {
            !hiddenCloseIcon && (
              <CloseIcon width='20' height='20' className='absolute top-[14px] right-[10px] cursor-pointer' onClick={handleClose} />
            )
          }
          <div className={classnames('mt-[10px] px-[40px] pb-[10px] flex-1 w-full overflow-auto', contentClassName)}>
            {children}
          </div>
          {
            !hiddenActions && (
              <div className='mt-[10px] px-[40px] pt-[20px] flex items-center justify-center gap-[10px] w-full'>
                {
                  !disableCloseBtn && (
                    <MintButton size='fixed' theme='pink' disabled={loading} onClick={handleClose}>{ closeText }</MintButton>
                  )
                }
                <MintButton loading={loading} size={disableCloseBtn ? 'full' : 'fixed'} theme='purple' onClick={handleConfirm}>{ confirmText }</MintButton>
              </div>
            )
          }
        </Box>
      </FadeSlide>
    </StyledModal>
  )
}

export default Dialog

const StyledModal = styled(Modal)(
  (props) => {
    return `
      position: fixed;
      right: 0;
      bottom: 0;
      top: 0;
      left: 0;
    `
  }
);

const Backdrop = forwardRef<
  HTMLDivElement,
  { open: boolean; className?: string; ownerState: any }
>((props, ref) => {
  const { open, className, ownerState, ...other } = props;
  return (
    <Fade
      in={open}
      className={classnames({
        'z-dialog-backdrop': open
      }, className)}
      ref={ref}
      {...other}/>
  );
});

Backdrop.displayName = 'Dialog-Backdrop'

const StyledBackdrop = styled(Backdrop)(
  (props) => {
    return `
      z-index: -1;
      position: fixed;
      right: 0;
      bottom: 0;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(50px);
      -webkit-tap-highlight-color: transparent;
      pointer-events: none;
    `
  }
);