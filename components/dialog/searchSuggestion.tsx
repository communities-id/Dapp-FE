import { FC, FormEvent, useEffect, useState } from 'react'
import Modal from '@/components/common/modal';
import SearchSvg from '~@/icons/search.svg'
import { SearchMode } from '@/types';
import { calcMintPrice, execSearch, parseImgSrc } from '@/shared/helper';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/search';
import ChainIcon from '../common/chainIcon';
import { searchSuggestion } from '@/shared/apis';
import { formatInfo } from '@/utils/format';
import { Community } from '@prisma/client';
import { BrandDID, ZERO_ADDRESS } from '@communitiesid/id';
import { getTokenSymbol } from '@/shared/contract';
import CloseIcon from '~@/icons/close.svg'

interface Props {
  open: boolean
  handleClose: () => void
}

const SearchSuggestion: FC<Props> = ({ open, handleClose }) => {

  const { handleSearch } = useSearch()
  const keywords = useSearchParams().get('keywords') as string
  const [searchValue, setSearchValue] = useState('')
  const [suggestion, setSuggestion] = useState<Record<string, object[]>>({})

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
      const res = await searchSuggestion(searchValue)
      if (res.data) {
        const list = await Promise.all(res.data.map(async (v: Community) => {
          const communityInfo = formatInfo(JSON.parse(v?.communityInfo as string)) as BrandDID
          const coinSymbol = await getTokenSymbol(communityInfo?.config?.coin ?? ZERO_ADDRESS, v.chainId)
          const mintPrice = calcMintPrice(communityInfo)
          return {
            ...v,
            communityInfo,
            mintPrice,
            coinSymbol
          }
        }))
        setSuggestion({
          ...suggestion,
          [searchValue]: list
        })
      }
    }
    if (searchValue && !suggestion[searchValue]) {
      fetchSuggestion()
    }
  }, [searchValue])

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
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
      <div className='dapp-container pl-[205px]'>
        <div className="bg-white w-min rounded-b-lg search-box">
          <div className="search-bar flex items-center px-5 pt-10 pb-3">
            <div className="search-form bg-white border-sm border-gray-3 h-14 rounded-lg flex justify-start items-center px-6 gap-4">
              <SearchSvg className="w-6 h-6"/>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  type="text"
                  className="w-full bg-transparent outline-none placeholder:text-gray-4"
                  placeholder="Search brand, user and address"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
              </form>
              <button onClick={() => setSearchValue('')}>
                <CloseIcon width='16' height='16' />
              </button>
            </div>
            <button className='button-lg bg-transparent text-primary' onClick={handleClose}>Cancel</button>
          </div>
          { suggestion[searchValue] && suggestion[searchValue].length > 0 && <div className="suggestions border-t-sm border-gray-3 py-2.5">
            {
              (suggestion[searchValue] || []).map((v: any)=> {
                const { communityInfo, mintPrice, coinSymbol } = v
                return (
                  <div 
                    className="suggestion-item flex items-center gap-4 px-5 py-2.5 hover:bg-gray-3"
                    key={v.id} role='button'
                    onClick={() => {
                      handleClose()
                      handleSearch(v.name)
                    }}
                  >
                    <img src={parseImgSrc(communityInfo.tokenUri?.image ?? '')} alt={v.name} className="w-12.5 h-12.5 rounded-[10px] border-gray-3 bg-gray-6" />
                    <div className="info">
                      <div className="name flex gap-1.5 items-center">
                        <span className='text-main-black text-md'>{v.name}</span>
                        <ChainIcon colorMode size={12} wrapperSize={16} chainId={Number(v.chainId)} className='rounded-full' />
                      </div>
                      <div className="data text-main-black text-xs">
                        Size: {communityInfo.totalSupply || 0} | Price: {Number(mintPrice) ? `${mintPrice} ${coinSymbol} / Year` : "Free"}
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