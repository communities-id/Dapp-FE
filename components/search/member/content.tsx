import { FC, useMemo, useState, Fragment } from 'react'
import Link from 'next/link'

import { useSwitchNetwork } from 'wagmi'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import { formatAddress, formatContractError, formatDate, parseImgSrc } from '@/shared/helper'
import { CHAINS_ID_TO_NETWORK, CHAIN_ID, MAIN_CHAIN_ID } from '@/shared/constant'
import useApi from '@/shared/useApi'
import { getOpenseaLink } from '@/utils/tools'
import { getNormalTwitterShareLink } from '@/utils/share'
import { updateMember } from '@/shared/apis'

import AvatarCard from '@/components/common/avatar'
import Popover, { PopoverMenuItem } from '@/components/common/popover'
import CommunityMint from '@/components/mint/community'
import MemberMint from '@/components/mint/member'
import PrimaryDID from '@/components/common/primaryDID'
import ExpandableDescription from '@/components/common/expandableDescription'
import MemberSetAsPrimaryDialog from '@/components/dialog/member/asPrimary'
import MemberProfileSettingDialog from '@/components/dialog/member/profileSetting'
import MemberRenewDialog from '@/components/dialog/member/renew'
import MemberBurnDialog from '@/components/dialog/member/burn'
import HoverIcon from '@/components/common/hoverIcon'
import DividerLine from '@/components/common/dividerLine'

import OpenseaIcon from '~@/icons/info/opensea.svg'
import WebsiteIcon from '~@/icons/social/website.svg'
import TwitterIcon from '~@/icons/social/twitter.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import ArrowRightIcon from '~@/icons/arrow-right.svg'
import MoreIcon from '~@/icons/more.svg'
import SetIcon from '~@/icons/settings/set.svg'
import SettingIcon from '~@/icons/settings/setting.svg'
import RefreshIcon from '~@/icons/settings/refresh.svg'
import RenewIcon from '~@/icons/settings/renew.svg'
import BurnIcon from '~@/icons/settings/burn.svg'
import LoadingIcon from '~@/icons/loading.svg'
import ShareIcon from '~@/icons/share.svg'

interface Props {
}

const PersonContent: FC<Props> = () => {
  const { message } = useRoot()
  const { keywords, communityInfo, memberInfo, loadingSet, communityInfoSet, memberInfoSet, shouldSwitchNetwork, isMainNetwork, refreshInfo } = useDetails()
  const { switchNetworkAsync } = useSwitchNetwork()

  const [dialogOpenSet, setDialogOpenSet] = useState<Record<'asPrimary' | 'profile' | 'renew' | 'burn', boolean>>({
    asPrimary: false,
    profile: false,
    renew: false,
    burn: false,
  })
  const [primarySetLoading, setPrimarySetLoading] = useState(false)

  const memberPopoverMenus: PopoverMenuItem[] = useMemo(() => {
    return [
      !loadingSet.member && memberInfoSet.isOwner && !memberInfoSet.isPrimary ? {
        id: 'asPrimary',
        text: 'Set as Primary',
        icon: <SetIcon width={16} height={16} className='text-[#333]'/>
      } : null,
      // {
      //   id: 'profile',
      //   text: 'Setting',
      //   icon: <SettingIcon width={16} height={16} className='text-[#333]'/>
      // },
      {
        id: 'refresh metadata',
        text: 'Refresh',
        icon: <RefreshIcon width={16} height={16} className='text-[#333]'/>
      },
      {
        id: 'renew',
        text: 'Renew',
        icon: <RenewIcon width={16} height={16} className='text-[#333]'/>
      },
      {
        id: 'burn',
        text: 'Burn',
        icon: <BurnIcon width={16} height={16} className='text-[#333]'/>
      },
    ].filter((item) => !!item) as PopoverMenuItem[]
  }, [memberInfo, loadingSet, primarySetLoading])

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
    if (!memberInfo?.node?.tokenId || !communityInfo?.node?.registry || !communityInfo?._chaninId) return ''
    return getOpenseaLink(communityInfo.node.registry!, communityInfo._chaninId, Number(memberInfo.node.tokenId))
  }, [memberInfo?.node?.tokenId, communityInfo?._chaninId, communityInfo?.node?.registry])

  const socialLinks = useMemo(() => {
    if (!memberInfo) return []
    const { external_url = '' } = memberInfo.tokenUri ?? {}
    const { twitter, discord, telegram } = memberInfo.tokenUri?.attr ?? {}
    return [
      {
        id: 'opensea',
        label: 'Opensea',
        link: openseaLink,
        icon: <OpenseaIcon width='24' height='24' />
      },
      {
        id: 'website',
        label: 'Website',
        link: external_url,
        icon: <WebsiteIcon width='24' height='24' className='text-iconGray'/>
      },
      {
        id: 'twitter',
        label: 'Twitter',
        link: twitter ? `https://twitter.com/${twitter}` : '',
        icon: <TwitterIcon width='24' height='24' className='text-iconGray'/>
      },
      {
        id: 'discord',
        label: 'Discord',
        link: discord ? `https://discordapp.com/users/${discord}` : '',
        icon: <DiscordIcon width='24' height='24' className='text-iconGray'/>
      },
      {
        id: 'tg',
        label: 'Telegram',
        link: telegram ? `https://t.me/${telegram}` : '',
        icon: <TelegramIcon width='24' height='24' className='text-iconGray'/>
      }
    ].filter(({ link }) => !!link)
  }, [memberInfo, openseaLink])

  const handleSelectMenu = async (menu: PopoverMenuItem) => {
    if (menu.id === 'refresh') {
      await updateMember(`${memberInfo.node?.node}.${communityInfo.node?.node}`, true)
      location.reload()
      return
    }
    if (shouldSwitchNetwork && menu.id !== 'asPrimary') {
      await switchNetworkAsync?.(communityInfo?._chaninId)
    }
    setDialogOpenSet(prev => ({ ...prev, [menu.id]: true }))
  }
  
  const handleSelectShareMenu = async (menu: PopoverMenuItem) => {
  }

  return (
    <div className='mt-[20px] flex flex-col gap-4'>
      {
        memberInfoSet.isMinted && (
          <div className="flex justify-between rounded-[10px] bg-white">
            <div className="flex flex-1 gap-3 pr-4">
              <AvatarCard size={124} src={memberInfo?.tokenUri?.image} />
              <div className='flex flex-1 gap-3 py-[14px] pl-[6px]'>
                <div className='flex-1 flex flex-col'>
                  <div className='flex flex-col justify-center'>
                    <h3 className='flex items-center gap-2 text-member-d-tit text-secondaryBlack'>
                      { keywords }
                  
                    </h3>
                    <p className='text-member-d-subtit'>#{Number(memberInfo?.node?.tokenId)}</p>
                  </div>
                  <div className='mt-[16px] w-full flex items-center gap-[30px]'>
                    <div className='flex flex-col' >
                      <p className='text-member-d-label'>Owner</p>
                      <h3 className='text-member-d-text text-secondaryBlack text-ellipsis overflow-hidden'>
                        <PrimaryDID address={memberInfo?.owner ?? ''}/>
                      </h3>
                    </div>
                    <div className='mx-[25px] w-[1px] h-[20px] bg-lineGray'></div>
                    <div className='flex flex-col' >
                      <p className='text-member-d-label'>Duration</p>
                      <h3 className='text-member-d-text text-secondaryBlack'>
                        { formatDate(memberInfo?.node?.createTime ?? 0) } - { formatDate(memberInfo?.node?.expireTime ?? 0) }
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col justify-between'>
                  <div className='flex items-start justify-end gap-3'>
                    {
                      memberInfoSet.isOwner && (
                        <Popover
                          className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg'
                          id={Number(memberInfo.node?.tokenId)}
                          menus={memberPopoverMenus}
                          // disabled={shouldSwitchNetwork}
                          handleSelect={handleSelectMenu}
                        >
                          <HoverIcon>
                            <MoreIcon width='24' height='24' className=''/>
                          </HoverIcon>
                        </Popover>
                      )
                    }
                  </div>
                  <div className='flex items-center mb-[6px] mr-2'>
                    <ul className='flex items-center justify-end gap-3'>
                      {
                        socialLinks.map(({ id, label, link, icon }, idx) => {
                          return (
                            <HoverIcon key={idx} link={link} noHover noPad>
                              { icon }
                            </HoverIcon>
                          )
                        })
                      }
                    </ul>
                    <DividerLine mode='horizontal' wrapClassName='!mx-3' />
                    <Popover
                      className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg'
                      id={Number(memberInfo.node?.tokenId) + 'share'}
                      menus={memberSharePopoverMenus}
                      // disabled={shouldSwitchNetwork}
                      handleSelect={handleSelectShareMenu}
                    >
                      <ShareIcon width='24' height='24' className='text-iconGray'/>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        communityInfoSet.unMint ? (
          <CommunityMint />
        ) : (
          memberInfoSet.unMint ? (
            <MemberMint/>
          ) : null
        )
      }
      <MemberSetAsPrimaryDialog
        open={dialogOpenSet['asPrimary']}
        memberName={keywords}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, asPrimary: false }))} />
      <MemberProfileSettingDialog
        open={dialogOpenSet['profile']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, profile: false }))} />
      <MemberRenewDialog
        open={dialogOpenSet['renew']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, renew: false }))} />
      <MemberBurnDialog
        open={dialogOpenSet['burn']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, burn: false }))} />
    </div>
  )
}

export default PersonContent