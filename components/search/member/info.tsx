import { FC, ReactNode } from 'react'

import { useDetails } from '@/contexts/details'

import AvatarCard from '@/components/common/avatar'

import TwitterIcon from '~@/icons/social/twitter.svg'
import MediumIcon from '~@/icons/social/medium.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import TransIcon from '~@/icons/trans.svg'
import ShareIcon from '~@/icons/share.svg'
import MoreIcon from '~@/icons/more.svg'


interface Props {
}

const MemberInfo: FC<Props> = () => {
  const { keywords } = useDetails()

  return (
    <div className='w-full'>
      <AvatarCard size={100} className='absolute top-[-80px] left-0 rounded-full'/>
      <div className="w-full flex flex-col">
        <div className='w-full flex items-center justify-between'>
          <h1 className='flex-1 text-searchtitle'>{ keywords }</h1>
          <div className='flex items-center justify-end gap-2'>
            <div className='text-secondaryBlack'>
              <TwitterIcon width='24' height='24' />
            </div>
            <div className='text-secondaryBlack'>
              <MediumIcon width='24' height='24' />
            </div>
            <div className='text-secondaryBlack'>
              <TelegramIcon width='24' height='24' />
            </div>
            <div className='text-secondaryBlack'>
              <DiscordIcon width='24' height='24' />
            </div>
            <div className='text-secondaryBlack'>
              <TransIcon width='26' height='26' />
            </div>
            <div className='text-secondaryBlack'>
              <ShareIcon width='24' height='24' />
            </div>
            <div className='text-secondaryBlack'>
              <MoreIcon width='24' height='24' />
            </div>
          </div>
        </div>
        <p className='mt-[12px] text-searchdesc'>-</p>
        <div className='mt-[20px] flex items-center justify-between gap-2'>
          <div className='text-secondaryBlack py-[6px] px-[20px] bg-tag rounded-[6px]'>
            <p className='text-searchTagTitle'>Owner</p>
            <p className='text-searchTagContent text-primary'>0x24131...24102B35f</p>
          </div>
          <div className='text-secondaryBlack py-[6px] px-[20px] bg-tag rounded-[6px]'>
            <p className='text-searchTagTitle'>Validity date</p>
            <p className='text-searchTagContent text-secondaryBlack'>2024/5/9</p>
          </div>
          <div className='text-secondaryBlack py-[6px] px-[20px] bg-tag rounded-[6px]'>
            <p className='text-searchTagTitle'>Income of owner </p>
            <p className='text-searchTagContent text-secondaryBlack'>0%</p>
          </div>
          <div className='text-secondaryBlack py-[6px] px-[20px] bg-tag rounded-[6px]'>
            <p className='text-searchTagTitle'>Chain</p>
            <p className='text-searchTagContent text-secondaryBlack'>Mumbai</p>
          </div>
          <div className='text-secondaryBlack py-[6px] px-[20px] bg-tag rounded-[6px]'>
            <p className='text-searchTagTitle'>Price Model</p>
            <p className='text-searchTagContent text-secondaryBlack'>-</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberInfo