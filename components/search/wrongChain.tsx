import { FC } from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from '@/components/solid/Button'

import WalletConnectIcon from '~@/icons/wallet-connect.svg'

interface Props {
  handleConnect: () => void
}

const WrongChain: FC<Props> = ({ handleConnect }) => {
  return (
    <div>
      <div className='h-[210px] bg-default-search-banner'></div>
      <div className='pt-[16px] pb-[62px] flex flex-col items-center'>
        <WalletConnectIcon width='200' />
        <p className='mt-[12px] text-mainGray text-searchdesc'>Please switch to a correct chain</p>
        <div className='mt-[16px] flex items-center justify-center'>
          <Button theme='primary' type="button" className='px-[16px]' onClick={handleConnect}>
            Switch Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WrongChain