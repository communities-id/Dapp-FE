import { FC, ReactNode, MouseEvent } from 'react'
import classnames from 'classnames'

interface Props {
  type?: 'submit' | 'reset' | 'button'
  theme: 'primary' | 'secondary' | 'normal' | 'dark' | 'search'
  className?: string
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  [x: string]: any
}

const Button: FC<Props> = ({ type = 'button', theme, className = '', onClick, children, ...rest }) => {
  return (
    <button
      className={classnames(
        'h-[46px] rounded-[32px]',
        'flex items-center text-center',
        'text-[16px] font-bold text-white',
        'group',
        {
          'bg-primary hover:bg-primaryho dark:bg-primarydark dark:hover:bg-primarydarkho': theme === 'primary',
        },
        {
          '!text-black': theme === 'dark',
        },
        {
          'border-[2px] border-white bg-[#25292E] !text-white': theme === 'search',
        },
        className
      )}
      type={type}
      { ...rest }
      onClick={onClick}
    >{ children }</button>
  )
}

export default Button