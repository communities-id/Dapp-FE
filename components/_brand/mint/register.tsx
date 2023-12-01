import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber } from 'ethers'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import useApi, { getOmniNodeState } from '@/shared/useApi'
import { useDetails } from '@/contexts/details'
import { useRoot } from '@/contexts/root'
import useIntervalAsync from '@/hooks/polling'
import { CHAIN_ID, MAIN_CHAIN, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'
import { formatContractError } from '@/shared/helper'

import ConnectButton from '@/components/common/connectButton'

import MintRightIcon from '~@/icons/mint/right-circle.svg'

interface CommunityRegisterProps {
  mintNetwork: number
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
}

const CommunityRegister: FC<CommunityRegisterProps> = ({ mintNetwork, brandName, omninodeAdvanceMintSetting, omninodeSignatureValidator, disabled, loading, handleDeployed, children, step, extra }) => {
  const { message, tracker } = useRoot()
  const { refreshInfo } = useDetails()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { createOmniNode } = useApi()

  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)

  const registerLoading = loading || deploying || switchNetworkLoading

  const mainChainName = MAIN_CHAIN

  const isTargetMainnetWork = useMemo(() => {
    return mintNetwork === MAIN_CHAIN_ID
  }, [mintNetwork])

  const switchToCurrentNetwork = async () => {
    if (chain?.id !== CHAIN_ID) {
      try {
        setSwitchNetworkLoading(true)
        await switchNetworkAsync?.(CHAIN_ID)
        setSwitchNetworkLoading(false)
      } catch (e) {
        setSwitchNetworkLoading(false)
        throw e
      }
    }
    return CHAIN_ID
  }

  // deploy omninode event
  const handleDeploy = async () => {
    if (registerLoading) return
    try {
      setDeploying(true)
      await switchToCurrentNetwork()
      await handleCreateOmniNode(mintNetwork)
      await refreshInfo()
    } catch (err) {
      message({
        type: 'error',
        content: 'Failed to release: ' + formatContractError(err),
      }, { t: 'brand-pre-mint', i: 1 })
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
    console.log('- omniNodeStatePollingFunc chainId', mintNetwork, 'isTargetMainnetWork', isTargetMainnetWork)
    if (isTargetMainnetWork) return true
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
  }, [handleGetOmniNodeState, isTargetMainnetWork, mintNetwork])

  // omninode state polling event
  const omninodePollingUpdate = useIntervalAsync(omniNodeStatePollingFunc, 5000)

  // omninode state polling update
  useEffect(() => {
    omninodePollingUpdate()
  }, [brandName, mintNetwork])

  return (
    <div className="mt-3 flex flex-col bg-white rounded-[10px]">
      <div className='px-4 pb-[6px] text-center'>
        <h1 className='text-mintTitle text-dark text-center'>
          .{ brandName }
        </h1>
        <div className='inline-flex items-center gap-[4px] mt-[10px] px-[20px] py-[10px] bg-mintWarningBg border-solid border-[1px] border-mintWarning text-mintWarning rounded-[8px]'>
          <MintRightIcon width='20' height='20'/>
          <p className='text-mintTag'>Now you are Pre-Minting</p>
        </div>
      </div>
      <div className='w-full px-4 pb-5 max-h-[60vh] overflow-auto'>
        <div className='mt-[30px]'>
          <h3 className='text-mintTipTitle text-secondaryBlack'>Click “<span className='text-mintPurple'>Pre-Mint</span>” to proceed</h3>
          <p className='mt-[4px] text-mintTipDesc text-mainGray'>
            To mint your community on a network other than {mainChainName}, it is required to register an Omni Node on <span className='text-mintPurple'>{ mainChainName }</span> to ensure multi-chain uniqueness. You will be asked to confirm two transactions. If the second transaction is not processed within 7days of the first, you will need to restart from step 1. 
          </p>
        </div>
        { step }
        { extra }
        <div className='mt-[30px] flex flex-col items-center gap-[10px]'>
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
        { children }
      </div>
    </div>
  )
}

export default CommunityRegister