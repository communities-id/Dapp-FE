import { useSearchParams } from 'next/navigation'

import MemberMintContent from '@/components/_member/mint';

import { DetailsProvider, useDetails } from '@/contexts/details';
import { GlobalDialogProvider } from '@/contexts/globalDialog';
import SearchHeader from '@/components/solid/SearchHeader';
import Loading from '@/components/loading/info';

function MintMember() {
  const keywords = useSearchParams().get('keywords') as string
  const { communityInfo } = useDetails()

  const classes = {
    container: '!pt-0',
    content: 'items-center',
    formsContainer: '!pt-13 !pb-25 pc:w-[800px] sm:w-5/6',
    title: 'title',
    forms: '!mt-10 !px-0',
    nameForm: '!mt-20 sm:px-0',
    infoContainer: 'bg-white w-full flex flex-col items-center pb-40 !px-0',
    infoCard: 'pc:w-[800px] sm:w-5/6',
    submit: '!bg-white fixed bottom-0 left-0 right-0 sm:px-[8vw]'
  }


  return (
    <div className='dapp-page'>
      <SearchHeader />
      {communityInfo.chainId ? <MemberMintContent brandName={keywords} brandInfo={communityInfo} classes={classes} /> : <div className='dapp-container h-[100vw]' />}
    </div>
  )
}

export default function WrappedMintMember() {
  const keywords = useSearchParams().get('keywords') as string
  return (
    <DetailsProvider mode="community" keywords={keywords}>
      <GlobalDialogProvider>
        <MintMember />
      </GlobalDialogProvider>
    </DetailsProvider>
  )
}