import { FC, useMemo } from 'react'
import classnames from 'classnames'

interface Props {
  isExpired: boolean
  isRenewal: boolean
}

const Status: FC<Props> = ({ isExpired, isRenewal }) => {
  const text = useMemo(() => {
    if (isExpired) return 'Expired'
    if (isRenewal) return 'Pending Renewal'
    return ''
  }, [isExpired, isRenewal])
  return (
    <div className={
      classnames(
        'ml-[10px] px-[6px] py-[4px] inline-block rounded-[6px] text-statusTag',
        {
          'bg-expired-tag text-expired-tag': isExpired,
          'bg-pending-tag text-pending-tag': isRenewal,
          'hidden': !text
        }
      )
    }>
      { text }
    </div>
  )
}

export default Status