import { FC } from 'react'
import classnames from 'classnames'

import { parseImgSrc } from '@/shared/helper'

interface Props {
  className?: string
  size?: number
  src?: string
  outline?: boolean
}

const AvatarCard: FC<Props> = ({ className, size, src, outline }) => {
  return (
    <div
      className={classnames('overflow-hidden', {
        'bg-avatar rounded-[12px]': !src,
        'outline outline-avatar': outline
      }, className)}
      style={{ width: size, height: size }}>
      {
        src ? (
          <img
            alt='avatar'
            className='w-full h-full object-cover'
            src={parseImgSrc(src)}
          />
        ) : null
      }
    </div>
  )
}

export default AvatarCard