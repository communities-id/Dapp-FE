import { FC, FormEvent, useEffect, useState } from "react"
import classnames from 'classnames'

import Link from "next/link"
import { useSearch } from "@/hooks/search"
import { useDisconnect } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { execSearch, formatAddress } from "@/shared/helper"
import { SearchMode } from "@/types"
import { useSearchParams } from "next/navigation"
import themeColor from '@/_themes/colors'

import SearchSvg from '~@/icons/search.svg'
import DarkLogo from '~@/logo/inline-dark.svg'
import WalletSvg from '~@/icons/wallet/wallet.svg'
import ConnectionSvg from '~@/icons/connection.svg'
import AccountSvg from '~@/icons/header/account.svg'
import LogoutSvg from '~@/icons/header/logout.svg'
import UserSvg from '~@/icons/user.svg'
import LogoWithColor from "../common/LogoWithColor"
import { useDetails } from "@/contexts/details"
import SearchSuggestion from "../dialog/searchSuggestion"
import styled from "@emotion/styled"
import { useRouter } from 'next/router'


interface Props {
  className?: string
}

const SearchHeader: FC<Props> = ({ className }) => {
  const { handleSearch } = useSearch()
  const { disconnect } = useDisconnect()
  const { communityInfo } = useDetails()
  const router = useRouter()
  const keywords = useSearchParams().get('keywords') as string
  const [searchValue, setSearchValue] = useState('')
  const [searchSuggestionOpen, setSearchSuggestionOpen] = useState(false)
  const [showBg, setShowBg] = useState(false)

  const brandColor = communityInfo.tokenUri?.brand_color || themeColor.primary
  const brandStyle = {
    backgroundColor: brandColor,
    '&:hover': {
      backgroundColor: `${brandColor}cc`
    }
  }

  useEffect(() => {
    if (!keywords) return
    const { type, community } = execSearch(keywords)
    if (SearchMode[type] === SearchMode.community) {
      setSearchValue(community)
    } else {
      setSearchValue(keywords)
    }
  }, [keywords])

  useEffect(() => {
    const scrollContainer = document.querySelector('#__next')
    if (scrollContainer)  {
      scrollContainer.addEventListener('scroll', () => {
        setShowBg(scrollContainer.scrollTop > 100)
      })
    }
  }, [router.pathname])

  function renderAccountButton(options: any, isMobile = false) {
    const { account, chain, openChainModal, openConnectModal, mounted }= options
    const className = "button-xl w-auto text-white flex items-center gap-[10px] flex-shrink-0"
    const connected = mounted && account && chain
    const BrandButton = styled('button')(brandStyle)
    const BrandLabel = styled('label')(brandStyle)
    if (!connected) {
      if (isMobile) {
        return (
          <button onClick={openConnectModal}>
            <WalletSvg className="w-6 h-6"/>
          </button>
        )
      }
      return (
        <BrandButton className={className} onClick={openConnectModal}>
          <WalletSvg className="w-5 h-5"/>
          <span>Connect</span>
        </BrandButton>
      )
    }
    if (chain?.unsupported) {
      if (isMobile) {
        return (
          <button onClick={openChainModal}>
            <ConnectionSvg className="w-6 h-6"/>
          </button>
        )
      }
      return (
        <BrandButton className={className}  onClick={openChainModal}>
          <ConnectionSvg className="w-5 h-5"/>
          <span>Switch chain</span>
        </BrandButton>
      )
    }

    const address = account.address

    return (
      <>
        <div className="dropdown dropdown-end dropdown-hover">
          <div className='leading-[0px]'>
            { isMobile ? (
                <label tabIndex={0}>
                  <UserSvg className="w-6 h-6" />
                </label>
              ) : (
                <BrandLabel tabIndex={0} className={className}>
                  <WalletSvg className="w-5 h-5 flex-shrink-0"/>
                  <span>{formatAddress(address)}</span>
                </BrandLabel>
              ) 
            }
            <ul
              tabIndex={0}
              className={
                classnames(
                  'menu text-base-content p-2 w-48 dropdown-content shadow-section bg-base-100 rounded-box',
                  'bg-white text-main-black'
                )
              }>
              <li className='block rounded-t-[inherit] rounded-b-none'>
                <div
                  className='hover:bg-[#0001]'
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
                  className='w-full rounded-b-[inherit] hover:bg-[#0001]'
                  onClick={(e) => {
                    e.stopPropagation()
                    disconnect()
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

  const searchHeaderPC = (
    <header className={`header-container sticky top-0 w-full z-30 sm:hidden py-7 ${className} ${showBg ? 'with-bg' : ''}`}>
      <div className="dapp-container bg-white h-20 rounded-[40px] pl-10 pr-3 flex justify-between items-center border border-gray-7 gap-10">
        <div className="flex justify-start gap-[30px] items-center w-full">
          <Link href="/" className='inline-block w-[165px] flex-shrink-0'>
            <LogoWithColor className="dark:hidden w-full" color={brandColor} />
            <DarkLogo className="hidden dark:block w-full"/>
          </Link>
          <div className="w-full">
            <div className="bg-gray-6 h-14 rounded-lg flex justify-start items-center pl-6 gap-4 cursor-pointer w-full" role="button" onClick={() => setSearchSuggestionOpen(true)}>
              <SearchSvg className="w-6 h-6 text-gray-4" />
              <span className={`w-full overflow-hidden overflow-ellipsis pr-3 ${!searchValue ? 'text-gray-4' : ''}`}>{searchValue || 'Search for brand name, user name or wallet adderss'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-20 items-center">
          <Link href="/ecosystem" className="text-main-black text-md-b font-bold">Ecosystem</Link>
          <ConnectButton.Custom>
            {props => renderAccountButton(props)}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  )

  const searchHeaderMobile = (
    <header className="pc:hidden pt-safe h-12.5 bg-white flex justify-between px-4 items-center border-b border-gray-7 relative z-100">
      <Link href="/" className='inline-block w-[165px]'>
        <LogoWithColor className="dark:hidden w-full" color={communityInfo.tokenUri?.brand_color ?? ''} />
        <DarkLogo className="hidden dark:block w-full"/>
      </Link>
      <div className="flex gap-4">
        <button onClick={() => setSearchSuggestionOpen(true)}>
          <SearchSvg className="w-6 h-6 text-black-1" />
        </button>
        <ConnectButton.Custom>
          {props => renderAccountButton(props, true)}
        </ConnectButton.Custom>
      </div>
    </header>
  )

  return (
    <>
      {searchHeaderPC}
      {searchHeaderMobile}
      <SearchSuggestion open={searchSuggestionOpen} handleClose={() => setSearchSuggestionOpen(false)}/>
    </>
  )
}

export default SearchHeader