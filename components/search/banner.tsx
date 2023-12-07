import { FC, useMemo, ReactNode } from 'react'
import classnames from 'classnames'

import { parseImgSrc } from '@/shared/helper'

interface Props {
  banner?: string
  brandColor?: string
  className?: string
  children?: ReactNode
}

const Banner: FC<Props> = ({ banner, brandColor, className, children }) => {

  const brandImage = useMemo(() => {
    const bgImg = parseImgSrc(banner)
    if (bgImg) return `url(${bgImg})`
    if (brandColor) return `linear-gradient(to right, ${brandColor}, ${brandColor})`
    return `url(${'/search/search-banner.png'})`
  }, [banner, brandColor])
  
  return (
    <div className={
      classnames('h-[260px] sm:h-[140px]', {
        '!bg-cover !bg-center': !!banner,
        'bg-default-search-banner' : !banner
      }, className)
    } style={{
      backgroundImage: brandImage
    }}>
      { children }
    </div>
  )
}

export default Banner