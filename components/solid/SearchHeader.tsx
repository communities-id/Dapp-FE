import { FC, FormEvent, useEffect, useState } from "react"
import classnames from 'classnames'

import Link from "next/link"
import { useSearch } from "@/hooks/search"
import { useDisconnect } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { execSearch, formatAddress } from "@/shared/helper"
import { SearchMode } from "@/types"
import { useSearchParams } from "next/navigation"

import SearchSvg from '~@/icons/search.svg'
import DarkLogo from '~@/logo/inline-dark.svg'
import WalletSvg from '~@/icons/wallet/wallet.svg'
import ConnectionSvg from '~@/icons/connection.svg'
import AccountSvg from '~@/icons/header/account.svg'
import LogoutSvg from '~@/icons/header/logout.svg'
import LogoWithColor from "../common/LogoWithColor"
import { useDetails } from "@/contexts/details"
import SearchSuggestion from "../dialog/searchSuggestion"

const SearchHeader: FC = () => {
  const { handleSearch } = useSearch()
  const { disconnect } = useDisconnect()
  const { communityInfo } = useDetails()
  const keywords = useSearchParams().get('keywords') as string
  const [searchValue, setSearchValue] = useState('')
  const [searchSuggestionOpen, setSearchSuggestionOpen] = useState(false)

  useEffect(() => {
    if (!keywords) return
    const { type, community } = execSearch(keywords)
    if (SearchMode[type] === SearchMode.community) {
      setSearchValue(community)
    } else {
      setSearchValue(keywords)
    }
  }, [keywords])

  function renderAccountButton(options: any) {
    const { account, chain, openAccountModal, openChainModal, openConnectModal, mounted }= options
    const className = "button-xl bg-primary text-white flex items-center gap-[10px]"
    const connected = mounted && account && chain
    const bgStyle = {
      backgroundColor: communityInfo.tokenUri?.brand_color ?? '#8840FF'
    }
    if (!connected) {
      return (
        <button className={className} style={bgStyle} onClick={openConnectModal}>
          <WalletSvg className="w-5 h-5"/>
          <span>Connect</span>
        </button>
      )
    }
    if (chain?.unsupported) {
      return (
        <button className={className} style={bgStyle} onClick={openChainModal}>
          <ConnectionSvg className="w-5 h-5"/>
          <span>Switch chain</span>
        </button>
      )
    }

    const address = account.address
    return (
      <>
        <div className="dropdown dropdown-end">
          <div className='leading-[0px]'>
            <label tabIndex={0} className={className} style={bgStyle}>
              {formatAddress(address)}
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

  return (
    <header className="header-container sticky top-7 w-full z-30">
      <div className="dapp-container bg-white h-20 rounded-[40px] pl-10 pr-3 flex justify-between items-center border border-gray-7">
        <div className="flex justify-start gap-[30px] items-center">
          <Link href="/" className='inline-block w-[165px]'>
            <LogoWithColor className="dark:hidden w-full" color={communityInfo.tokenUri?.brand_color ?? ''} />
            <DarkLogo className="hidden dark:block w-full"/>
          </Link>
          <div className="search">
            <div className="search-form bg-gray-6 h-14 rounded-lg flex justify-start items-center pl-6 gap-4 cursor-text" role="button" onClick={() => setSearchSuggestionOpen(true)}>
              <SearchSvg className="w-6 h-6" />
              <span>{searchValue}</span>
            </div>
          </div>
        </div>
        <ConnectButton.Custom>
          {props => renderAccountButton(props)}
        </ConnectButton.Custom>
      </div>
      <SearchSuggestion open={searchSuggestionOpen} handleClose={() => setSearchSuggestionOpen(false)}/>
    </header>
  )
}

export default SearchHeader