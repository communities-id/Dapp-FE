import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { DetailsProvider } from '@/contexts/details'
import DividerLine from "@/components/common/dividerLine";
import SearchHeader from "@/components/solid/SearchHeader";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CHAINS_MINT_TOOLTIPS, CHAIN_ID, CHAIN_ID_MAP, MAIN_CHAIN_ID } from '@/shared/constant';
import ChainIcon from '@/components/common/chainIcon';
import Footer from '@/components/solid/Footer'

import ArrorBottomIcon from '@/public/icons/arrow-bottom.svg'
import StarIcon from '@/public/icons/star.svg'
import RoundedLogo from '@/public/logo-round.svg'
import { useWallet } from '@/hooks/wallet';
import { useSearch } from '@/hooks/search';

export default function Dapp() {

  const { handleSearch } = useSearch()
  const { address } = useWallet()
  const [anchorEl, setAnchorEl] = useState(null);
  const networkMenuOpen = Boolean(anchorEl);

  const networks = useMemo(() => {
    return Object.keys(CHAIN_ID_MAP).map((networkName) => {
      return {
        label: networkName,
        value: String(CHAIN_ID_MAP[networkName]),
        icon: <ChainIcon colorMode size={14} wrapperSize={22} chainId={CHAIN_ID_MAP[networkName]} className='rounded-full' />,
        tooltip: CHAINS_MINT_TOOLTIPS[CHAIN_ID_MAP[networkName]],
        group: CHAIN_ID === CHAIN_ID_MAP[networkName] ? 'Mainnet' : 'EVMs'
      }
    })
  }, [])
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
  const [inviteCode, setInviteCode] = useState('')
  const [mintTo, setMintTo] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    setMintTo(address as string)
  }, [address])
  
  const openSelectNetworkMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelectNetworkMenu = () => {
    setAnchorEl(null);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSearch(name)
  }

  return (
    <DetailsProvider mode="community" keywords="">
      <div className="dapp-page">
        <SearchHeader />
        <div className="main pt-[105px] text-center flex flex-col items-center mb-40 relative z-0 sm:w-[84vw] mx-auto">
          <h1 className="title font-Saira">Your <span><span>Web3</span></span> Brand Name</h1>
          <p className="mt-5 text-md text-gray-2 font-Saira sm:text-sm">Your Exclusive Brand DID Across All Supported Chains in Web3. <br className='sm:hidden' />One Name to Start Building Your Own Community.</p>
          {/* <div className="forms mt-8 w-[800px]">
            <div className="flex justify-between">
              <button className="w-[390px] h-12.5 bg-white border border-gray-7 rounded-md flex justify-between items-center px-6 overflow-hidden" onClick={openSelectNetworkMenu}>
                <div className="flex gap-2 overflow-hidden">
                  <span className="min-w-[120px] text-main-black opacity-50 flex-shrink-0">Select Network</span>
                  <DividerLine mode="horizontal" wrapClassName='flex-shrink-0' />
                  <div className='flex items-center text-ellipsis overflow-hidden flex-shrink-0 flex-1'>
                    {selectedNetwork.icon}
                    <span className='ml-1.5 text-ellipsis whitespace-nowrap overflow-hidden'>{selectedNetwork.label}</span>
                  </div>
                </div>
                <ArrorBottomIcon width="16" height="16" className={`${networkMenuOpen ? 'rotate-180' : ''} transition-all flex-shrink-0`} />
              </button>
              <Menu
                anchorEl={anchorEl}
                open={networkMenuOpen}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                className='top-1 dapp-network-select-menu'
                onClose={handleCloseSelectNetworkMenu}
              >
                {networks.map(v => (
                  <MenuItem onClick={() => {
                    setSelectedNetwork(v)
                    handleCloseSelectNetworkMenu()
                  }} key={v.label}>
                    {v.icon}
                    <span className='ml-1.5'>{v.label}</span>
                  </MenuItem>
                ))}
              </Menu>
              <div className="w-[390px] h-12.5 bg-white border border-gray-7 rounded-md px-6 flex items-center gap-2">
                <span className="flex-shrink-0 min-w-[120px] text-main-black opacity-50">Invited Code:</span>
                <DividerLine mode="horizontal" />
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Input your invited code"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 h-12.5 bg-white border border-gray-7 rounded-md px-6 flex items-center gap-2">
              <span className="flex-shrink-0 min-w-[120px] text-main-black opacity-50">Mint to:</span>
              <DividerLine mode="horizontal" />
              <input
                type="text"
                className="outline-none w-full"
                placeholder="0x..."
                value={mintTo}
                onChange={e => setMintTo(e.target.value)}
              />
            </div>
          </div> */}
          <form
            className="mt-20 border-[6px] border-primary border-w-3 w-[600px] sm:w-[84vw] rounded-full sm:rounded-[44px] flex justify-between items-center bg-white overflow-hidden px-3 py-3 gap-4 sm:flex-col"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className='flex items-center w-full'>
              <RoundedLogo width="58" height="58" className="flex-shrink-0" />
              <input
                type="text"
                placeholder='Search for a name'
                className="text-lg outline-none text-[20px] w-full"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <button className="button-xl bg-primary text-white text-lg w-auto text-[20px] flex-shrink-0 sm:w-full">
              <StarIcon width="20" height="20" />
              <span className='ml-2.5'>Create Brand</span>
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </DetailsProvider>
  )
}