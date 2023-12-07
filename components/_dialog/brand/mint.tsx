import { FC } from 'react'

import { useWallet } from '@/hooks/wallet'

import Modal from '@/components/_common/modal';
import BrandMintContent from '@/components/_brand/mint'

import { CommunityInfo } from '@/types';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  options?: {
    mintNetwork?: number
    mintTo?: string
    invitationCode?: string
  }
  open: boolean
  handleClose?: () => void
}

const MemberMint: FC<Props> = ({ brandName, brandInfo, options, open, handleClose }) => {
  const { address: account } = useWallet()

  return (
    <Modal
      open={open}
      wrapClassName="h-screen justify-end"
      containerClassName="h-full"
      enableBackdropClick
      onBackdropClick={handleClose}
      slideProps={{
        direction: 'X',
        offset: 800
      }}>
        <div className='mds:w-[904px] md:w-[1098px] h-full bg-white'>
          <BrandMintContent
            options={options}
            account={account}
            brandName={brandName}
            brandInfo={brandInfo}
          />
        </div>
    </Modal>
  )
}

export default MemberMint