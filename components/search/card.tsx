import { FC } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { getOpenseaLink } from '@/utils/tools'
import { CHAIN_ID } from '@/shared/constant'

import AvatarCard from '@/components/common/avatar'
import HoverIcon from '@/components/common/hoverIcon'

import { CommunityMember } from '@/types'

import OpenseaIcon from '~@/icons/social/opensea.svg'

interface Props {
  info: {
    name: string
    avatar: string
    registry: string
    tokenId?: number
  }
  chainId?: number
  noOpensea?: boolean
  className?: string
  onClick?: (name: string) => void
}

const MemberCard: FC<Props> = ({ info, chainId = CHAIN_ID, noOpensea, className, onClick }) => {
  const openseaLink = getOpenseaLink(info.registry, chainId, info.tokenId)
  
  return (
    <figure className={
      classnames(
        'relative group flex flex-col overflow-hidden rounded-[20px] cursor-pointer transition-all duration-300 hover:shadow-member-i',
        className
      )}
      onClick={() => {
        // router.push(link || `/member/${info.name}`)
        onClick?.(info.name)
      }}>
      <AvatarCard className='w-full aspect-square' src={info.avatar} />
      <div className='absolute top-0 left-0 w-full px-[14px] py-[8px] pointer-events-none select-none transition-all duration-300 opacity-0 group-hover:opacity-100'>
        {
          !noOpensea && openseaLink && (
            <HoverIcon link={openseaLink} noHover className='pointer-events-auto'>
              <OpenseaIcon width={24} height={24} />
            </HoverIcon>
          )
        }
      </div>
      <figcaption className='p-[14px] bg-white'>
        <h4 title={info.name} className='text-member-i-tit text-ellipsis overflow-hidden'>{ info.name }</h4>
        <p className='mt-[2px] text-member-i-p'>#{ info.tokenId }</p>
      </figcaption>
    </figure>
  )
}

export default MemberCard