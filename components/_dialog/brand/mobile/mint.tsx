import { FC, Fragment } from 'react'

import { useWallet } from '@/hooks/wallet'

import Modal from '@/components/_common/modal'
import MobileBrandMintContent from '@/components/_brand/mint/mobile'
import Banner from '@/components/search/banner'

import CloseIcon from '~@/_brand/close.svg'
import InlineLightLogo from '~@/logo/inline-light.svg'

import { CommunityInfo } from '@/types'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  options: {
    mintNetwork?: number
    mintTo?: string
    invitationCode?: string
  }
  open: boolean
  handleClose?: () => void
}

const MobileBrandMint: FC<Props> = ({ brandName, brandInfo, options, open, handleClose }) => {
  const { address: account } = useWallet()

  return (
    <Modal
      open={open}
      wrapClassName='w-full !items-end'
      containerClassName='w-full'
      slideProps={{
        direction: 'Y',
        offset: 400
      }}
      enableBackdropClick
      onBackdropClick={handleClose}
      handleClose={handleClose}
    >
      <div className='relative w-full pb-[30px] bg-white rounded-t-[10px]'>
      <div className='h-15 overflow-hidden rounded-t-[10px]'>
          <Banner
            className='relative top-[50%] -translate-y-[50%] flex-itmc px-4'
            // banner={brandInfo?.tokenUri?.brand_image}
            // brandColor={brandInfo?.tokenUri?.brand_color}
          >
            <InlineLightLogo width='115' height='20' />
          </Banner>
        </div>
        <div className='absolute top-[14px] right-[10px] z-icon' onClick={handleClose}>
          <CloseIcon width='20' height='20' className='text-gray-1' />
        </div>
        <MobileBrandMintContent
          options={options}
          account={account}
          brandName={brandName}
          brandInfo={brandInfo}
        />
      </div>
    </Modal>
  )
}

export default MobileBrandMint