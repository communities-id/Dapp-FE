import { FC, ReactElement, forwardRef } from 'react'
import classnames from 'classnames'

import Fade from '@/components/transitions/fade'

import { Modal } from '@mui/base';
import { styled } from '@mui/system';
import FadeSlide, { FadeSlideProps } from '../transitions/fade-slide';

export interface Props {
  open: boolean
  center?: boolean
  wrapClassName?: string
  containerClassName?: string
  slideProps?: Partial<FadeSlideProps>
  backdropClassName?: string
  disabledAnimate?: boolean
  enableBackdropClick?: boolean
  handleClose?: () => void
  onBackdropClick?: () => void
  onClick?: (e: Event) => void
  children: ReactElement
}

const CIDModal: FC<Props> = ({ open, center = false, wrapClassName, containerClassName, backdropClassName, enableBackdropClick, disabledAnimate, slideProps, handleClose, onBackdropClick, onClick, children }) => {

  return (
    <StyledModal
      className={classnames('flex z-dialog', { 'flex-center': center }, wrapClassName)}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      closeAfterTransition
      open={open}
      onClose={handleClose}
      slots={{ backdrop: StyledBackdrop }}
      slotProps={{ backdrop: { className: backdropClassName, enableBackdropClick, onClick: onBackdropClick } }}
      onClick={onClick}
    >
      <FadeSlide
        className={classnames('relative z-dialog-content outline-none', containerClassName)}
        {...slideProps}
        disabled={disabledAnimate}
        in={open}>
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
  { open: boolean; className?: string; ownerState: any; enableBackdropClick?: boolean }
>((props, ref) => {
  const { open, className, ownerState, enableBackdropClick = false, ...other } = props;
  return (
    <Fade
      in={open}
      className={classnames({
        'z-dialog-backdrop': open,
        '-z-1': !open,
        'pointer-events-none': !enableBackdropClick
      }, className)}
      ref={ref}
      {...other}/>
  );
});

Backdrop.displayName = 'Dialog-Backdrop'

const StyledBackdrop = styled(Backdrop)(
  (props) => {
    return `
      position: fixed;
      right: 0;
      bottom: 0;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(50px);
      -webkit-tap-highlight-color: transparent;
    `
  }
);

export default CIDModal