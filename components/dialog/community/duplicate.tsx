import { FC, FormEvent, useMemo, useState } from 'react'
import Modal from '@/components/common/modal';
import StarIcon from '@/public/icons/star.svg'
import RoundedLogo from '@/public/logo-round.svg'
import CloseIcon from '~@/icons/close.svg'
import { useRouter } from 'next/router';
import PriceModeChart from '@/components/common/priceModeChart';
import { PriceMode } from '@/types/contract';
import { parseToDurationPrice } from '@/utils/formula';
import { CommunityInfo } from '@/types';
import { DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID } from '@/shared/constant';
import { isValidLabel } from '@/shared/helper';
import { useRoot } from '@/contexts/root';
import { useDetails } from '@/contexts/details';

interface Props {
  open: boolean
  communityInfo: CommunityInfo
  commisionRate: number
  refundModel: string
  formula: string
  handleClose: () => void
}

const CommunityDuplicate: FC<Props> = ({ open, communityInfo, commisionRate, refundModel, formula, handleClose }) => {

  const { message } = useRoot()
  const { communityCache } = useDetails()
  
  const router = useRouter()
  const [name, setName] = useState('')

  const priceChartParams = useMemo(() => {
    if (!communityInfo.priceModel || !communityInfo?.config) return {
      mode: PriceMode.CONSTANT,
      commissionRate: 0,
      a: '0',
      b: '0',
      c: '0',
      d: '0',
    }
    const input = {
      a_: communityInfo.priceModel.a ?? '0',
      b_: communityInfo.priceModel.b ?? '0',
      c_: communityInfo.priceModel.c ?? '0',
      d_: communityInfo.priceModel.d ?? '0',
    }
    const formulaParams = parseToDurationPrice(communityInfo.priceModel.mode, input, communityInfo.config?.durationUnit ?? 1)
    return {
      mode: communityInfo.priceModel.mode as PriceMode,
      commissionRate: communityInfo.priceModel.commissionRate.toNumber(), 
      ...formulaParams
    }
  }, [communityInfo.priceModel, communityInfo?.config])

  const coinSymbol = communityInfo.coinSymbol ?? DEFAULT_TOKEN_SYMBOL[communityInfo.chainId || MAIN_CHAIN_ID]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidLabel(name)) {
      message({
        type: 'error',
        content: 'Invalid name'
      })
      return
    }
    if (communityCache.find(v => v.name === name)) {
      message({
        type: 'error',
        content: 'This Brand has already minted'
      })
      return
    }

    router.push(`/community/${name}?duplicateFrom=${communityInfo.node?.node}`)
  }

  function handleClickOutside(e: Event) {
    const searchBox = document.querySelector('.duplicate-content')
    if (!searchBox?.contains(e.target as Node)) {
      handleClose()
    }
  }

  return (
    <Modal open={open} wrapClassName="duplicate-container" onClick={handleClickOutside} slideProps={{
      direction: 'X',
      offset: 800
    }}>
      <div className="fixed w-[800px] max-w-[100vw] top-0 right-0 h-[100vh] bg-white duplicate-content overflow-y-auto">
        <div className="dapp-page pb-[77px] sm:pb-[54px]">
          <div className="main pt-[70px] text-center flex flex-col items-center">
            <h1 className="title font-Saira">Create Your <span><span>Own</span></span> Community</h1>
            <form
              className="mt-20 border-[6px] border-primary border-w-3 w-[600px] sm:w-[92vw] rounded-full sm:rounded-[44px] flex justify-between items-center bg-white overflow-hidden px-3 py-3 gap-4 sm:flex-col sm:mt-7.5"
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
        </div>
        <div className="bg-white border-t border-gray-7 py-10 px-15 sm:px-3 sm:py-7.5">
          <p className="text-lg text-main-black opacity-80">Copied Setting (Changeable after minting):</p>
          <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-1 mt-5 text-main-black text-md">
            <div className="border border-gray-7 rounded-xs px-5 py-4 sm:px-7.5 sm:py-3 flex items-center justify-between">
              <span className="opacity-50">Refund Rate:</span>
              <span>{commisionRate}</span>
            </div>
            <div className="border border-gray-7 rounded-xs px-5 py-4 sm:px-7.5 sm:py-3 flex items-center justify-between">
              <span className="opacity-50">Burn Any Time:</span>
              <span>{communityInfo.config?.burnAnytime ? 'Yes' : 'No'}</span>
            </div>
            <div className="border border-gray-7 rounded-xs px-5 py-4 sm:px-7.5 sm:py-3 flex items-center justify-between">
              <span className="opacity-50">Economic Model:</span>
              <span>{refundModel}</span>
            </div>
            <div className="border border-gray-7 rounded-xs px-5 py-4 sm:px-7.5 sm:py-3 flex items-center justify-between">
              <span className="opacity-50">Formular:</span>
              <span>{formula}</span>
            </div>
          </div>
          <div className='mt-1.5 bg-gray-6 border border-gray-7 rounded-xs'>
            <PriceModeChart
              name='member-mint-price-chart'
              height={200}
              params={priceChartParams}
              markerSymbol={coinSymbol}
              currentLabel={(communityInfo.totalSupply ?? 0) + 1}
            />
          </div>
        </div>
        <button className="absolute top-[33px] left-5 cursor-pointer bg-white border border-gray-7 rounded-[6px] px-2 py-2" onClick={handleClose}>
          <CloseIcon width='16' height='16' />
        </button>
      </div>
    </Modal>
  )
}

export default CommunityDuplicate