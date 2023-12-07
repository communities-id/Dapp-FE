import { FC, useMemo, useState, MouseEvent, forwardRef, ReactElement, Ref } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

import { useRootConfig } from '@/contexts/root'
import { useSearch } from '@/hooks/search'
import { useDisconnect } from 'wagmi'

import { Dialog, DialogContent, Box, Backdrop, Slide, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { ConnectButton } from '@rainbow-me/rainbowkit'
import PrimaryDID from '@/components/common/primaryDID'
import Button from '@/components/solid/Button'
import SearchForm from '@/components/solid/SearchForm'

import LightLogo from '~@/logo/inline-light.svg'
import DarkLogo from '~@/logo/inline-dark.svg'
import InlineLogo from '~@/logo/inline.svg'

// import EthereumSvg from '~@/icons/wallet/ethereum.svg'
import SearchSvg from '~@/icons/search.svg'
import WalletSvg from '~@/icons/wallet/wallet.svg'
import BrokenChainSvg from '~@/icons/wallet/chain-broken.svg'
// import AccountSvg from '~@/icons/wallet/account.svg'
// import DiscountSvg from '~@/icons/wallet/discount.svg'
import AccountSvg from '~@/icons/header/account.svg'
import LogoutSvg from '~@/icons/header/logout.svg'
import MoonSvg from '~@/icons/header/nightmode.svg'
import SunSvg from '~@/icons/header/lightmode.svg'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface Props {
  isStatic: boolean
  showSearch: boolean
}

const Header: FC<Props> = ({ isStatic, showSearch }) => {
  const { stickyMenu, navigationOpen, toggleNavigationOpen, darkMode, toggleDarkMode } = useRootConfig()
  const router = useRouter()
  const { handleSearch } = useSearch()
  const { disconnect } = useDisconnect()

  const isSearch = useMemo(() => router.pathname === '/search', [router.pathname])

  const selfHandleSearch = async (value: string) => {
    await handleSearch(value)
  }

  const handleDisconnect = async () => {
    // return disconnectWallet()
    return disconnect()
  }

  return (
    <header
      className={classnames('fixed left-0 top-0 w-full z-header py-0 home-lg:py-4 transition-[padding] duration-100', {
        'bg-navbar dark:bg-navbarDark shadow backdrop-saturate-[180%] backdrop-blur-[16px]' : stickyMenu,
        'bg-white dark:bg-black': isStatic
      })}
    >
      <div className="mx-auto max-w-c-1390 px-4 home-md:px-8 home-2xl:px-0 home-lg:flex items-center justify-between relative">
        <div className="w-full home-lg:w-1/4 flex items-center justify-between">
          <div className='w-[115px] home-lg:w-[192px] leading-none'>
            <Link href="/" className='inline-block w-full'>
              <LightLogo className="dark:hidden w-full"/>
              <DarkLogo className="hidden dark:block w-full"/>
            </Link>
        </div>

          {/* mobile: menu */}
          <div className="home-lg:hidden block">
            <ConnectButton.Custom>
              {
                ({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted
                }) => {
                  const connected = mounted && account && chain
                  if (!connected) {
                    return (
                      <Button theme='dark' type="button" onClick={() => {
                        openConnectModal()
                      }}>
                        <WalletSvg width="28" height="28"/>
                      </Button>
                    )
                  }
                  if (chain.unsupported) {
                    return (
                      <Button theme='primary' type="button" onClick={() => {
                        openChainModal()
                      }}>
                        <BrokenChainSvg width="28" height="28"/>
                      </Button>
                    )
                  }

                  // to do openChainModal
                  return <MobileAccountInfo
                    address={account.address ?? ''}
                    theme={isSearch ? 'light' : 'dark'}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleDisconnect={handleDisconnect}
                    handleSearch={selfHandleSearch}
                    handleSearchDone={toggleNavigationOpen}/>
                }
              }
            </ConnectButton.Custom>
          </div>
        </div>

        {
          showSearch ? (
            <div className='hidden home-lg:block'>
              <SearchForm />
            </div>
          ) : null
        }
        <div
          className={classnames('min-w-[220px] h-0 home-lg:h-auto invisible home-lg:visible home-lg:flex items-center justify-end overflow-hidden home-lg:overflow-visible', {
            '!visible bg-white dark:bg-blacksection shadow-solid-5 h-auto max-h-[400px] overflow-y-scroll rounded-md mt-4 p-4': navigationOpen
          })}
        >
          <div className="flex items-center gap-6">
            <div className={classnames('hidden home-lg:block mr-1.5 absolute home-lg:static top-1 right-17 !visible')}>
              {/* <label className="block m-0 relative">
                <input
                  type="checkbox"
                  checked={darkMode}
                  className="cursor-pointer w-full h-full opacity-0 absolute top-0 z-50 m-0"
                  onChange={() => {
                    toggleDarkMode()
                  }} />
                <SunSvg className="dark:hidden" width="22" height="22"/>
                <MoonSvg className="hidden dark:block" width="22" height="22"/>
              </label> */}
            </div>

            <ConnectButton.Custom>
              {
                ({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted
                }) => {
                  const connected = mounted && account && chain
                  if (!connected) {
                    return (
                      <Button theme='primary' className='px-10 ease-in-out duration-300' onClick={() => {
                        openConnectModal()
                      }}>Connect</Button>
                    )
                  }
                  if (chain.unsupported) {
                    return (
                      <Button theme='primary' className='px-10 ease-in-out duration-300' onClick={() => {
                        openChainModal()
                      }}>Wrong network</Button>
                    )
                  }

                  // to do openChainModal
                  return <AccountInfo
                    address={account.address ?? ''}
                    theme={isSearch ? 'light' : 'dark'}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleDisconnect={handleDisconnect}
                    handleSearch={selfHandleSearch}
                    handleSearchDone={toggleNavigationOpen}/>
                }
              }
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


interface AccountInfoProps {
  address: string
  theme: 'dark' | 'light'
  darkMode: boolean
  toggleDarkMode: () => void
  handleDisconnect: () => void
  handleSearch: (address: string) => void
  handleSearchDone: () => void
}

export const AccountInfo: FC<AccountInfoProps> = ({ address, theme, darkMode, toggleDarkMode, handleDisconnect, handleSearch, handleSearchDone }) => {
  return (
    <>
      <div className="dropdown dropdown-end w-full home-lg:w-auto home-lg:bg-[#efefef] dark:home-lg:bg-[transparent] home-lg:rounded-[16px]">
        <div className='block home-lg:hidden'>
          <SearchForm
            className="block p-0 my-[12px] h-[48px]"
            inputClassName="w-full"
            handleDone={handleSearchDone} />
        </div>
        <div className='px-4 home-lg:px-0'>
          <label
            tabIndex={0}
            className="px-0 home-lg:px-[16px] h-[50px] home-lg:h-3 btn !border-none !bg-transparent hover:!bg-[#eee] text-current rounded-btn pointer-events-none home-lg:pointer-events-auto home-lg:backdrop-blur-[30px]">
            <WalletSvg width="24" height="24" className="mr-[6px] text-[#3D4451] dark:text-white"/>
            <div className={classnames('text-neutral dark:text-white text-[18px] home-lg:text-[14px] lowercase')}>&nbsp;<PrimaryDID address={address} noLink/></div>
          </label>
          <label className="home-lg:hidden h-[50px] flex items-center gap-[0.75rem] font-normal text-[#181C30] dark:text-white m-0 relative">
            <input
              type="checkbox"
              checked={darkMode}
              className="cursor-pointer w-full h-full opacity-0 absolute top-0 z-50 m-0"
              onChange={() => {
                toggleDarkMode()
              }} />
            <SunSvg className="dark:hidden" width="22" height="22"/>
            <MoonSvg className="hidden dark:block" width="22" height="22"/>
            <span className='dark:hidden'>Light Mode</span>
            <span className='hidden dark:block'>Dark Mode</span>
          </label>
          <ul
            tabIndex={0}
            className={
              classnames(
                'menu text-base-content p-0 home-lg:p-2 w-full home-lg:w-48 home-lg:dropdown-content home-lg:shadow-section home-lg:mt-4 bg-base-100 rounded-box',
                'bg-transparent home-lg:bg-white home-lg:dark:bg-[rgba(24,28,28,.8)]',
                'text-black dark:text-white'
              )
            }>
            {/* pc */}
            <li className='hidden home-lg:block rounded-t-[inherit] rounded-b-none'>
              <div onClick={() => handleSearch(address)}>
                <AccountSvg width="22" height="22"/>
                <span>My Account</span>
              </div>
            </li>
            <li className='hidden home-lg:block rounded-b-[inherit]'>
              <button className='w-full rounded-b-[inherit]' onClick={() => handleDisconnect()}>
                <LogoutSvg width="22" height="22"/>
                <span>Disconnect</span>
              </button>
            </li>
            {/* mobile */}
            {/* <li className='block home-lg:hidden'>
              <SearchForm
                mobile
                className="block p-0 my-[12px] h-[48px]"
                inputClassName="w-full" />
            </li> */}
            <li className='block home-lg:hidden'>
              <div className='p-0 py-[12px]' onClick={() => handleSearch(address)}>
                <AccountSvg width="22" height="22"/>
                <span>My Account</span>
              </div>
            </li>
            <li className='block home-lg:hidden'>
              <button className='p-0 py-[12px]' onClick={() => handleDisconnect()}>
                <LogoutSvg width="22" height="22"/>
                <span>Disconnect</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export const MobileAccountInfo: FC<AccountInfoProps> = ({ address, theme, darkMode, toggleDarkMode, handleDisconnect, handleSearch, handleSearchDone }) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  const toggleDrawer = (bool = !showDrawer) => {
    return () => {
      setShowDrawer(bool)
    }
  }

  const toggleSearch = (bool = !showSearch) => {
    return () => {
      setShowSearch(bool)
    }
  }

  // const list = () => (
  //   <Box
  //     sx={{ width: '80vw' }}
  //     role="presentation"
  //     onClick={toggleDrawer()}
  //     onKeyDown={toggleDrawer()}
  //   >
  //     <List>
  //       <ListItem disablePadding>
  //         <ListItemButton onClick={toggleDarkMode}>
  //           <ListItemIcon>
  //             <SunSvg className="dark:hidden" width="24" height="24"/>
  //             <MoonSvg className="hidden dark:block" width="24" height="24"/>
  //           </ListItemIcon>
  //           <ListItemText>
  //             <span className='dark:hidden'>Light Mode</span>
  //             <span className='hidden dark:block'>Dark Mode</span>
  //           </ListItemText>
  //         </ListItemButton>
  //       </ListItem>
  //       <ListItem disablePadding onClick={() => handleSearch(address)}>
  //         <ListItemButton>
  //           <ListItemIcon>
  //             <AccountSvg width="24" height="24"/>
  //           </ListItemIcon>
  //           <ListItemText>
  //             <PrimaryDID address={address} />
  //           </ListItemText>
  //         </ListItemButton>
  //       </ListItem>
  //       <ListItem disablePadding onClick={() => handleDisconnect()}>
  //         <ListItemButton>
  //           <ListItemIcon>
  //             <LogoutSvg width="24" height="24"/>
  //           </ListItemIcon>
  //           <ListItemText>
  //             <span>Disconnect</span>
  //           </ListItemText>
  //         </ListItemButton>
  //       </ListItem>
  //     </List>
  //     {/* <Divider /> */}
  //   </Box>
  // );
  return (
    <>
      <div className='flex items-center gap-[24px]'>
        <Button
          theme='normal'
          className="flex items-center px-0 h-[40px] btn border-[1px] !border-transparent !bg-transparent hover:!bg-[#eee] text-current rounded-btn"
          onClick={toggleSearch(true)}>
          <SearchSvg width="24" height="24" className="text-[#3D4451] dark:text-white stroke-[1.5px]"/>
        </Button>
        <Button
          id="basic-button"
          theme='normal'
          className="flex items-center gap-[6px] px-0 h-[40px] btn border-[1px] !border-transparent !bg-transparent hover:!bg-[#eee] text-current rounded-btn"
          onClick={toggleDrawer(true)}>
          <AccountSvg width="24" height="24" className="text-[#3D4451] dark:text-white"/>
        </Button>
        {/* <div>
          <Button
            id="basic-button"
            aria-controls={showMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={showMenu ? 'true' : undefined}
            theme='normal'
            className="flex items-center gap-[6px] px-0 h-[50px] btn border-[1px] !border-transparent !bg-transparent hover:!bg-[#eee] text-current rounded-btn"
            onClick={handleShowMenu}>
            <AccountSvg width="36" height="36" className="text-[#3D4451] dark:text-white"/>
          </Button>
          <Menu
            id="basic-menu"
            open={showMenu}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem className='p-0 py-[12px]' onClick={() => handleDisconnect(true)}>
              <LogoutSvg width="22" height="22"/>
              <span>Disconnect</span>
            </MenuItem>
            <MenuItem className='p-0 py-[12px]' onClick={() => handleSearch(address, true)}>
              <AccountSvg width="22" height="22"/>
              <span>My Account</span>
            </MenuItem>
            <MenuItem className='p-0 py-[12px]' onClick={() => handleDisconnect(true)}>
              <LogoutSvg width="22" height="22"/>
              <span>Disconnect</span>
            </MenuItem>
          </Menu>
        </div> */}
      </div>
      {/* <Drawer
        className='z-9999'
        anchor='bottom'
        open={showDrawer}
        onClose={toggleDrawer(false)}
      >
        { list() }
      </Drawer> */}
      <Dialog
        fullWidth
        fullScreen
        disableEscapeKeyDown
        aria-describedby="alert-dialog-slide-description"
        // TransitionComponent={Transition}
        keepMounted
        className='!m-0'
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }
        }}
        slots={{
          backdrop: styled(Backdrop)`
            background-color: rgba(255, 255, 255, .6);
            backdrop-filter: blur(20px);
          `
        }}
        open={showSearch}
        onClick={toggleSearch(false)}>
        <DialogContent
          id="alert-dialog-slide-description"
          sx={{
            marginTop: '36px',
            padding: '0 12px'
          }}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <div className='mb-[16px] flex justify-center'>
              <LightLogo width="142" className="block dark:hidden"/>
              <DarkLogo width="142" className="hidden dark:block"/>
            </div>
            <OutlinedInput
              className='w-full outline-none bg-white placeholder:text-placeholder text-[16px]'
              placeholder='Search Community,identity,address'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchSvg width="24" height="24" />
                  </IconButton>
                </InputAdornment>
              }
              sx={{ height: '46px', lineHeight: '46px' }}
              onChange={(e) => {
                setSearchText(e.target.value)
              }}
            />
          </Box>
        </DialogContent>
        {/* <DialogActions className='mt-[24px] !justify-center gap-[12px]'>
          <Button
            theme='normal'
            className="flex items-center justify-center px-0 w-[40px] !h-[40px] text-white bg-black rounded-[6px]"
            onClick={() => {
              toggleSearch(false)()
              handleSearch(searchText)
              setSearchText('')
            }}>
            <SearchSvg width="24" height="24" className="stroke-[1.5px]"/>
          </Button>
          <Button
            theme='normal'
            className="flex items-center justify-center px-0 w-[40px] !h-[40px] text-white bg-black rounded-[6px]"
            onClick={toggleSearch(false)}>
            <CloseIcon width="20" height="20" />
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  )
}