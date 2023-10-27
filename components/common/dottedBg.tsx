import { FC } from 'react'
import Image from 'next/image'
import classnames from 'classnames'

interface Props {
  className?: string
}

const DottedBg: FC<Props> = ( { className }) => {
  return (
    <div className={classnames('absolute -z-1 bottom-5 left-0 w-full h-full overflow-hidden', className)}>
      <div className='w-screen'>
        <Image alt="Dotted" src="/shape/shape-dotted-light.svg" width="1403" height="383" className="dark:hidden"/>
        <Image alt="Dotted" src="/shape/shape-dotted-dark.svg" width="1403" height="383" className="hidden dark:block"/>
      </div>
    </div>
  )
}

export default DottedBg