import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import Modal from '@/components/common/modal';
import SearchSvg from '~@/icons/search.svg'
import { SearchMode } from '@/types';
import { calcMintPrice, execSearch, parseImgSrc } from '@/shared/helper';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/search';
import ChainIcon from '../common/chainIcon';
import { BrandDID, ZERO_ADDRESS } from '@communitiesid/id';
import { getTokenSymbol } from '@/shared/contract';
import CloseIcon from '~@/icons/close.svg'
import { useDetails } from '@/contexts/details';
import { formatInfo } from '@/utils/format';

interface Props {
  open: boolean
  handleClose: () => void
}

const SearchSuggestion: FC<Props> = ({ open, handleClose }) => {

  const { handleSearch } = useSearch()
  const { communityCache } = useDetails()
  const keywords = useSearchParams().get('keywords') as string
  const [searchValue, setSearchValue] = useState('')
  const [suggestion, setSuggestion] = useState<Record<string, object[]>>({})

  function getSearchSuggestions(val: string) {
    return communityCache.filter(v => v.name?.toLowerCase().includes(val.toLowerCase())).sort((a, b) => b.totalSupply - a.totalSupply).slice(0, 5)
  }

  useEffect(() => {
    if (!keywords) return
    const { type, community } = execSearch(keywords)
    if (SearchMode[type] === SearchMode.community) {
      setSearchValue(community)
    } else {
      setSearchValue(keywords)
    }
  }, [keywords])

  useEffect(() => {
    async function fetchSuggestion() {
      const res = getSearchSuggestions(searchValue)
      if (res.length === 0) return
      const list = await Promise.all(res.map(async (v) => {
        const { priceModel, totalSupply, durationUnit, coin, chainId } = v
        const mintPrice = calcMintPrice(formatInfo({
          priceModel, totalSupply, config: { durationUnit }
        }) as BrandDID)
        const coinSymbol = await getTokenSymbol(coin || ZERO_ADDRESS, chainId)
        return {
          ...v,
          mintPrice,
          coinSymbol,
        }
      }))
      setSuggestion({
        ...suggestion,
        [searchValue]: list
      })
    }
    if (searchValue && !suggestion[searchValue]) {
      fetchSuggestion()
    }
  }, [searchValue])
  
  useEffect(() => {
    setTimeout(() => {
      const input = document.querySelector('#search-header-input')
      if (open && input) {
        (input as HTMLInputElement).focus()
      }
    }, 200)
    
  }, [open])

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    handleClose()
    handleSearch(searchValue)
  }

  function handleClickOutside(e: Event) {
    const searchBox = document.querySelector('.search-box')
    if (!searchBox?.contains(e.target as Node)) {
      handleClose()
    }
  }

  return (
    <Modal open={open} wrapClassName="search-suggestion-container" onClick={handleClickOutside}>
      <div className='dapp-container pl-[205px] pr-[105px] sm:pl-0 sm:pr-0'>
        <div className="bg-white rounded-b-lg sm:rounded-b-none search-box w-full">
          <div className="search-bar flex items-center px-5 pt-10 pb-3 sm:pt-safe-offset-3">
            <div className="w-full bg-white border-sm border-gray-3 h-14 rounded-lg flex justify-start items-center px-6 gap-4">
              <SearchSvg className="w-6 h-6"/>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none placeholder:text-gray-4"
                  placeholder="Search for brand name, user name or wallet adderss"
                  value={searchValue}
                  id="search-header-input"
                  onChange={e => setSearchValue(e.target.value)}
                />
              </form>
              <button onClick={() => setSearchValue('')}>
                <CloseIcon width='16' height='16' />
              </button>
            </div>
            <button className='button-lg bg-transparent text-primary font-bold' onClick={handleClose}>Cancel</button>
          </div>
          { suggestion[searchValue] && suggestion[searchValue].length > 0 && <div className="suggestions border-t-sm border-gray-3 pt-2.5 py-4">
            {
              (suggestion[searchValue] || []).map((v: any)=> {
                const { name, image, chainId, totalSupply, mintPrice, coinSymbol } = v
                return (
                  <div 
                    className="suggestion-item flex items-center gap-4 px-5 py-2.5 hover:bg-gray-3"
                    key={name} role='button'
                    onClick={() => {
                      handleClose()
                      handleSearch(name)
                    }}
                  >
                    <img src={parseImgSrc(image)} alt={name} className="w-12.5 h-12.5 rounded-[10px] border-gray-3 bg-gray-6" />
                    <div className="info">
                      <div className="name flex gap-1.5 items-center">
                        <span className='text-main-black text-md'>{name}</span>
                        <ChainIcon colorMode size={12} wrapperSize={16} chainId={Number(chainId)} className='rounded-full' />
                      </div>
                      <div className="data text-main-black text-xs">
                        Size: {totalSupply || 0} | Price: {Number(mintPrice) ? `${mintPrice} ${coinSymbol} / Year` : "Free"}
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        }
        </div>
      </div>
    </Modal>
  )
}

export default SearchSuggestion