import { FC } from 'react'

interface Props {}

const Lines: FC<Props> = () => {
  return (
    <div className="fixed top-0 left-0 -z-10 flex h-full w-full items-center justify-around">
      <span className="w-[1px] h-full bg-stroke dark:bg-strokedark flex animate-line1"></span>
      <span className="w-[1px] h-full bg-stroke dark:bg-strokedark flex animate-line2"></span>
      <span className="w-[1px] h-full bg-stroke dark:bg-strokedark flex animate-line3"></span>
    </div>
  )
}

export default Lines