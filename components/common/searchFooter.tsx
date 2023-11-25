import { FC } from 'react'
import classnames from 'classnames'
import DarkLogo from '~@/logo/inline-dark.svg'
import Link from 'next/link'
import LogoWithColor from './LogoWithColor'
import { useDetails } from '@/contexts/details'
interface Props {
  className?: string
}

const SearchFooter: FC<Props> = ({ className }) => {
  const { communityInfo } = useDetails()
  return (
    <div className={classnames(`mt-auto w-full flex justify-center bg-white py-5 sm:hidden ${className}`)}>
      <div className="flex items-center gap-[12px]">
        <span className='text-gray-logo'>Powered by</span>
        <Link href='/' target='_blank' className='group'>
          <div className='group-hover:block'>
            <LogoWithColor width={106} height={24} className="dark:hidden w-full" color={communityInfo.tokenUri?.brand_color ?? ''} />
            <DarkLogo width='106' height='24' className="hidden dark:block" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SearchFooter