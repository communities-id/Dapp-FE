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
  isMobile?: boolean
  name?: string
  memberInfo?: Partial<MemberInfo>
  brandInfo?: Partial<CommunityInfo>
}

const MemberDetail: FC<Props> = ({ isMobile, name, memberInfo: inputMemberInfo, brandInfo }) => {
  const { showGlobalDialog } = useGlobalDialog()

  const { type, community, member, memberInfo, memberInfoLoading } = useMemberContent({ memberName: name ?? '', memberInfo: inputMemberInfo, brandInfo })

  const actions = useMemo(() => {
    return [
      {
        id: 'member-burn',
        mobileId: 'mobile-member-burn',
        text: 'Burn',
        icon: <BurnIcon width={16} height={16} />,
        inverse: false,
        latest: false,
      },
      {
        id: 'member-renew',
        mobileId: 'mobile-member-renew',
        text: 'Renew',
        icon: <RenewIcon width={16} height={16} />,
        inverse: false,
        latest: false,
      }
    ]
  }, [])

  const primaryAction = useMemo(() => {
    return !memberInfo?.isPrimary ? {
      id: 'member-primary',
      mobileId: 'mobile-member-primary',
      text: 'Set as Primary',
      icon: <SetIcon width={16} height={16} />,
      inverse: true,
      latest: true,
    } : null
  }, [memberInfo?.isPrimary])

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
        Icon: OpenseaIcon
      },
      {
        id: 'website',
        label: 'Website',
        link: external_url,
        Icon: WebsiteIcon
      },
      {
        id: 'twitter',
        label: 'Twitter',
        link: twitter ? `https://twitter.com/${twitter}` : '',
        Icon: TwitterIcon
      },
      {
        id: 'discord',
        label: 'Discord',
        link: discord ? `https://discordapp.com/users/${discord}` : '',
        Icon: DiscordIcon
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
    <div className={
        classNames(
          'flex w-full',
          {
            'flex-col': isMobile,
            'h-[312px]': !isMobile,
          }
        )
      }
    >
      <div>
        <AvatarCard size={isMobile ? 320 : 312} src={memberInfo?.tokenUri?.image} />
      </div>
      <div className='flex-1 flex flex-col'>
        <div className={
          classNames('flex-1 flex flex-col', {
            'gap-4 p-[30px] pt-6': !isMobile,
            'gap-5 p-5 pb-6': isMobile,
          })
        }>
          <div>
            <h2 className='text-[24px] leading-[34px] font-semibold text-main-black'>{ name }</h2>
            <p className='text-[14px] leading-[18px] font-semibold text-gray-1'>#{ memberInfo?.node?.tokenId }</p>
          </div>
          <ul className='flex items-center gap-[6px]'>
            {
              socialLinks.map(({ id, label, link, Icon }, idx) => {
                return (
                  <li
                    key={idx}
                    className={
                      classNames(
                        'cursor-pointer',
                        {
                          'p-[10px] rounded-[10px] hover:bg-gray-6': !isMobile,
                        }
                      )
                    }>
                    {
                      isMobile ? (
                        <Icon width='24' height='24' className='text-main-black' />
                      ) : (
                        <Icon width='20' height='20' className='text-main-black' />
                      )
                    }
                  </li>
                )
              })
            }
            <li>
              <div className='mx-[10px] w-px h-4 bg-main-black'></div>
            </li>
            <li>
            <Popover
              className={classNames({
                'w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg': !isMobile
              })}
              id={Number(memberInfo.node?.tokenId) + 'share'}
              menus={memberSharePopoverMenus}
              // disabled={shouldSwitchNetwork}
              handleSelect={handleSelectShareMenu}
            >
              {
                isMobile ? (
                  <ShareIcon width='24' height='24' className='text-main-black'/>
                ) : (
                  <ShareIcon width='20' height='20' className='text-main-black'/>
                )
              }
            </Popover>
            </li>
          </ul>
          <div
            className={
              classNames(
                'flex',
                {
                  'flex-col gap-4': isMobile,
                  'gap-10': !isMobile,
                }
              )
            }>
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
        </div>
        {
          isMobile && (
            <div className='w-full h-px bg-gray-7'></div>
          )
        }
        <div className={
          classNames({
            'p-[30px] pt-6': !isMobile,
            'p-5 pb-6 flex flex-col gap-3': isMobile,
          })
        }>
          {
            isMobile && primaryAction && (
              <div className='w-full'>
                <BaseButton
                  wrapClassName='w-full'
                  className='w-full px-3 py-[10px] flex-center gap-[6px] rounded-[100px] bg-main-black text-white'
                  size='short'
                  onClick={() => {
                    showGlobalDialog(isMobile ? primaryAction.mobileId : primaryAction.id, { memberName: name, memberInfo, brandName: community, brandInfo })
                  }}
                >
                  { primaryAction.icon }
                  <span>{ primaryAction.text }</span>
                </BaseButton>
              </div>
            )
          }
          <ul
            className={
              classNames(
                'w-full flex items-center gap-[10px]',
              )
            }>
            {
              actions.map(({ id, text, icon, mobileId }, idx) => {
                return (
                  <li key={idx} className={classNames({ 'flex-1': isMobile })}>
                    <BaseButton
                      wrapClassName='w-full'
                      className='w-full px-3 py-[10px] flex-center gap-[6px] rounded-[100px] text-main-black bg-white border border-solid border-main-black hover:border-black-tr-80'
                      size='short'
                      onClick={() => {
                        showGlobalDialog(isMobile ? mobileId : id, { memberName: name, memberInfo, brandName: community, brandInfo })
                      }}
                    >
                      { icon }
                      <span>{ text }</span>
                    </BaseButton>
                  </li>
                )
              })
            }
            {
              !isMobile && primaryAction && (
                <li className='flex-1'>
                  <BaseButton
                    wrapClassName='w-full'
                    className='w-full px-3 py-[10px] flex-center gap-[6px] rounded-[100px] bg-main-black text-white'
                    size='short'
                    onClick={() => {
                      showGlobalDialog(isMobile ? primaryAction.mobileId : primaryAction.id, { memberName: name, memberInfo, brandName: community, brandInfo })
                    }}
                  >
                    { primaryAction.icon }
                    <span>{ primaryAction.text }</span>
                  </BaseButton>
                </li>
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MemberDetail