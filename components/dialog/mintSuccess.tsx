import { FC, useEffect, useState, useRef, MutableRefObject, useMemo } from 'react'
import Link from 'next/link'

import { useGlobalDialog } from '@/contexts/globalDialog'
import { getMintedTwitterShareLink } from '@/utils/share'

import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import MintCelebrateLottie from '~@/lotties/celebrate.json'
import ApproveIcon from '~@/icons/approve.svg'

import Dialog from '@/components/common/dialog'
import MintButton from '@/components/mint/button'

import TwitterIcon from '~@/icons/social/twitter.svg'

import { SearchModeType } from '@/types'

interface Props {
  open: boolean
  mode: SearchModeType
  community: string
  member?: string
  owner: string
  avatar?: string
  handleClose?: () => void
  handleConfirm?: (mode: SearchModeType, community: string, member?: string) => void
}

const MintSuccessDialog: FC<Props> = ({ open, mode, community, member, owner, avatar, handleClose, handleConfirm }) => {
  const { showGlobalDialog } = useGlobalDialog()

  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const twitterShareLink = getMintedTwitterShareLink({ mode, community, member, owner, avatar })

  const keyword = member ? `${member}.${community}` : `.${community}`

  const handleSelfConfirm = () => {
    handleConfirm?.(mode, community, member)
    // if (mode === 'community') {
    //   showGlobalDialog('mint')
    // }
  }
  
  useEffect(() => {
    if (!open) {
      lottieRef.current?.destroy()
    }
  }, [open])
  
  return (
    <Dialog
      backdropClassName='!bg-mint-success-backdrop'
      wrapClassName='!items-start'
      className='overflow-hidden !min-h-screen w-full h-screen !py-0'
      contentClassName='!overflow-hidden h-full !my-0 !py-0'
      open={open}
      title='Congratulations!'
      center={false}
      transparent
      hiddenTitle
      hiddenCloseIcon
      hiddenActions
      disabledAnimate
      handleClose={handleClose}>
      <div className='relative flex flex-col h-full overflow-hidden'>
        <Lottie className='h-full' lottieRef={lottieRef} animationData={MintCelebrateLottie} loop autoplay/>
        <div className='absolute top-0 left-0 px-[60px] w-full h-full mt-[20vh] text-center z-1'>
          <h2 className='text-mintSuccessTitle'>Congratulations!</h2>
          <div className='mt-[30px] flex items-center justify-center'>
            <ApproveIcon width='70' height='70' />
          </div>
          <h3 className='mt-[6px] text-mintSecondaryTitle text-secondaryBlack'>
            You have now successfully mint <span className='text-mintPurple'>{ keyword }</span>
          </h3>
          <p>Owner: { owner }</p>
          <p className='mt-2 text-[14px]'>The name was successfully registered. you can now view and manage the name.</p>
          <div className='mt-[10px] pt-[20px] flex items-center justify-center gap-[30px]'>
            <MintButton size='fixed' theme='purple' onClick={handleSelfConfirm}>Confirm</MintButton>
            <div className='flex items-center gap-[10px]'>
              <span>Share To: </span>
              <button type='button'>
                <Link href={twitterShareLink} target='_blank' className='!text-[#1d9bf0]'>
                  <TwitterIcon width='24' height='24' />
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default MintSuccessDialog