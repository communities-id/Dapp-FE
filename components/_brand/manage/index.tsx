import { CSSProperties, useState } from 'react'
import classNames from 'classnames'

import { useDetails } from '@/contexts/details'

import Tabs from '@/components/_brand/manage/tabs'
import ProfileSettings from '@/components/_brand/manage/profile'
import AccountManagement from '@/components/_brand/manage/account'
import MintSettings from '@/components/_brand/manage/mint'
import Renew from '@/components/_brand/manage/renew'
import SocialLink from '@/components/_brand/manage/socialLink'

import ProfileIcon from '~@/_brand/profile.svg'
import AccountIcon from '~@/_brand/account.svg'
import MintIcon from '~@/_brand/mint.svg'
import RenewIcon from '~@/_brand/renew.svg'
import SocialLinkIcon from '~@/_brand/social.svg'

export default function BrandMannageContent() {
  const [tab, setTab] = useState(0)
  const { communityInfo, refreshInfo } = useDetails()

  const brandColor = communityInfo?.tokenUri?.brand_color ?? '#8840FF'

  const tabs = [
    {
      groupId: 1,
      list: [
        {
          label: 'Profile Settings',
          value: 0,
          renderPanel: () => <ProfileSettings />,
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
          label: 'Account Management',
          value: 1,
          renderPanel: () => <AccountManagement />,
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
          renderPanel: () => <MintSettings />,
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
          renderPanel: () => <Renew />,
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
          label: 'Social Link',
          value: 4,
          renderPanel: () => <SocialLink />,
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

  return (
    <div style={{ '--var-brand-color': brandColor } as CSSProperties}>
      <Tabs value={tab} tabs={tabs} tabPanelClassName='modal-content-box' onChange={(v) => setTab(v)} />
    </div>
  )
}