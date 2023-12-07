import { CSSProperties, FC, Fragment, ReactNode, useEffect } from 'react'
import classNames from 'classnames'

import Button from '@/components/_common/button'

import ArrowLeftIcon from '~@/_brand/arrow-left.svg'

interface MobileBrandManageLayoutProps {
  title: string
  // account?: string
  // brandName?: string
  // brandInfo?: Partial<CommunityInfo>
  brandColor?: string
  footer?: boolean
  loading?: boolean
  containerClassName?: string
  contentClassName?: string
  children: ReactNode
  renderFooter?: () => ReactNode
  onClose?: () => void
  onClick?: () => void
}

export default function MobileBrandManageLayout({ title, brandColor, footer, loading, containerClassName, contentClassName, children, renderFooter, onClose, onClick }: MobileBrandManageLayoutProps) {
  const handleClose = () => {
    if (loading) return
    onClose?.()
  }
  return (
    <div
      className={classNames('flex flex-col', {
        'min-h-full': !footer,
        'h-full': footer
      })}
      style={{ '--var-brand-color': brandColor || '#8840FF' } as CSSProperties}
    >
      <div className={classNames('flex-1 pt-[30px]', {
        'h-full flex flex-col': footer
      })}>
        <MobileSettingTitle text={title} onClick={handleClose}/>
        <div className={classNames('pt-5 pb-[30px]', {
          'flex-1 overflow-y-scroll': footer,
        }, containerClassName)}>
          <div className={classNames('px-[30px]', contentClassName)}>
            {children}
          </div>
        </div>
        {
          footer && (
            <div>
              <div className='divider-line'></div>
              <div className='w-full px-5 pt-4 pb-8'>
                {
                  renderFooter ? renderFooter() : (
                    <Button
                      loading={loading}
                      size='medium'
                      theme='variable'
                      wrapClassName='w-full'
                      className='w-full var-brand-bgcolor'
                      onClick={onClick}
                    >Save on Chain</Button>
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

interface MobileSettingTitleProps {
  text: string
  onClick?: () => void
}

const MobileSettingTitle: FC<MobileSettingTitleProps> = ({ text, onClick }) => {
  return (
    <div className='flex-itmc gap-1 px-5 pb-[10px]' onClick={onClick}>
      <ArrowLeftIcon width='20' height='20' className='text-black-1' />
      <h1 className='text-[22px] leading-[35px] font-bold text-main-black'>{ text }</h1>
    </div>
  )
}