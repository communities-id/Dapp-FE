import { FC, useMemo, useState, MouseEvent, forwardRef, ReactElement, Ref } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

import { useWallet } from '@/hooks/wallet'
import { useDetails } from '@/contexts/details'
import { useRootConfig } from '@/contexts/root'
import { useSearch } from '@/hooks/search'
import { useDisconnect } from 'wagmi'
import { parseImgSrc } from '@/shared/helper'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { TransitionProps } from '@mui/material/transitions';
import AvatarCard from '@/components/common/avatar'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import PrimaryDID from '@/components/common/primaryDID'
import Button from '@/components/solid/Button'
import SearchForm from '@/components/solid/SearchForm'

import LightLogo from '~@/logo/inline-light.svg'
import DarkLogo from '~@/logo/inline-dark.svg'
import InlineLogo from '~@/logo/inline.svg'
import ConnectionSvg from '~@/icons/connection.svg'

// import EthereumSvg from '~@/icons/wallet/ethereum.svg'
import WalletIcon from '~@/icons/wallet/wallet.svg'
import SearchSvg from '~@/icons/search.svg'
import WalletSvg from '~@/icons/wallet/wallet.svg'
import BrokenChainSvg from '~@/icons/wallet/chain-broken.svg'
// import AccountSvg from '~@/icons/wallet/account.svg'
// import DiscountSvg from '~@/icons/wallet/discount.svg'
import AccountSvg from '~@/icons/header/account.svg'
import LogoutSvg from '~@/icons/header/logout.svg'

interface Props {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { stickyMenu, navigationOpen, toggleNavigationOpen, darkMode, toggleDarkMode } = useRootConfig()
  const router = useRouter()
  const { handleSearch } = useSearch()
  const { disconnect } = useDisconnect()

  const selfHandleSearch = async (value: string) => {
    await handleSearch(value)
  }

  const handleDisconnect = async () => {
    // return disconnectWallet()
    return disconnect()
  }

  return (
    <header className={classnames('w-full z-header py-0 lg:py-4 bg-transparent', className)}>
      <div className="mx-auto max-w-c-800">
        <div
          className={classnames(
            'relative w-full flex items-center justify-end', {
            'h-auto max-h-[400px] overflow-y-scroll rounded-md mt-4 p-4': navigationOpen
          })}
        >
          <SearchForm inputClassName='selection-text'>
            <span className='mx-[14px] inline-block w-[1px] h-[10px] bg-search-drivier'></span>
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
                      <button
                        className='flex items-center justify-center bg-mintPurple w-[34px] h-[34px] rounded-full'
                        onClick={() => {
                          openConnectModal()
                        }}
                      >
                        <WalletIcon className='w-[20px] h-[20px] text-white' />
                      </button>
                    )
                  }
                  if (chain?.unsupported) {
                    return (
                      <button
                        className='flex items-center justify-center bg-[#F4943B] w-[34px] h-[34px] rounded-full'
                        onClick={() => {
                          openChainModal()
                        }}
                      >
                        <ConnectionSvg width="20" className='text-white'/>
                      </button>
                    )
                  }

                  return (
                    <AccountInfo
                      address={account?.address ?? ''}
                      theme='light'
                      darkMode={darkMode}
                      toggleDarkMode={toggleDarkMode}
                      handleDisconnect={handleDisconnect}
                      handleSearch={selfHandleSearch}
                      handleSearchDone={toggleNavigationOpen}/>
                  )
                }
              }
            </ConnectButton.Custom>
          </SearchForm>
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
  const { ownerMemberInfo } = useDetails()

  return (
    <>
      <div className="dropdown dropdown-end w-[34px] h-[34px]">
        <div className='leading-[0px]'>
          <label
            tabIndex={0}
            className="inline-block w-[34px] h-[34px] rounded-full bg-mintPurple cursor-pointer">
              {
                ownerMemberInfo?.tokenUri?.image ? (
                  <AvatarCard size={34} src={ownerMemberInfo?.tokenUri?.image} className='!rounded-full'/>
                ) : <Jazzicon diameter={34} seed={jsNumberForAddress(address)} />
              }
          </label>
          <ul
            tabIndex={0}
            className={
              classnames(
                'menu text-base-content p-2 w-48 dropdown-content shadow-section mt-4 bg-base-100 rounded-box',
                'bg-search-form-focus-bg',
                'text-white'
              )
            }>
            {/* pc */}
            <li className='block rounded-t-[inherit] rounded-b-none'>
              <div
                className='hover:bg-[#313641]'
                onClick={(e) => {
                  e.stopPropagation()
                  handleSearch(address)
                }}
              >
                <AccountSvg width="22" height="22"/>
                <span>My Account</span>
              </div>
            </li>
            <li className='rounded-b-[inherit]'>
              <div
                className='w-full rounded-b-[inherit] hover:bg-[#313641]'
                onClick={(e) => {
                  e.stopPropagation()
                  handleDisconnect()
                }}>
                <LogoutSvg width="22" height="22"/>
                <span>Disconnect</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}