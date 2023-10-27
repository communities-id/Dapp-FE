import { FC, Fragment, useRef, useState, ReactNode } from 'react'
import { Transition } from 'react-transition-group'
import classnames from 'classnames'

import { styled } from '@mui/system'
import { Snackbar } from '@mui/base'
import { SnackbarCloseReason } from '@mui/base/useSnackbar'

import CloseIcon from '~@/icons/close.svg'

export type SnackbarType = 'success' | 'error' | 'warning'

interface Props {
  type: SnackbarType
  title: string
  content: ReactNode
  open: boolean
  handleClose?: () => void
  handleEnter?: () => void
  handleExited?: () => void
  className?: string
}

const _Snackbar: FC<Props> = ({ type, title, content, open, handleClose, handleEnter, handleExited, className }) => {
  const [exited, setExited] = useState(true)
  const nodeRef = useRef(null)

  const handleSelfClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    handleClose?.();
  };

  const handleOnEnter = () => {
    setExited(false);
    handleEnter?.();
  };

  const handleOnExited = () => {
    setExited(true);
    handleExited?.();
  };

  return (
    <Fragment>
      <StyledSnackbar
        className='z-snackbar'
        autoHideDuration={5000}
        open={open}
        onClose={handleSelfClose}
        exited={exited}
      >
        <Transition
          timeout={{ enter: 400, exit: 400 }}
          in={open}
          appear
          unmountOnExit
          onEnter={handleOnEnter}
          onExited={handleOnExited}
          nodeRef={nodeRef}
        >
          {(status) => (
            <SnackbarContent
              className={
                classnames(
                  'relative flex p-[14px] gap-[8px] border-none rounded-[6px] text-[14px] leading-[20px] overflow-hidden',
                  {
                    'bg-snackbar-success text-snackbar-success': type === 'success',
                    'bg-snackbar-error text-snackbar-error': type === 'error',
                    'bg-snackbar-warning text-snackbar-warning': type === 'warning',
                  },
                  className
                )
              }
              style={{
                transform: positioningStyles[status],
                transition: 'transform 300ms ease',
              }}
              ref={nodeRef}
            >
              <div className="flex-1 flex flex-col min-w-0">
                {/* <p className="font-medium">{ title }</p> */}
                <div className="font-normal">{ content }</div>
              </div>
              <CloseIcon width='18' height='18' className="cursor-pointer shrink-0 leading-none" onClick={handleClose} />
            </SnackbarContent>
          )}
        </Transition>
      </StyledSnackbar>
    </Fragment>
  );
}

export default _Snackbar

const StyledSnackbar = styled(Snackbar)`
  position: fixed;
  display: flex;
  bottom: 16px;
  right: 16px;
  max-width: 560px;
  min-width: 300px;
  `;

const SnackbarContent = styled('div')(
  ({ theme }) => `
    box-shadow: '0 2px 16px rgba(0,0,0, 0.5)';
  `,
);

const positioningStyles = {
  entering: 'translateX(0)',
  entered: 'translateX(0)',
  exiting: 'translateX(500px)',
  exited: 'translateX(500px)',
  unmounted: 'translateX(500px)',
};