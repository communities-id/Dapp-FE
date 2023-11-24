import { FC, ReactNode, useMemo, Fragment, useState, useEffect } from 'react'
import Link from 'next/link'

import { useSwitchNetwork } from 'wagmi'
import { useDetails } from '@/contexts/details'
import useWallet from '@/shared/useWallet'
import { bindTelegramUser, getTelegramUser } from '@/shared/apis'

import AvatarCard from '@/components/common/avatar'
import PrimaryDID from '@/components/common/primaryDID'
import MemberProfileSettingDialog from '@/components/dialog/member/profileSetting'
import MemberRenewDialog from '@/components/dialog/member/renew'
import MemberBurnDialog from '@/components/dialog/member/burn'
import MemberBindTelegram from '@/components/dialog/member/bindTelegram'
import { PopoverMenuItem } from '@/components/common/popover'
import ExpandableDescription from '@/components/common/expandableDescription'
import Banner from '@/components/search/banner'
import Tag from '@/components/common/tag'

import TwitterIcon from '~@/icons/social/twitter.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import WebsiteIcon from '~@/icons/social/website.svg'

interface Props {
  children?: ReactNode
}

const PersonInfo: FC<Props> = ({}) => {

  const { account } = useWallet()
  const { address, memberInfoSet, memberInfo, ownerMemberInfo } = useDetails()
  const { switchNetworkAsync } = useSwitchNetwork()

  const [tgIDLoading, setTgIDLoading] = useState(true)
  const [telegramUserId, setTelegramUserId] = useState('')
  const [dialogOpenSet, setDialogOpenSet] = useState<Record<'profile' | 'renew' | 'burn' | 'telegram', boolean>>({
    profile: false,
    renew: false,
    burn: false,
    telegram: false
  })
  const isAddressOwner = (account || '').toLowerCase() === address.toLowerCase()/* && process.env.NEXT_PUBLIC_IS_TESTNET === 'true' */
  const personInfo = isAddressOwner ? ownerMemberInfo : memberInfo
  const tgConnectLink = `/address/${address}/connect`

  const memberPopoverMenus: PopoverMenuItem[] = []
  // account === address ? [
  //   // {
  //   //   id: 'profile',
  //   //   text: 'Setting'
  //   // },
  //   {
  //     id: 'renew',
  //     text: 'Renew',
  //     icon: <RenewIcon width={16} height={16} className='text-[#333]'/>
  //   },
  //   {
  //     id: 'burn',
  //     text: 'Burn',
  //     icon: <BurnIcon width={16} height={16} className='text-[#333]'/>
  //   },
  // ] : []
  if (isAddressOwner) {
    memberPopoverMenus.push({
      id: 'telegram',
      text: 'Bind telegram',
      link: `/address/${address}/integrate`,
      linkSelf: true,
      icon: <TelegramIcon width={16} height={16} className='text-[#333]'/>
    })
  }

  const socialLinks = useMemo(() => {
    const { tokenUri } = personInfo
    const { external_url } = tokenUri ?? {}
    const { twitter, telegram, discord } = tokenUri?.attr ?? {}

    const twitterLink = twitter ? `https://twitter.com/${twitter}` : ''
    const tgLink = telegram ? `https://t.me/${telegram}` : ''
    const discordLink = discord ? `https://discordapp.com/users/${discord}` : ''

    return [
      {
        type: 'twitter',
        icon: <TwitterIcon width='24' height='24' className='text-secondaryBlack' />,
        link: twitterLink
      },
      {
        type: 'telegram',
        icon: <TelegramIcon width='24' height='24' className='text-secondaryBlack' />,
        link: tgLink
      },
      {
        type: 'discord',
        icon: <DiscordIcon width='24' height='24' className='text-secondaryBlack' />,
        link: discordLink
      },
      {
        type: 'website',
        icon: <WebsiteIcon width='24' height='24' className='text-secondaryBlack' />,
        link: external_url
      },
    ].filter(item => !!item.link)
  }, [personInfo])

  const handleSelectMenu = async (menu: PopoverMenuItem) => {
    // if (shouldSwitchNetwork && menu.id !== 'telegram') {
    //   await switchNetworkAsync?.(communityInfo?._chaninId)
    // }
    // setDialogOpenSet(prev => ({ ...prev, [menu.id]: true }))
  }

  useEffect(() => {
    async function getTGUserID() {
      setTgIDLoading(true)
      const res = await getTelegramUser(account as string)
      if (res.data) {
        setTelegramUserId(res.data.userId)
      }
      setTgIDLoading(false)
    }

    if (account && isAddressOwner) {
      getTGUserID()
    }
  }, [isAddressOwner, account])

  return (
    <div className='w-full pb-[20px]'>
      <Banner banner={personInfo?.tokenUri?.brand_image} />
      <div className='dapp-container px-10'>
        <div className='w-full relative pt-[80px] sm:pt-[50px]'>
          <AvatarCard outline size={120} src={personInfo.tokenUri?.image} className='sm:hidden absolute top-[-60px] rounded-full left-1/2 ml-[-60px]' />
          <AvatarCard outline size={80} src={personInfo?.tokenUri?.image} className='pc:hidden absolute top-[-40px] rounded-full left-1/2 ml-[-40px]' />
          <div className="w-full flex flex-col items-center">
            <div className='w-full flex items-center justify-between'>
              <div className='flex-1 flex items-center gap-4 flex-col'>
                <h1 className='text-xl text-main-black'>
                  <PrimaryDID address={address} noLink/>
                </h1>
                {
                  telegramUserId ? (
                    <Link href={tgConnectLink} target='_self'>
                      <Tag text={`TG-UID: ${telegramUserId}`} tooltip='The user id you got from telegram bot.'/>
                    </Link>
                  ) : (!tgIDLoading && account && isAddressOwner) && (
                    <Link href={tgConnectLink} target='_self'>
                      <Tag theme='warning' text='Connect to Telegram' tooltip='Enhance your experience by connecting to Telegram.'/>
                    </Link>
                  )
                }
              </div>
              {/* {
                (memberInfoSet.isOwner || isAddressOwner) && (
                  <Popover
                    id={Number(ownerMemberInfo.node?.tokenId)}
                    menus={memberPopoverMenus}
                    // disabled={shouldSwitchNetwork}
                    handleSelect={handleSelectMenu}
                  >
                    <HoverIcon>
                      <MoreIcon width='24' height='24' className=''/>
                    </HoverIcon>
                  </Popover>
                )
              } */}
            </div>
            {
              memberInfoSet.isValid ? (
                <>
                  {
                    personInfo?.tokenUri?.description && (
                      <ExpandableDescription className='mt-[12px] text-searchdesc'>{ personInfo?.tokenUri?.description }</ExpandableDescription>
                    )
                  }
                </>
              ) : null
            }
          </div>
        </div>
      </div>
      <MemberProfileSettingDialog
        open={dialogOpenSet['profile']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, profile: false }))} />
      <MemberRenewDialog
        open={dialogOpenSet['renew']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, renew: false }))} />
      <MemberBurnDialog
        open={dialogOpenSet['burn']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, burn: false }))} />
      <MemberBindTelegram
        open={dialogOpenSet['telegram']}
        handleClose={() => setDialogOpenSet(prev => ({ ...prev, telegram: false }))} />
    </div>
  )
}

export default PersonInfo