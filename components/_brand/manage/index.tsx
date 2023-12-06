import { CSSProperties, useEffect, useState } from 'react'
import classNames from 'classnames'

import { useDIDContent } from '@/hooks/content'

import Tabs from '@/components/_brand/manage/tabs'
import ProfileSettings from '@/components/_brand/manage/profile'
import AccountManagement from '@/components/_brand/manage/account'
import MintSettings from '@/components/_brand/manage/mint'
import Renew from '@/components/_brand/manage/renew'
import SocialLink from '@/components/_brand/manage/socialLink'

import { CommunityInfo } from '@/types'

import ProfileIcon from '~@/_brand/profile.svg'
import AccountIcon from '~@/_brand/account.svg'
import MintIcon from '~@/_brand/mint.svg'
import RenewIcon from '~@/_brand/renew.svg'
import SocialLinkIcon from '~@/_brand/social.svg'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  notLoaded?: boolean
}
export default function BrandMannageContent({ account, brandName, brandInfo: inputBrandInfo, notLoaded }: Props) {
  const [tab, setTab] = useState(0)
  const { brandInfo, brandInfoLoading, brandNotLoaded } = useDIDContent({ brandName, brandInfo: inputBrandInfo  })

  const [pendingBrandColor, setPendingBrandColor] = useState('')

  const brandColor = pendingBrandColor || brandInfo?.tokenUri?.brand_color || '#8840FF'

  const tabs = [
    {
      groupId: 1,
      list: [
        {
          label: 'Profile Settings',
          value: 0,
          renderPanel: () => <ProfileSettings brandInfo={brandInfo} onBrandColorChange={setPendingBrandColor} />,
          renderIcon: (active: boolean) => {
            return <ProfileIcon
              className={
                classNames('w-5 h-5', {
                  'var-brand-textcolor': active,
                  'text-main-black': !active
                })
              }
            />
          }
        },
        {
          label: 'Official Link Settings',
          value: 1,
          renderPanel: () => <AccountManagement brandInfo={brandInfo} />,
          renderIcon: (active: boolean) => {
            return <AccountIcon
              className={
                classNames('w-5 h-5', {
                  'var-brand-textcolor': active,
                  'text-main-black': !active
                })
              }
            />
          }
        }
      ]
    },
    {
      groupId: 2,
      list: [
        {
          label: 'Mint Settings',
          value: 2,
          brandColor,
          renderPanel: () => <MintSettings account={account} brandInfo={brandInfo} brandNotLoaded={brandNotLoaded} brandColor={brandColor} />,
          renderIcon: (active: boolean) => {
            return <MintIcon
              className={
                classNames('w-5 h-5', {
                  'var-brand-textcolor': active,
                  'text-main-black': !active
                })
              }
            />
          }
        },
        {
          label: 'Renew',
          value: 3,
          renderPanel: () => <Renew brandInfo={brandInfo} />,
          renderIcon: (active: boolean) => {
            return <RenewIcon
              className={
                classNames('w-5 h-5', {
                  'var-brand-textcolor': active,
                  'text-main-black': !active
                })
              }
            />
          }
        },
        {
          label: 'Token-gate Telegram Group',
          value: 4,
          renderPanel: () => <SocialLink brandInfo={brandInfo} />,
          renderIcon: (active: boolean) => {
            return <SocialLinkIcon
              className={
                classNames('w-5 h-5', {
                  'var-brand-textcolor': active,
                  'text-main-black': !active
                })
              }
            />
          }
        }
      ]
    }
  ]

  useEffect(() => {
    console.log('notLoaded', notLoaded)
    if (!notLoaded) return
    setTab(2)
  }, [notLoaded])

  return (
    <div style={{ '--var-brand-color': brandColor } as CSSProperties}>
      <Tabs value={tab} tabs={tabs} tabPanelClassName='modal-content-box' onChange={(v) => setTab(v)} />
    </div>
  )
}