import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber } from 'ethers'
import useApi, { getOmniNodeState } from '@/shared/useApi'
import { useRoot } from '@/contexts/root'
import useIntervalAsync from '@/hooks/polling'
import { MAIN_CHAIN, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'
import { toastError } from '@/shared/helper'

import ConnectButton from '@/components/common/connectButton'

import MintRightIcon from '~@/icons/mint/right-circle.svg'
import DividerLine from '@/components/common/dividerLine'

interface CommunityRegisterProps {
  mintNetwork: number
  brandChainId: number
  brandName: string
  account?: string
  price: number | BigNumber
  gasFee: number | BigNumber
  disabled?: boolean
  loading?: boolean
  omninodeAdvanceMintSetting: { mintTo: string, signature: string }
  omninodeSignatureValidator: { powerful: boolean, designated: boolean }
  handleDeployed: (state: boolean) => void
  children?: ReactNode
  step?: ReactNode
  extra?: ReactNode
  handleRefreshBrandChainId?: () => Promise<void>
}

const CommunityRegister: FC<CommunityRegisterProps> = ({ mintNetwork, brandChainId, brandName, omninodeAdvanceMintSetting, omninodeSignatureValidator, disabled, loading, handleDeployed, children, step, extra, handleRefreshBrandChainId }) => {
  const { message, tracker, NetOps } = useRoot()
  const { createOmniNode } = useApi()

  const [deploying, setDeploying] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(' ')

  const registerLoading = loading || deploying
  console.log('- register loading', loading, 'deploying', deploying)

  const mainChainName = MAIN_CHAIN

  const isTargetMainnetWork = useMemo(() => {
    return mintNetwork === MAIN_CHAIN_ID
  }, [mintNetwork])

  // deploy omninode event
  const handleDeploy = async () => {
    if (registerLoading) return
    try {
      setDeploying(true)
      await NetOps.handleSwitchNetwork(MAIN_CHAIN_ID)
      setLoadingStatus('Sending transaction...')
      await handleCreateOmniNode(mintNetwork)
      setLoadingStatus('Relaying, this step may takes about 1 minute...')
      await handleRefreshBrandChainId?.()
      // await refreshInfo()
    } catch (err) {
      setLoadingStatus(' ')
      toastError(message, 'Failed to release: ', err, { t: 'brand-pre-mint', i: 1 })
      setDeploying(false)
    }
  }

  // create omninode
  const handleCreateOmniNode = async (targetChainId: number) => {
    const { signature, mintTo } = omninodeAdvanceMintSetting
    const { powerful } = omninodeSignatureValidator
    console.log('- handleCreateOmniNode', brandName, targetChainId, signature, mintTo, powerful)
    // signature mint
    if (signature) {
      await createOmniNode(brandName, {
        targetChainId,
        signature: omninodeAdvanceMintSetting.signature,
        owner: powerful ? ZERO_ADDRESS : mintTo
      }, { chainId: MAIN_CHAIN_ID }) // create omninode on mainnet
    } else {
      // public mint or holding mint
      await createOmniNode(brandName, {
        targetChainId,
        signature: omninodeAdvanceMintSetting.signature,
        owner: omninodeAdvanceMintSetting.mintTo
      }, { chainId: MAIN_CHAIN_ID }) // create omninode on mainnet
    }
    tracker('success:brand-pre-mint', { brandName, mintTo, targetChainId })
  }

  const handleGetOmniNodeState = useCallback(async () => {
    console.log('- handleGetOmniNodeState', brandName, mintNetwork)
    return getOmniNodeState(brandName, mintNetwork)
  }, [brandName, mintNetwork])

  // omninode state polling function
  const omniNodeStatePollingFunc = useCallback(async () => {
    console.log('- omniNodeStatePollingFunc chainId', brandChainId, 'isTargetMainnetWork', isTargetMainnetWork)
    if (isTargetMainnetWork || !brandChainId) return true
    // if (!communityInfo?.chainId) return false // to do: check is omninode created
    setDeploying(true)
    const res = await handleGetOmniNodeState()
    console.log('- handleGetOmniNodeState res', res)
    if (res.state) {
      // setOmniLoading(false)
      // publish omninode created event
      handleDeployed?.(res.state)
      setDeploying(false)
      return true
    }
    return false
  }, [handleGetOmniNodeState, isTargetMainnetWork, brandChainId])

  // omninode state polling event
  const omninodePollingUpdate = useIntervalAsync(omniNodeStatePollingFunc, 5000)

  // omninode state polling update
  useEffect(() => {
    omninodePollingUpdate()
  }, [brandName, mintNetwork])

  return (
    <div className="pt-[30px] h-full flex flex-col bg-white rounded-[10px]">
      <div className='px-15 text-center'>
        <h1 className='text-mintTitle text-dark text-center'>
          .{ brandName }
        </h1>
        <div className='inline-flex items-center gap-[4px] mt-[10px] px-[20px] py-[10px] bg-mintWarningBg border-solid border-[1px] border-mintWarning text-mintWarning rounded-[8px]'>
          <MintRightIcon width='20' height='20'/>
          <p className='text-mintTag'>Now you are Pre-Minting</p>
        </div>
      </div>
      <div className='mt-[30px] w-full px-15'>
        <div className=''>
          <h3 className='text-mintTipTitle text-secondaryBlack'>Click “<span className='text-mintPurple'>Pre-Mint</span>” to proceed</h3>
          <p className='mt-[4px] text-mintTipDesc text-mainGray'>
            To mint your community on a network other than {mainChainName}, it is required to register an Omni Node on <span className='text-mintPurple'>{ mainChainName }</span> to ensure multi-chain uniqueness. You will be asked to confirm two transactions. If the second transaction is not processed within 7days of the first, you will need to restart from step 1. 
          </p>
        </div>
        { step }
        { extra }
        <div className='mt-[30px] flex-center gap-4'>
          {/* <p className='text-mintTipDesc text-mainGray'>The estimated cost is : <b className='text-mintPurple'>0.0170 ETH</b></p> */}
          <div className='flex items-center justify-center gap-[10px]'>
            <ConnectButton
              className='px-[16px]'
              size='auto'
              theme='purple'
              loading={registerLoading}
              disabled={disabled}
              onClick={handleDeploy}>Pre-Mint</ConnectButton>
          </div>
        </div>
        <p className='text-center mt-2'>{loadingStatus}</p>
      </div>
      <DividerLine wrapClassName='mt-[30px] mb-4' />
      <div className='flex-1 w-full px-15 pb-10 overflow-auto'>
        { children }
      </div>
    </div>
  )
}

export default CommunityRegister