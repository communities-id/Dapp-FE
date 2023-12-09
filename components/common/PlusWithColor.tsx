
import { FC } from 'react'
interface PlusIconWithColorProps {
  className?: string
  color?: string
  width?: number
  height?: number
}

const PlusIconWithColor: FC<PlusIconWithColorProps> = (props) => {
  const { className, color } = props
  const finalColor = color || '#883fff'
  return (
    <svg width="16" height="16" className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.02001 3.33301L8.00781 12.6663" stroke={finalColor} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.33398 8H12.6673" stroke={finalColor} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )

}

export default PlusIconWithColor


