import { FC, useState, useEffect, useRef, useCallback, ReactNode, Fragment } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

import CopyToClipboard from 'react-copy-to-clipboard'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import FadeSlide from '@/components/transitions/fade-slide'

import { Popper, Button, PopperPlacementType, ClickAwayListener } from '@mui/base'

export type PopoverMenuItem = { id: string | number; text: string; icon: ReactNode; loading?: boolean; disabled?: boolean; global?: boolean; clipboard?: string; handleCopied?: () => void; link?: string; linkSelf?: boolean; }

interface Props {
  id: string | number
  placement?: PopperPlacementType
  menus: PopoverMenuItem[]
  disabled?: boolean
  title?: string
  handleClick?: () => void
  handleSelect?: (menu: PopoverMenuItem) => void
  className?: string
  children?: ReactNode
}

const Popover: FC<Props> = ({ id, className, placement = 'bottom-end', menus, disabled, title, handleClick, handleSelect, children }) => {
  const [popperEl, setPopperEl] = useState<HTMLElement | null>(null)

  const open = Boolean(popperEl)
  const btnId = `popover-btn-${id}`

  const handleClose = (event: Event | React.SyntheticEvent) => {
    setPopperEl(null)
  };

  const handleChoose = (event: Event | React.SyntheticEvent, menu: PopoverMenuItem) => {
    if (menu.disabled) return
    handleClose(event)
    handleSelect?.(menu)
  };

  return (
    <div className={classnames('', className)}>
      <Button
        className={classnames('flex items-center justify-center', className)}
        aria-describedby={btnId}
        type="button"
        title={title}
        onClick={(e) => {
          if (disabled) {
            handleClick?.()
            return
          }
          setPopperEl(popperEl ? null : e.currentTarget)
        }}
      >
        { children }
      </Button>
      <Popper
        className='z-popover'
        id={btnId}
        open={open}
        anchorEl={popperEl}
        placement={placement}
        // disablePortal
      >
        <ClickAwayListener onClickAway={handleClose}>
          <FadeSlide in={open} offset={-10}>
            <ul className='mt-[4px] p-[10px] rounded-[6px] shadow-popover bg-white border-solid border-[1px] border-[#EAEAEA]'>
                {
                  menus.map((item, idx) => {
                    if (item.link) {
                      return (
                        <Link key={idx} href={item.link} target={`${item.linkSelf ? '_self' : '_blank'}`}>
                          <RenderPopoverMenuItem key={idx} menu={item} />
                        </Link>
                      )
                    }
                    return (
                      <RenderPopoverMenuItem key={idx} menu={item} handleClick={handleChoose} />
                    )
                  })
                }
              </ul>
          </FadeSlide>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default Popover

interface RenderPopoverMenuItemProps {
  menu: PopoverMenuItem
  handleClick?: (event: Event | React.SyntheticEvent, menu: PopoverMenuItem) => void
}

const RenderPopoverMenuItem: FC<RenderPopoverMenuItemProps> = ({ menu, handleClick }) => {
  return (
    <li
      className={
        classnames('flex items-center gap-[10px] hover:bg-tag px-[10px] py-[6px] text-popoverTag text-secondaryBlack rounded-[4px] cursor-pointer', {
          '!cursor-not-allowed !bg-disabled !border-transparent': menu.disabled,
        })
      }
      onClick={(e) => handleClick?.(e, menu)}>
        {
          menu.clipboard ? (
            <CopyToClipboard text={menu.clipboard} onCopy={menu.handleCopied}>
              <button type='button' className='flex items-center gap-[10px]'>
                { menu.icon }
                <span>{ menu.text }</span>
              </button>
            </CopyToClipboard>
          ) : (
            <Fragment>
              { menu.icon }
              <span>{ menu.text }</span>
            </Fragment>
          )
        }
    </li>
  )
}