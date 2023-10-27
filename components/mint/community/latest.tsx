import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { BigNumber } from 'ethers'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { useRoot } from '@/contexts/root'
import { useWallet } from '@/hooks/wallet'
import useApi from '@/shared/useApi'
import { updateCommunity } from '@/shared/apis'
import { formatContractError } from '@/shared/helper'
import { CHAIN_ID_MAP, CHAINS_ID_TO_NETWORK, CHAINS_NETWORK_TO_ID, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'

import MintButton from '@/components/mint/button'

import PendingIcon from '~@/icons/mint/pending.svg'

interface CommunityMintLatestProps {
  mintNetwork: number
  price: number | BigNumber
  gasFee: number | BigNumber
  children?: ReactNode
  step?: ReactNode
  extra?: ReactNode
  advanceMintSetting: { mintTo: string, signature: string }
  signatureValiditor: { powerful: boolean, designated: boolean }
  disabled?: boolean
  handleReleased?: () => void
}

const CommunityMintLatest: FC<CommunityMintLatestProps> = ({ mintNetwork, price, gasFee, children, step, extra, advanceMintSetting, signatureValiditor, disabled, handleReleased }) => {
  const { communityInfoSet } = useDetails()
  const { refreshInfo, keywords, community } = useDetails()
  const { handleMintSuccess } = useGlobalDialog()
  const router = useRouter()
  const { message } = useRoot()
  const { mintCommunity, releaseOmniNode } = useApi()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { address: account } = useWallet()
  
  // const [isSwitchNetwork, setIsSwitchNetwork] = useState(false)
  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  const [releaseState, setReleaseState] = useState(false)

  const confirmExitWhenLoading = (e: any) => {
    if (mintLoading) {
      e.preventDefault()
      return e.returnValue = ''
    }
  }

  useEffect(() => {
    router.beforePopState(() => {
      if (mintLoading) {
        return window.confirm('Changes you made may not be saved.')
      }
 
      return true
    })
  }, [router, mintLoading])

  useEffect(() => {
    window.addEventListener("beforeunload", confirmExitWhenLoading)
    return () => {
      window.removeEventListener("beforeunload", confirmExitWhenLoading)
    };
  }, [mintLoading]);

  const switchToCurrentNetwork = async () => {
    if (Number(chain?.id) !== Number(mintNetwork)) {
      try {
        setSwitchNetworkLoading(true)
        // setIsSwitchNetwork(true)
        await switchNetworkAsync?.(mintNetwork)
        setSwitchNetworkLoading(false)
      } catch (e) {
        setSwitchNetworkLoading(false)
        throw e
      }
    }
    return mintNetwork
  }

  const handleMint = async () => {
    if (mintLoading || !account) return
    try {
      const chainId = await switchToCurrentNetwork()
      setMintLoading(true)
      console.log("-- come in mint --", chainId)
      const { signature, mintTo = account } = advanceMintSetting
      const { powerful } = signatureValiditor
      
      const _mintTo = mintTo || account
      // signature mint
      if (signature) {
        await mintCommunity(community, {
          price,
          signature,
          mintTo: powerful ? _mintTo : ZERO_ADDRESS,
          owner: powerful ? ZERO_ADDRESS : _mintTo
        }, { chainId })
      } else {
        // public mint or holding mint
        await mintCommunity(community, {
          price,
          signature,
          mintTo: _mintTo,
          owner: ZERO_ADDRESS
        }, { chainId })
      }
      await refreshInfo()
      handleMintSuccess?.({ community, owner: _mintTo, avatar: '' }, 'community')
    } catch (err: any) {
      console.log(err)
      message({
        type: 'error',
        content: 'Failed to mint: ' + formatContractError(err),
      })
    } finally {
      setMintLoading(false)
    }
  }

  const handleRelease = async () => {
    console.log('- handleRelease -')
    if (mintLoading) return
    try {
      const chainId = await switchToCurrentNetwork()
      setMintLoading(true)
      console.log("-- come in release --")
      await releaseOmniNode(community, {
        chainId
      })
      message({
        type: 'success',
        content: 'Release success. This community will be able to mint on other network again after about 1 minute',
      })
      handleReleased?.()
    } catch (err: any) {
      console.log(err)
      message({
        type: 'error',
        content: 'Failed to release: ' + formatContractError(err),
      })
    } finally {
      setMintLoading(false)
    }
  }

  return (
    <div className="px-[60px] pt-[30px] pb-[40px] flex flex-col items-center bg-white rounded-[10px]">
      {/* <h1 className='text-mintTitle text-dark'>Almost there!</h1> */}
      <div className='flex items-center justify-center'>
        <PendingIcon width='66' height='66' />
      </div>
      <h2 className='mt-[6px] text-mintSecondaryTitle text-secondaryBlack'>
        Click &quot;Mint&quot; to secure &quot;<span className='text-mintPurple'>.{ community }</span>&quot; 
      </h2>
      <p className='mt-[6px] text-mintTipDesc font-normal'>Please carefully review the following information. as it cannot be changed or refunded once the minting process is complete.</p>
      { step }
      { extra }
      <div className='mt-[30px] flex flex-col items-center gap-[10px]'>
        <div className='flex items-center justify-center gap-[10px]'>
          {
            mintNetwork !== MAIN_CHAIN_ID && (
              <MintButton
                loading={mintLoading || switchNetworkLoading}
                size='auto'
                theme='pink'
                className='px-[28px]'
                onClick={handleRelease}>
                Release
              </MintButton>
            )
          }
          <MintButton
            loading={mintLoading || switchNetworkLoading}
            size='auto'
            theme='purple'
            className='px-[28px]'
            disabled={disabled}
            onClick={handleMint}>
            Mint
          </MintButton>
        </div>
      </div>
      { children }
    </div>
  )
}

export default CommunityMintLatest