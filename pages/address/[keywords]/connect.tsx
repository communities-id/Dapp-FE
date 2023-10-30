// import { Container, Box } from '@mui/base'
import { useSearchParams } from 'next/navigation'
import { WrapperProvider } from '@/contexts/wrapper'

import TelegramIntegrate from '@/components/integrate/telegram'

import { SearchMode } from '@/types'

export default function AddressConnect() {
  const keywords = useSearchParams().get('keywords') as string

  return (
    <WrapperProvider mode={SearchMode.address} keywords={keywords}>
      <div className='pb-[120px] relative z-1'>
        <div className='search-container mt-[10px]'>
          <TelegramIntegrate />
        </div>
      </div>
    </WrapperProvider>
  )
}