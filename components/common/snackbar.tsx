import { FC, Fragment, useRef, useState, ReactNode } from 'react'
import { Transition } from 'react-transition-group'
import classnames from 'classnames'

import { styled } from '@mui/system'
import { Snackbar } from '@mui/base'
import { SnackbarCloseReason } from '@mui/base/useSnackbar'

import SuccessIcon from '~@/icons/toast/success.svg'
import ErrorIcon from '~@/icons/toast/error.svg'
import InfoIcon from '~@/icons/toast/info.svg'

export type SnackbarType = 'success' | 'error' | 'warning' | 'info'

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

  function renderIcon() {
    if (type === 'info') {
      return <InfoIcon />
    }
    if (type === 'success') {
      return <SuccessIcon />
    }
    if (type === 'error') {
      return <ErrorIcon />
    }
    if (type === 'warning') {
      return <ErrorIcon />
    }
  }

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
                  'relative flex items-center p-[10px] pr-5 gap-[2px] border border-gray-7 bg-white rounded-[6px] text-[14px] leading-[20px] overflow-hidden snack-toast',
                  className
                )
              }
              style={{
                transform: positioningStyles[status],
                transition: 'transform 300ms ease',
              }}
              ref={nodeRef}
            >
              {renderIcon()}
              <div className="flex-1 flex flex-col min-w-0">
                {/* <p className="font-medium">{ title }</p> */}
                <div className="font-normal max-w-[600px]">{ content }</div>
              </div>
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