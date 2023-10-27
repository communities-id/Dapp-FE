import { FC, Fragment, ReactNode, useState } from 'react'
import classNames from 'classnames'

import DividerLine from '@/components/common/dividerLine'

import ArrowCollapseSvg from '~@/icons/arrow-collapse.svg'

interface Props {
  className?: string
  children: ReactNode
}

const Collapse: FC<Props> = ({ className, children }) => {
  const [show, setShow] = useState(false)

  return (
    <Fragment>
      <div className={classNames('relative min-h-[40px]]', {
        'h-[40px]': !show
      }, className)}>
        <div className={classNames({
          'hidden': show
        })}>
          <DividerLine wrapClassName='!my-0' />
          <div
            className={
              classNames(
                'flex items-end justify-center w-full h-[40px]',
              )
            }
            onClick={() => setShow(true)}>
            <div className={
              classNames(
                'w-full flex items-center justify-center h-full bg-white cursor-pointer'
              )
            }>
              <ArrowCollapseSvg width="24" height="24" className='opacity-60 hover:opacity-100 transition-opacity' />
            </div>
          </div>
        </div>
        <div className={classNames('', {
          'h-0 overflow-hidden': !show,
          'overflow-visible': show,
        })}>
          { children }
        </div>
        <div className={classNames('mt-2', {
          'hidden': !show
        })}>
          <DividerLine wrapClassName='!my-0' />
          <div className={
            classNames(
              'w-full flex items-center justify-center h-[40px] bg-white cursor-pointer'
            )
          } onClick={() => setShow(false)}>
            <ArrowCollapseSvg width="24" height="24" className='rotate-180 opacity-60 hover:opacity-100 transition-opacity' />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Collapse