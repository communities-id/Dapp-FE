import { FC, Fragment } from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from '@/components/solid/Button'
import Banner from '@/components/search/banner'

import WalletConnectIcon from '~@/icons/wallet-connect.svg'

interface Props {
  handleConnect: () => void
}

const Connect: FC<Props> = ({ handleConnect }) => {
  return (
    <Fragment>
      <Banner/>
      <div className='pt-[16px] pb-[62px] flex flex-col items-center'>
        <WalletConnectIcon width='200' />
        <p className='mt-[12px] text-mainGray text-searchdesc'>Please contact your wallet to search</p>
        <div className='mt-[16px] flex items-center justify-center'>
          <Button theme='primary' type="button" className='px-[16px]' onClick={handleConnect}>
            Connect Now
          </Button>
        </div>
      </div>
    </Fragment>
  )
}

export default Connect