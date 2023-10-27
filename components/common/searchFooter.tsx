import { FC } from 'react'
import classnames from 'classnames'
import TransparentLogo from '~@/logo/inline-transparent.svg'
import LightLogo from '~@/logo/inline-light.svg'
import DarkLogo from '~@/logo/inline-dark.svg'
import Link from 'next/link'
interface Props {
  className?: string
}

const SearchFooter: FC<Props> = ({ className }) => {
  return (
    <div className={classnames(`mt-[10px] flex items-center gap-[12px] ${className}`)}>
      <span className='text-gray-logo'>Powered by</span>
      <Link href='/' target='_blank' className='group'>
        <TransparentLogo width='106' height='24' className="text-gray-logo block group-hover:hidden" />
        <div className='hidden group-hover:block'>
          <LightLogo width='106' height='24' className="block dark:hidden" />
          <DarkLogo width='106' height='24' className="hidden dark:block" />
        </div>
      </Link>
    </div>
  )
}

export default SearchFooter