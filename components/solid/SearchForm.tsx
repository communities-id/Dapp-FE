import { FC, useState, FormEvent, useEffect, ReactNode } from 'react'
import classnames from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'

import { useSearch } from '@/hooks/search'
import { execSearch } from '@/shared/helper'

import Button from '@/components/solid/Button'

import { SearchMode } from '@/types'

interface Props {
  className?: string
  inputClassName?: string
  buttonClassName?: string
  handleDone?: () => void
  children?: ReactNode
}

const SearchForm: FC<Props> = ({ className, inputClassName, buttonClassName, handleDone, children }) => {
  const { handleSearch } = useSearch()
  const keywords = useSearchParams().get('keywords') as string

  const [isFocus, setIsFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (!keywords) return
    const { type, community } = execSearch(keywords)
    if (SearchMode[type] === SearchMode.community) {
      setSearchValue(community)
    } else {
      setSearchValue(keywords)
    }
  }, [keywords])

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault()
    handleSearch(searchValue)
    handleDone?.()
  }

  return (
    <form className='border-none' action="" onSubmit={handleSearchSubmit}>
      <div className={
        classnames(
          'flex items-center',
          'h-[46px] py-[6px] px-[6px]',
          'bg-search-form-bg backdrop-blur-[10px] transition-all duration-300 linear',
          'outline outline-search-form rounded-[32px] hover:bg-search-form-focus-bg',
          {
            '!bg-search-form-focus-bg': isFocus
          },
          className
        )
      }>
        <label htmlFor='search-button'>
          <input
            type="text"
            placeholder='Search...'
            className={
              classnames(
                'w-[90px] focus:w-342px] ml-[10px] rounded-[4px] transition-all duration-300 linear',
                'bg-transparent',
                'text-search-form-text placeholder:text-search-form-placeholder',
                'outline-[0px]',
                {
                  '!w-[330px]': !!searchValue
                },
                inputClassName
              )
            }
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </label>
        { children }
        <Button
          id="search-button"
          type="submit"
          theme='primary'
          className={
            classnames(
              '!w-0 !h-0 overflow-hidden',
              buttonClassName
            )
          }>
        </Button>
      </div>
    </form>
  )
}

export default SearchForm