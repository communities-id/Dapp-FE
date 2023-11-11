// import { Container, Box } from '@mui/base'
import { Fragment } from 'react'

import SearchHeader from '@/components/solid/SearchHeader'
import NotFound from '@/components/search/404'

export default function Search() {

  return (
    <main className='min-h-screen bg-[#FAFAFA]'>
      <SearchHeader/>
      <NotFound/>
    </main>
  )
}