import { FC, ReactElement, forwardRef } from 'react'
import classnames from 'classnames'

import Fade from '@/components/transitions/fade'

import { Modal } from '@mui/base';
import { styled } from '@mui/system';
import FadeSlide from '../transitions/fade-slide';

interface Props {
  open: boolean
  wrapClassName?: string
  handleClose?: () => void
  onClick?: (e: Event) => void
  backdropClassName?: string
  disabledAnimate?: boolean
  children: ReactElement
}

const CIDModal: FC<Props> = ({ open, wrapClassName, backdropClassName, children, disabledAnimate, handleClose, onClick }) => {

  return (
    <StyledModal
      className={classnames(wrapClassName, 'flex items-center justify-center z-dialog')}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      closeAfterTransition
      open={open}
      onClose={handleClose}
      slots={{ backdrop: StyledBackdrop }}
      slotProps={{ backdrop: { className: backdropClassName } }}
      onClick={onClick}
    >
      <FadeSlide disabled={disabledAnimate} in={open} className='relative z-dialog-content outline-none'>
        {children}
      </FadeSlide>
    </StyledModal>
  )
}

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

export default CIDModal