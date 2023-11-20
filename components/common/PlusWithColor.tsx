
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
    <svg width="60" height="60" className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30.075 12.5L30.0293 47.5" stroke={finalColor} stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.4995 30H47.4995" stroke={finalColor} stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

export default PlusIconWithColor


