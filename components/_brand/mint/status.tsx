import { FC, ReactNode, useEffect, useMemo } from 'react'

import { useNetwork } from 'wagmi'
import { useDetails } from '@/contexts/details'
import { CHAINS_NETWORK_TO_ID, CHAIN_ID, CHAIN_ID_MAP, CHAINS_MINT_TOOLTIPS } from "@/shared/constant"

import ConnectButton from '@/components/common/connectButton'
import Select from '@/components/common/select'

import MintRightIcon from '~@/icons/mint/right-circle.svg'
import ChainIcon from '@/components/common/chainIcon'
import DividerLine from '@/components/common/dividerLine'

interface CommunityMintStatusProps {
  mintNetwork: number
  brandName: string
  account?: string
  loading?: boolean
  disabled?: boolean
  handleNext: () => void
  handleNetworkChange?: (network: number) => void
  children?: ReactNode
  step?: ReactNode
  extra?: ReactNode
}

const CommunityMintStatus: FC<CommunityMintStatusProps> = ({ loading, brandName, disabled, handleNext, children, step, extra }) => {

  return (
    <div className="pt-[30px] h-full flex flex-col bg-white rounded-[10px]">
      <div className='px-15 text-center'>
        <h1 className='text-mintTitle text-dark text-center'>
          .{ brandName }
        </h1>
        <div className='inline-flex items-center gap-[4px] mt-[10px] px-[20px] py-[10px] bg-mintSuccessBg border-solid border-[1px] border-mintSuccess text-mintSuccess rounded-[8px]'>
          <MintRightIcon width='20' height='20'/>
          <p className='text-mintTag'>No User DIDs found under this Brand DID.</p>
        </div>
      </div>
      <div className='mt-[30px] w-full px-15'>
        <div className=''>
          <h3 className='text-mintTipTitle text-secondaryBlack'>Select Network for Brand DID Deployment</h3>
          <p className='mt-[4px] text-mintTipDesc text-mainGray'>
            Brand DID can be deployed on the following networks. Once deployed, User DIDs belonging to your community will be minted as NFTs on the selected network. Please ensure that your community members are active on the selected network.
          </p>
        </div>

        { step }
        { extra }
        <div className='mt-[30px] flex-center gap-4'>
          {/* <p className='text-mintTipDesc text-mainGray'>The estimated cost is : <b className='text-mintPurple'>0.0170 ETH</b></p> */}
          <ConnectButton
            loading={loading}
            disabled={disabled}
            size='auto'
            theme='purple'
            className='px-[34px]'
            onClick={() => handleNext()}
          >
            Start
          </ConnectButton>
        </div>
      </div>
      <DividerLine wrapClassName='mt-[30px] mb-4' />
      <div className='flex-1 w-full px-15 pb-10 overflow-auto'>
        { children }
      </div>
    </div>
  )
}

export default CommunityMintStatus