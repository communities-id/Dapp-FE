import { FC, Fragment } from 'react'

import { useWallet } from '@/hooks/wallet'

import Dialog from '@/components/_common/dialog'
import Modal from '@/components/_common/modal'
import BrandManageContent from '@/components/_brand/manage'

import ProfileIcon from '~@/_brand/profile.svg'
import AccountIcon from '~@/_brand/account.svg'
import MintIcon from '~@/_brand/mint.svg'
import RenewIcon from '~@/_brand/renew.svg'
import SocialLinkIcon from '~@/_brand/social.svg'

import { CommunityInfo } from '@/types'
import { lab } from 'd3'

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  open: boolean
  handleClose?: () => void
  handleChooseTab?: (tabName: string) => void
}

const MobileBrandManageMenus: FC<Props> = ({ brandName, brandInfo, open, handleClose, handleChooseTab }) => {
  const { address: account } = useWallet()

  const tabs = [
    {
      label: 'Profile Settings',
      name: 'mobile-manage-profile-setting',
      icon: <ProfileIcon className='w-5 h-5' />,
      line: true
    },
    {
      label: 'Account Management',
      name: 'mobile-manage-account-setting',
      icon: <AccountIcon className='w-5 h-5' />,
      line: true
    },
    {
      label: 'Mint Settings',
      name: 'mobile-manage-mint-setting',
      icon: <MintIcon className='w-5 h-5' />,
      line: true
    },
    {
      label: 'Renew',
      name: 'mobile-manage-renew-setting',
      icon: <RenewIcon className='w-5 h-5' />,
    },
    {
      label: 'Link Telegram Group',
      name: 'mobile-manage-tg-setting',
      icon: <SocialLinkIcon className='w-5 h-5' />,
    },
  ]

  return (
    <Modal
      open={open}
      wrapClassName='w-full !items-end'
      containerClassName='w-full'
      slideProps={{
        direction: 'Y',
        offset: 400
      }}
      enableBackdropClick
      onBackdropClick={handleClose}
      handleClose={handleClose}
    >
      <div className='w-full pt-[10px] pb-[28px] px-[30px] bg-white rounded-t-[10px]'>
        <ul className='flex flex-col gap-[10px]'>
          {
            tabs.map((tab, index) => {
              return (
                <Fragment key={index}>
                  <li
                    className='w-full py-3 text-main-black'
                    onClick={() => handleChooseTab?.(tab.name)}
                  >
                    <div className='flex-itmc gap-[10px]'>
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  </li>
                  {
                    tab.line && (
                      <li key={`line-${index}`}>
                        <div className='w-full h-[1px] bg-gray-7'></div>
                      </li>
                    )
                  }
                </Fragment>
              )
            })
          }
        </ul>
      </div>
    </Modal>
  )
}

export default MobileBrandManageMenus