import { FC } from 'react'
import classnames from 'classnames'

import { useRootConfig } from '@/contexts/root'

interface Props {}

const ScrollTop: FC<Props> = () => {
  const { scrollTop } = useRootConfig()
  return (
    <button
      className={classnames('hidden items-center justify-center w-10 h-10 rounded-[4px] shadow-solid-5 bg-primary hover:bg-primaryho fixed bottom-8 right-8 z-999', {
        '!flex': scrollTop
      })}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <svg className="fill-white w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
      </svg>
    </button>
  )
}

export default ScrollTop