import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';

import { DetailsProvider, useDetails } from '@/contexts/details'
import { useWallet } from '@/hooks/wallet';
import { isAddress, isValidLabel } from '@/shared/helper';
import { useRoot, useRootConfig } from '@/contexts/root';
import { useConfiguration } from '@/contexts/configuration';
import { useSignUtils } from '@/hooks/sign';
import { GlobalDialogProvider, useGlobalDialog } from '@/contexts/globalDialog'
import useApi from '@/shared/useApi';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchHeader from "@/components/solid/SearchHeader";
import { CHAINS_MINT_TOOLTIPS, CHAINS_NETWORK_TO_ID, CHAIN_ID, CHAIN_ID_MAP, CONTRACT_MAP, MAIN_CHAIN_ID, CHAINS_ID_TO_NETWORK } from '@/shared/constant';
import ChainIcon from '@/components/common/chainIcon';
import Footer from '@/components/solid/Footer'
import DividerLine from '@/components/common/dividerLine';

import StarIcon from '~@/icons/star.svg'
import ArrorBottomIcon from '~@/icons/arrow-bottom.svg';
import RoundedLogo from '~@/logo-round.svg'

function Dapp() {
  const { message, NetOps } = useRoot()
  const { isMobile } = useRootConfig()
  const { communityCache } = useDetails()
  const { showGlobalDialog } = useGlobalDialog()
  const router = useRouter()
  const { getBrandDIDChainId } = useApi()
  const { address } = useWallet()
  const { masterAddress } = useConfiguration()
  const { verifyCommunityTypedMessage, verifyCommunityOmninodeTypedMessage } = useSignUtils()
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false)
  const networkMenuOpen = Boolean(anchorEl);

  const networks = useMemo(() => {
    return Object.keys(CHAIN_ID_MAP).map((networkName) => {
      return {
        label: networkName,
        value: CHAIN_ID_MAP[networkName],
        icon: <ChainIcon colorMode size={14} wrapperSize={22} chainId={CHAIN_ID_MAP[networkName]} className='rounded-full' />,
        tooltip: CHAINS_MINT_TOOLTIPS[CHAIN_ID_MAP[networkName]],
        group: CHAIN_ID === CHAIN_ID_MAP[networkName] ? 'Mainnet' : 'EVMs'
      }
    })
  }, [])
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])

  const [invitationCode, setInvitationCode] = useState('')
  const [mintTo, setMintTo] = useState('')
  const [name, setName] = useState('')

  async function fetchInviteCode() {
    if (!name || !mintTo) {
      return
    }
    const res = await axios.get(`/api/sign/mint?name=${name}&chainId=${selectedNetwork.value}&owner=${mintTo}`)
    const { data } = res.data
    return data.signature || ''
  }
  
  const openSelectNetworkMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelectNetworkMenu = () => {
    setAnchorEl(null);
  };

  function validataInviteCode() {
    const isTargetMainnetWork = Number(selectedNetwork.value) === MAIN_CHAIN_ID

    if (!invitationCode || !masterAddress) {
      return false
    }
    
    const { CommunityRegistryInterface } = CONTRACT_MAP[selectedNetwork.value]
    const mintSignatureValidator = verifyCommunityTypedMessage(invitationCode, masterAddress, name, mintTo, CommunityRegistryInterface, { chainId: selectedNetwork.value })
    const omninodeSignatureValidator = verifyCommunityOmninodeTypedMessage(invitationCode, masterAddress, name, mintTo, { chainId: selectedNetwork.value })
    const isMintValidate = mintSignatureValidator.powerful || mintSignatureValidator.designated
    if (isTargetMainnetWork) {
      return isMintValidate
    }
    const isOmninodeMintValid = omninodeSignatureValidator.powerful || omninodeSignatureValidator.designated
    return isMintValidate && isOmninodeMintValid
  }
  
  const handleSubmit = async (e: FormEvent, options: any) => {
    e.preventDefault()
    if (loading) {
      return
    }
    setLoading(true)
    try {
      const { account, chain, openChainModal, openConnectModal, mounted }= options
      const connected = mounted && account && chain
      if (!connected) {
        openConnectModal()
        return
      }
      if (chain?.unsupported) {
        openChainModal()
        return
      }
      if (!name) {
        message({
          type: 'error',
          content: 'Please fill the name'
        })
        return
      }
      if (!isValidLabel(name)) {
        message({
          type: 'error',
          content: 'The name you want to mint is invalid'
        })
        return
      }
      if (!isAddress(mintTo)) {
        message({
          type: 'error',
          content: 'The address you want to mint to is invalid'
        })
        return
      }
      const chainId = await getBrandDIDChainId(name)
      if (chainId) {
        window.open(`/community/${name}`)
        message({
          type: 'error',
          content: chainId === MAIN_CHAIN_ID ? 'This Brand has already been minted' : `This Brand has already been registered on ${CHAINS_ID_TO_NETWORK[chainId]}`
        })
        return
      }
      let finalInviteCode = invitationCode
      if (process.env.NEXT_PUBLIC_IS_TESTNET === 'true') {
        const invitationCode = await fetchInviteCode()
        finalInviteCode = invitationCode
        setInvitationCode(invitationCode)
      } else {
        if (!validataInviteCode()) {
          message({
            type: 'error',
            content: 'Your invited code is invalid'
          })
          return
        }
      }
      if (isMobile) {
        showGlobalDialog('mobile-brand-mint', {
          mobile: true,
          brandName: name,
          brandInfo: {
            // chainId: selectedNetwork.value,
            communityCoinSymbol: selectedNetwork.label
          },
          options: {
            invitationCode: finalInviteCode,
            mintTo,
            mintNetwork: selectedNetwork.value
          }
        })
        return
      }
      showGlobalDialog('brand-mint', {
        brandName: name,
        brandInfo: {
          // chainId: selectedNetwork.value,
          communityCoinSymbol: selectedNetwork.label
        },
        options: {
          invitationCode: finalInviteCode,
          mintTo,
          mintNetwork: selectedNetwork.value
        }
      })
    } catch (e) { } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMintTo(address || '')
  }, [address])

  function renderMintFormPC() {
    return (
      <div className="forms mt-8 w-[800px] sm:hidden">
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
              placeholder={process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? "Not need for testnet" : "Input your invited code"}
              value={invitationCode}
              onChange={e => setInvitationCode(e.target.value)}
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
      </div>
    )
  }

  function renderMintFormMobile() {
    return (
      <div className="forms mt-8 sm:w-[84vw] pc:hidden flex flex-col gap-3 text-left">
        <div>
          <p className='px-4 text-sm text-black-tr-50 leading-[18px] mb-2.5'>Select Network:</p>
          <button className="w-full h-14 bg-white border border-gray-7 rounded-md flex justify-between items-center px-6 overflow-hidden" onClick={openSelectNetworkMenu}>
            <div className="flex gap-2 overflow-hidden">
              <div className='flex items-center text-ellipsis overflow-hidden flex-shrink-0 flex-1'>
                {selectedNetwork.icon}
                <span className='ml-1.5 text-ellipsis whitespace-nowrap overflow-hidden'>{selectedNetwork.label}</span>
              </div>
            </div>
            <ArrorBottomIcon width="16" height="16" className={`${networkMenuOpen ? 'rotate-180' : ''} transition-all flex-shrink-0`} />
          </button>
        </div>
        <div>
          <p className='px-4 text-sm text-black-tr-50 leading-[18px] mb-2.5'>Invited Code</p>
          <input
            type="text"
            className="h-14 bg-white border border-gray-7 rounded-md px-6 w-full outline-none"
            placeholder={process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? "Not need for testnet" : "Input your invited code"}
            value={invitationCode}
            onChange={e => setInvitationCode(e.target.value)}
          />
        </div>
        <div>
          <p className='px-4 text-sm text-black-tr-50 leading-[18px] mb-2.5'>Mint To</p>
          <input
            type="text"
            className="h-14 bg-white border border-gray-7 rounded-md px-6 w-full outline-none"
            placeholder="0x..."
            value={mintTo}
            onChange={e => setMintTo(e.target.value)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="dapp-page">
      <SearchHeader />
      <div className="main flex items-center sm:items-start sm:pt-8">
        <div className="text-center flex flex-col items-center relative z-0 sm:w-[84vw] mx-auto pb-[138px] sm:pb-8">
          <h1 className="title font-Saira">Your <span><span>Web3</span></span> Brand Name</h1>
          <p className="mt-5 text-md text-gray-2 font-Saira sm:text-sm">Your Exclusive Brand DID Across All Supported Chains in Web3. <br className='sm:hidden' />One Name to Start Building Your Own Community.</p>
          {renderMintFormPC()}
          {renderMintFormMobile()}
          <ConnectButton.Custom>
            {props => (
              <form
                className="mt-20 sm:mt-7.5 border-[6px] border-primary border-w-3 w-[600px] sm:w-[84vw] rounded-full sm:rounded-[44px] flex justify-between items-center bg-white px-3 py-3 gap-4 sm:flex-col"
                onSubmit={(e) => handleSubmit(e, props)}
              >
                <div className='flex items-center w-full gap-2.5'>
                  <RoundedLogo width="58" height="58" className="flex-shrink-0" />
                  <input
                    type="text"
                    placeholder='Search for a name'
                    className="text-xl outline-none w-full text-main-black"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <button className={`button-xl bg-primary text-white text-lg w-auto flex-shrink-0 sm:w-full hover:bg-primary-tr-80 ${loading ? 'bg-primary-tr-80' : ''}`}>
                  <StarIcon width="20" height="20" />
                  <span className='ml-2.5'>{loading ?  'Checking...' : 'Create brand'}</span>
                </button>
              </form>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function WrappedDapp() {
  return (
    <DetailsProvider mode="community" keywords="">
      <GlobalDialogProvider>
        <Dapp />
      </GlobalDialogProvider>
    </DetailsProvider>
  )
}