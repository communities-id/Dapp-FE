import { FC, useMemo } from 'react'
import classnames from 'classnames'

import { parseImgSrc } from '@/shared/helper'

interface Props {
  banner?: string
  brandColor?: string
  className?: string
}

const Banner: FC<Props> = ({ banner, brandColor, className }) => {

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
    }}></div>
  )
}

export default Banner