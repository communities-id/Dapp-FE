import { FC, ReactNode, useState } from 'react'

import { BigNumber } from 'ethers'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { useRoot } from '@/contexts/root'
import useApi from '@/shared/useApi'
import { toastError } from '@/shared/helper'
import { MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'

import ConnectButton from '@/components/common/connectButton'

import PendingIcon from '~@/icons/mint/pending.svg'

interface CommunityMintLatestProps {
  mintNetwork: number
  brandName: string
  account?: string
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

const CommunityMintLatest: FC<CommunityMintLatestProps> = ({ mintNetwork, brandName, account, price, gasFee, children, step, extra, advanceMintSetting, signatureValiditor, disabled, handleReleased }) => {
  const { handleMintSuccess } = useGlobalDialog()
  const { message, tracker, NetOps } = useRoot()
  const { mintCommunity, releaseOmniNode } = useApi()
  
  // const [isSwitchNetwork, setIsSwitchNetwork] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  // const [releaseState, setReleaseState] = useState(false)

  const pending = mintLoading || NetOps.loading

  const handleMint = async () => {
    if (pending || !account) return
    try {
      const chainId = mintNetwork
      await NetOps.handleSwitchNetwork(chainId)
      setMintLoading(true)
      console.log("-- come in mint --", chainId)
      const { signature, mintTo = account } = advanceMintSetting
      const { powerful } = signatureValiditor
      
      const _mintTo = mintTo || account
      // signature mint
      if (signature) {
        await mintCommunity(brandName, {
          price,
          signature,
          mintTo: powerful ? _mintTo : ZERO_ADDRESS,
          owner: powerful ? ZERO_ADDRESS : _mintTo
        }, { chainId })
      } else {
        // public mint or holding mint
        await mintCommunity(brandName, {
          price,
          signature,
          mintTo: _mintTo,
          owner: ZERO_ADDRESS
        }, { chainId })
      }
      tracker('success:brand-mint', { brandName, mintTo: _mintTo, price: price.toString() })
      // to do: update brand
      handleMintSuccess?.({ mobile: true, drawer: true, community: brandName, owner: _mintTo, avatar: '' }, 'community')
    } catch (err: any) {
      console.log(err)
      toastError(message, 'Failed to mint: ', err, { t: 'brand-mint', k: brandName, i: 1 })
    } finally {
      setMintLoading(false)
    }
  }

  const handleRelease = async () => {
    console.log('- handleRelease -')
    if (pending) return
    try {
      const chainId = mintNetwork
      await NetOps.handleSwitchNetwork(chainId)
      setMintLoading(true)
      console.log("-- come in release --")
      await releaseOmniNode(brandName, {
        chainId
      })
      message({
        type: 'success',
        content: 'Release success. This community will be able to mint on other network again after about 1 minute',
      }, { t: 'brand-release', k: brandName })
      handleReleased?.()
    } catch (err: any) {
      console.log(err)
      toastError(message, 'Failed to release: ', err, { t: 'brand-release', k: brandName, i: 1 })
    } finally {
      setMintLoading(false)
    }
  }

  return (
    <div className="mt-3 flex flex-col bg-white rounded-[10px]">
      {/* <h1 className='text-mintTitle text-dark'>Almost there!</h1> */}
      <div className='px-4 pb-[6px]'>
        <div className='flex items-center justify-center'>
          <PendingIcon width='66' height='66' />
        </div>
        <h2 className='mt-[6px] text-mintSecondaryTitle text-main-black text-center'>
          Click &quot;Mint&quot; to secure &quot;<span className='text-mintPurple'>.{ brandName }</span>&quot; 
        </h2>
      </div>
      <div className='w-full px-4 pb-5 h-[60vh] overflow-auto'>
        <p className='mt-[6px] text-mintTipDesc font-normal'>Please carefully review the following information. as it cannot be changed or refunded once the minting process is complete.</p>
        { step }
        { extra }
        <div className='mt-[30px] flex flex-col items-center gap-[10px]'>
          <div className='flex items-center justify-center gap-[10px]'>
            {
              mintNetwork !== MAIN_CHAIN_ID && (
                <ConnectButton
                  loading={pending}
                  size='auto'
                  theme='pink'
                  className='px-[28px]'
                  onClick={handleRelease}>
                  Release
                </ConnectButton>
              )
            }
            <ConnectButton
              loading={pending}
              size='auto'
              theme='purple'
              className='px-[28px]'
              disabled={disabled}
              onClick={handleMint}>
              Mint
            </ConnectButton>
          </div>
        </div>
        { children }
      </div>
    </div>
  )
}

export default CommunityMintLatest