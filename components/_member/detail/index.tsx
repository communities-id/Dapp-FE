import { FC, useEffect, useMemo, useState } from 'react'

import { useGlobalDialog } from '@/contexts/globalDialog'
import { useRoot } from '@/contexts/root'
import { getNormalTwitterShareLink } from '@/utils/share'
import { getOpenseaLink } from '@/utils/tools'
import { formatDate } from '@/shared/helper'
import { useMemberContent } from '@/hooks/content'

import AvatarCard from '@/components/_common/avatar'
import Popover, { PopoverMenuItem } from '@/components/common/popover'
import BaseButton from '@/components/_common/baseButton'

import { CommunityInfo, MemberInfo } from '@/types'

import OpenseaIcon from '~@/icons/info/opensea.svg'
import WebsiteIcon from '~@/icons/social/website.svg'
import TwitterIcon from '~@/icons/social/twitter.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import SetIcon from '~@/icons/settings/set.svg'
import RenewIcon from '~@/icons/settings/renew.svg'
import BurnIcon from '~@/icons/settings/burn.svg'
import ShareIcon from '~@/icons/share.svg'
import PrimaryDID from '@/components/common/primaryDID'
import classNames from 'classnames'

interface Props {
  name?: string
  memberInfo?: Partial<MemberInfo>
  brandInfo?: Partial<CommunityInfo>
}

const MemberDetail: FC<Props> = ({ name, memberInfo: inputMemberInfo, brandInfo }) => {
  const { message, config, NetOps } = useRoot()
  const { showGlobalDialog } = useGlobalDialog()

  const { type, community, member, memberInfo, memberInfoLoading } = useMemberContent({ memberName: name ?? '', memberInfo: inputMemberInfo, brandInfo })

  const actions = useMemo(() => {
    return [
      {
        id: 'member-burn',
        mobileId: 'mobile-member-burn',
        text: 'Burn',
        icon: <BurnIcon width={16} height={16} />,
      },
      {
        id: 'member-renew',
        mobileId: 'mobile-member-renew',
        text: 'Renew',
        icon: <RenewIcon width={16} height={16} />,
      },
      {
        id: 'member-primary',
        mobileId: 'mobile-member-primary',
        text: 'Set as Primary',
        icon: <SetIcon width={16} height={16} />,
        inverse: true,
        latest: true,
      }
    ]
  }, [])

  const memberSharePopoverMenus: PopoverMenuItem[] = useMemo(() => {
    if (typeof window === 'undefined') return []
    const memberLink = `${window.location.origin}/member/${memberInfo?.tokenUri?.name}`
    return [
      {
        id: 'twitter',
        text: 'Share on Twitter',
        icon: <TwitterIcon width={16} height={16} className='text-[#333]'/>,
        link: getNormalTwitterShareLink(memberLink)
      }
    ]
  }, [memberInfo?.tokenUri?.name])

  const openseaLink = useMemo(() => {
    if (!memberInfo?.node?.tokenId || !brandInfo?.node?.registry || !brandInfo?._chaninId) return ''
    return getOpenseaLink(brandInfo.node.registry!, brandInfo._chaninId, Number(memberInfo.node.tokenId))
  }, [memberInfo?.node?.tokenId, brandInfo?._chaninId, brandInfo?.node?.registry])

  const socialLinks = useMemo(() => {
    if (!memberInfo) return []
    const { external_url = '' } = memberInfo.tokenUri ?? {}
    const { twitter, discord, telegram } = memberInfo.tokenUri?.attr ?? {}
    return [
      {
        id: 'opensea',
        label: 'Opensea',
        link: openseaLink,
        icon: <OpenseaIcon width='20' height='20' className='text-main-black' />
      },
      {
        id: 'website',
        label: 'Website',
        link: external_url,
        icon: <WebsiteIcon width='20' height='20' className='text-main-black'/>
      },
      {
        id: 'twitter',
        label: 'Twitter',
        link: twitter ? `https://twitter.com/${twitter}` : '',
        icon: <TwitterIcon width='20' height='20' className='text-main-black'/>
      },
      {
        id: 'discord',
        label: 'Discord',
        link: discord ? `https://discordapp.com/users/${discord}` : '',
        icon: <DiscordIcon width='20' height='20' className='text-main-black'/>
      },
      {
        id: 'tg',
        label: 'Telegram',
        link: telegram ? `https://t.me/${telegram}` : '',
        icon: <TelegramIcon width='20' height='20' className='text-main-black'/>
      }
    ].filter(({ link }) => !!link)
  }, [memberInfo, openseaLink])

  const handleSelectShareMenu = async (menu: PopoverMenuItem) => {
  }

  return (
    <div className='flex w-full h-[312px]'>
      <div>
        <AvatarCard size={312} src={memberInfo?.tokenUri?.image} />
      </div>
      <div className='flex-1 flex flex-col gap-4 p-[30px] pt-6'>
        <div>
          <h2 className='text-[24px] leading-[34px] font-semibold text-main-black'>{ name }</h2>
          <p className='text-[14px] leading-[18px] font-semibold text-gray-1'>#{ memberInfo?.node?.tokenId }</p>
        </div>
        <ul className='flex items-center gap-[6px]'>
          {
            socialLinks.map(({ id, label, link, icon }, idx) => {
              return (
                <li key={idx} className='p-[10px] rounded-[10px] hover:bg-gray-6 cursor-pointer'>
                  { icon }
                </li>
              )
            })
          }
          <li>
            <div className='mx-[10px] w-px h-4 bg-main-black'></div>
          </li>
          <li>
          <Popover
            className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg'
            id={Number(memberInfo.node?.tokenId) + 'share'}
            menus={memberSharePopoverMenus}
            // disabled={shouldSwitchNetwork}
            handleSelect={handleSelectShareMenu}
          >
            <ShareIcon width='20' height='20' className='text-main-black'/>
          </Popover>
          </li>
        </ul>
        <div className='flex gap-10'>
          <div>
            <p className='text-[13px] leading-[16px] font-medium text-gray-1'>Holder</p>
            <div className='text-[14px] leading-[18px] font-medium text-main-black'>
              <PrimaryDID address={memberInfo?.owner ?? ''}/>
            </div>
          </div>
          <div>
            <p className='text-[13px] leading-[16px] font-medium text-gray-1'>Mint time</p>
            <p className='text-[14px] leading-[18px] font-medium text-main-black'>{ formatDate(memberInfo?.node?.createTime ?? 0) } - { formatDate(memberInfo?.node?.expireTime ?? 0) }</p>
          </div>
        </div>
        <div className='flex-1 flex flex-col justify-end'>
          <ul className='w-full flex items-center gap-[10px]'>
            {
              actions.map(({ id, text, icon, mobileId, inverse, latest }, idx) => {
                return (
                  <li key={idx} className={classNames({ 'flex-1': latest })}>
                    <BaseButton
                      wrapClassName={classNames({ 'w-full': latest })}
                      className={
                        classNames(
                          'px-3 py-[10px] flex-center gap-[6px] rounded-[100px]',
                          {
                            'text-main-black bg-white border border-solid border-main-black hover:border-black-tr-80': !inverse,
                            'bg-main-black text-white': inverse,
                            'w-full': latest
                          }
                        )
                      }
                      size='short'
                      onClick={() => {
                        showGlobalDialog(config.isMobile ? mobileId : id, { memberName: name, memberInfo, brandName: community, brandInfo })
                      }}
                    >
                      { icon }
                      <span>{ text }</span>
                    </BaseButton>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MemberDetail