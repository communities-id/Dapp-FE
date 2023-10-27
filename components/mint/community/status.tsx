import { FC, ReactNode, useMemo } from 'react'

import { useDetails } from '@/contexts/details'
import { CHAINS_NETWORK_TO_ID, CHAIN_ID, CHAIN_ID_MAP, CHAINS_MINT_TOOLTIPS } from "@/shared/constant"

import MintButton from '@/components/mint/button'
import Select from '@/components/common/select'

import MintRightIcon from '~@/icons/mint/right-circle.svg'
import ChainIcon from '@/components/common/chainIcon'

interface CommunityMintStatusProps {
  mintNetwork: number
  loading?: boolean
  disabled?: boolean
  handleNext: () => void
  handleNetworkChange?: (network: number) => void
  children?: ReactNode
  step?: ReactNode
  extra?: ReactNode
}

const CommunityMintStatus: FC<CommunityMintStatusProps> = ({ mintNetwork, loading, disabled, handleNext, handleNetworkChange, children, step, extra }) => {

  const { keywords, community, communityInfo, communityInfoSet } = useDetails()

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
  }, [mintNetwork, CHAINS_NETWORK_TO_ID])

  return (
    <div className="px-[60px] pt-[30px] pb-[40px] flex flex-col items-center bg-white rounded-[10px]">
      <h1 className='text-mintTitle text-dark'>
        .{ community }
      </h1>
      <div className='inline-flex items-center gap-[4px] mt-[10px] px-[20px] py-[10px] bg-mintSuccessBg border-solid border-[1px] border-mintSuccess text-mintSuccess rounded-[8px]'>
        <MintRightIcon width='20' height='20'/>
        <p className='text-mintTag'>No User DIDs found under this Brand DID.</p>
      </div>
      <div className='mt-[30px]'>
        <h3 className='text-mintTipTitle text-secondaryBlack'>Select Network for Brand DID Deployment</h3>
        <p className='mt-[4px] text-mintTipDesc text-mainGray'>
          Brand DID can be deployed on the following networks. Once deployed, User DIDs belonging to your community will be minted as NFTs on the selected network. Please ensure that your community members are active on the selected network.
        </p>
      </div>

      { step }
      { extra }
      <div className='mt-[30px] flex items-center gap-4'>
        {/* <p className='text-mintTipDesc text-mainGray'>The estimated cost is : <b className='text-mintPurple'>0.0170 ETH</b></p> */}
        <Select
          value={String(mintNetwork)}
          menus={networks}
          onChange={(value) => {
            handleNetworkChange?.(Number(value))
          }}
        />
        <MintButton
          loading={loading}
          disabled={disabled}
          size='auto'
          theme='purple'
          className='px-[34px]'
          onClick={() => handleNext()}
        >
          Start
        </MintButton>
      </div>
      { children }
    </div>
  )
}

export default CommunityMintStatus