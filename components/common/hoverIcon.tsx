import { FC, ReactNode } from 'react'
import Link from 'next/link'
import classnames from 'classnames'

interface Props {
  size?: number
  link?: string
  noHover?: boolean
  noPad?: boolean
  children?: ReactNode
  className?: string
}

const HoverIcon: FC<Props> = ({ size = 24, link, noPad, noHover, className, children }) => {
  return (
    <div className={
      classnames(
        'inline-flex items-center justify-center text-iconGray',
        {
          'rounded-full hover:bg-iconHoverBg': !noHover,
          'p-2': !link && !noPad,
        },
        className
    )}>
      {
        link ? (
          <Link
            href={link!}
            target='_blank'
            title={link}
            className={classnames('inline-block w-full h-full bg-none', {
              'p-2': !noPad
            })}
            onClick={(e) => {
              e.stopPropagation()
            }}>
            { children }
          </Link>
        ) : children
      }
    </div>
  )
}

export default HoverIcon