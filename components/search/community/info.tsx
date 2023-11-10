import { FC, ReactNode, useEffect, useMemo, useState, Fragment } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSwitchNetwork } from 'wagmi'
import { DEFAULT_AVATAR, MAIN_CHAIN_ID, SCAN_MAP, ZERO_ADDRESS } from '@/shared/constant'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { formatDate, formatPrice, formatConstantsPrice, parseImgSrc } from '@/shared/helper'
import useApi from '@/shared/useApi'
import { getOpenseaLink, getCommunityOpenseaLink } from '@/utils/tools'
import { calcCurrentMintPrice, parseToDurationPrice, parseNumericFormula } from '@/utils/formula'
import { getNormalTwitterShareLink, formatDiscordLink, formatTelegramLink, formatTwitterLink } from '@/utils/share'
import { updateCommunity } from '@/shared/apis'

import Collapse from '@/components/common/collapse'
import AvatarCard from '@/components/common/avatar'
import Popover, { PopoverMenuItem } from '@/components/common/popover'
import PrimaryDID from '@/components/common/primaryDID'
import CommunityRenewDialog from '@/components/dialog/community/renew'
import CommunitySignatureDialog from '@/components/dialog/community/signature'
import CommunityBindTelegram from '@/components/dialog/community/bindTelegram'
import ValidStatus from '@/components/common/status'
import ChainIcon from '@/components/common/chainIcon'
import ToolTip from '@/components/common/tooltip'
import Banner from '@/components/search/banner'
import HoverIcon from '@/components/common/hoverIcon'
import MintTip from '@/components/common/mintTip'
import DividerLine from '@/components/common/dividerLine'
import Tag from '@/components/common/tag'

import OpenseaIcon from '~@/icons/info/opensea.svg'
import TwitterIcon from '~@/icons/info/twitter.svg'
import WebsiteIcon from '~@/icons/info/website.svg'
import MoreIcon from '~@/icons/info/more.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import TipIcon from '~@/icons/tip.svg'
import ShareIcon from '~@/icons/share.svg'
import SettingIcon from '~@/icons/settings/setting.svg'
import MintSettingIcon from '~@/icons/settings/mint-setting.svg'
import RenewIcon from '~@/icons/settings/renew.svg'
import RefreshIcon from '~@/icons/settings/refresh.svg'
import SignatureIcon from '~@/icons/settings/signature.svg'
import LinkIcon from '~@/icons/link.svg'
import BackIcon from '~@/icons/back.svg'

import { State } from '@/types'
import { TotalSupportedChainIDs } from '@/types/chain'
import { SequenceMode } from '@/types/contract'
import { formatToDecimal } from '@/utils/format'

interface Props {
  children?: ReactNode
}

const CommunityLayout: FC<Props> = () => {
  const { message } = useRoot()
  const { keywords, community, communityInfo, communityInfoSet, loadingSet } = useDetails()
  const { showGlobalDialog } = useGlobalDialog()
  const { switchNetworkAsync } = useSwitchNetwork()
  
  const { erc20PriceToUSD } = useApi()

  const [dialogOpenSet, setDialogOpenSet] = useState<Record<string, boolean>>({})
  const [tvl, setTvl] = useState(0)
  const communityPopoverMenus: PopoverMenuItem[] = [
    {
      id: 'refresh',
      text: 'Refresh Metadata',
      icon: <RefreshIcon width={16} height={16} className='text-[#333]'/>,
      global: false
    },
    {
      id: 'profile',
      text: 'Community Settings',
      icon: <SettingIcon width={16} height={16} className='text-[#333]'/>,
      global: true
    },

    {
      id: 'mint',
      text: 'Mint Settings',
      icon: <MintSettingIcon width={16} height={16} className='text-[#333]'/>,
      global: true
    },
    {
      id: 'renew',
      text: 'Renew',
      icon: <RenewIcon width={16} height={16} className='text-[#333]'/>,
      global: false
    }
  ]

  // if (process.env.NEXT_PUBLIC_IS_TESTNET === 'true') {
  communityPopoverMenus.push({
    id: 'telegram',
    text: 'Bind telegram group',
    icon: <TelegramIcon width={16} height={16} className='text-[#333]'/>,
    global: false
  })
  // }
  
  if (communityInfo.config?.signatureMint && communityInfoSet.isSigner) {
    communityPopoverMenus.push({
      id: 'signature',
      text: 'Generate Invited Code',
      icon: <SignatureIcon width={16} height={16} className='text-[#333]'/>,
      global: false
    })
  }

  const shareMenus = useMemo(() => {
    if (typeof window === 'undefined') return []
    // const brandLink = `${location.origin}/community/${communityInfo.tokenUri?.name ?? ''}`
    // const brandLink = location.href
    const brandLink = `${location.origin}/community/${community}/mint`
    return [
      {
        id: 'copy-link',
        text: 'Copy Link',
        icon: <LinkIcon width={16} height={16} className='text-[#333]' />,
        clipboard: brandLink,
        handleCopied: () => {
          message({
            type: 'success',
            content: 'Copied Link Success!'
          }, { t: 'brand-share-link', k: brandLink })
        }
      },
      {
        id: 'twitter',
        text: 'Share on Twitter',
        icon: <TwitterIcon width={16} height={16} className='text-[#333]'/>,
        link: getNormalTwitterShareLink(brandLink)
      }
      // {
      //   id: 'renew',
      //   text: 'Renew',
      //   icon: <RenewIcon width={16} height={16} className='text-[#333]'/>,
      //   global: false
      // }
    ]
  }, [communityInfo])

  const socialLinks = useMemo(() => {
    if (!communityInfo || !communityInfo.chainId) return []
    const { chainId, tokenUri, node, totalSupply } = communityInfo
    const { external_url } = tokenUri ?? {}
    const { twitter, telegram, discord } = tokenUri?.attr ?? {}
    const { registry } = node ?? {}

    const twitterLink = twitter ? formatTwitterLink(twitter as string) : ''
    const tgLink = telegram ? formatTelegramLink(telegram as string) : ''
    const discordLink = discord ? formatDiscordLink(discord as string) : ''

    return [
      {
        type: 'chain',
        icon: <ChainIcon colorMode size={14} wrapperSize={24} chainId={Number(communityInfo._chaninId)} className='rounded-full' />,
        link: `${SCAN_MAP[communityInfo.chainId]}/address/${registry}`
      },
      Number(totalSupply) ? {
        type: 'opensea',
        icon: <OpenseaIcon width='24' height='24' />,
        link: getOpenseaLink(registry!, communityInfo._chaninId!)
      } : {
        type: 'opensea',
        icon: <OpenseaIcon width='24' height='24' />,
        link: getCommunityOpenseaLink(communityInfo.chainId, Number(communityInfo.node?.tokenId))
      },
      {
        type: 'twitter',
        icon: <TwitterIcon width='24' height='24' />,
        link: twitterLink
      },
      {
        type: 'telegram',
        icon: <TelegramIcon width='24' height='24' />,
        link: tgLink
      },
      {
        type: 'discord',
        icon: <DiscordIcon width='24' height='24' />,
        link: discordLink
      },
      {
        type: 'website',
        icon: <WebsiteIcon width='24' height='24' />,
        link: external_url
      },
    ].filter(item => !!item.link)
  }, [communityInfo])

  const { totalSupply, config, tokenUri, priceModel } = communityInfo

  const mintPrice = useMemo(() => {
    if (!priceModel) return '-'
    const input = {
      a_: priceModel.a ?? '0',
      b_: priceModel.b ?? '0',
      c_: priceModel.c ?? '0',
      d_: priceModel.d ?? '0',
    }
    const formulaParams = parseToDurationPrice(priceModel.mode, input, config?.durationUnit ?? 1)
    const params = {
      mode: priceModel.mode,
      ...formulaParams
    }
    const { price } = calcCurrentMintPrice(totalSupply ?? 0, params)
    return formatConstantsPrice(price)
  }, [totalSupply, priceModel, config])

  const mintPriceNumericFormula = useMemo(() => {
    if (!priceModel) return '-'
    const input = {
      a_: priceModel.a ?? '0',
      b_: priceModel.b ?? '0',
      c_: priceModel.c ?? '0',
      d_: priceModel.d ?? '0',
    }
    return parseNumericFormula(priceModel.mode, input, config?.durationUnit)
  }, [totalSupply, priceModel, config])

  // community setting outide
  const pendingCommunitySet = useMemo(() => {
    return (!tokenUri?.image || (tokenUri?.image === DEFAULT_AVATAR)) && !tokenUri?.brand_image && !tokenUri?.brand_color && communityInfoSet.isOwner
  }, [tokenUri, communityInfoSet.isOwner])

  // mint setting outside
  const pendingMintSet = useMemo(() => {
    return !config?.publicMint && !config?.signatureMint && !config?.holdingMint && communityInfoSet.isOwner
  }, [config, communityInfoSet.isOwner])

  const pendingSet = useMemo(() => {
    return Number(totalSupply) === 0
    && Number(priceModel?.a) === 0
    && Number(priceModel?.commissionRate) === 1000
    && config?.coin === ZERO_ADDRESS
    && pendingMintSet
  }, [totalSupply, priceModel, config, pendingMintSet])

  const pathname = usePathname()

  const backLink = pathname === `/community/${community}` ? undefined : `/community/${community}`
  const memberMintLink = pathname === `/community/${community}/mint` ? undefined : `/community/${community}/mint`

  const handleSelectMenu = async (menu: PopoverMenuItem) => {
    if (menu.id === 'refresh') {
      await updateCommunity(communityInfo.node?.node ?? '', true)
      location.reload()
      return
    }
    if (communityInfoSet.networkDiff) {
      await switchNetworkAsync?.(communityInfo?._chaninId)
    }
    if (menu.global) {
      showGlobalDialog(menu.id)
    }
    setDialogOpenSet(prev => ({ ...prev, [menu.id]: true }))
  }

  const handleSelectShareMenu = async (menu: PopoverMenuItem) => {
    if (menu.id === 'copy-link') {
      console.log('-- copy link')
    }
  }

  // to do: set in details
  useEffect(() => {
    if (!communityInfo?.pool) return
    async function getTVLInUSD() {
      const coin = await erc20PriceToUSD(communityInfo?.config?.coin ?? '', { chainId: (communityInfo?.chainId ?? MAIN_CHAIN_ID) as TotalSupportedChainIDs })
      if (!coin.price) {
        setTvl(0)
        return
      }
      const res = Number(communityInfo?.pool) * coin.price / Math.pow(10, coin.decimals)
      setTvl(res)
    }

    getTVLInUSD()
  }, [communityInfo])

  if (communityInfoSet.unMint) return (
    <Banner/>
  )

  return (
    <div className='relative w-full'>
      <Banner banner={communityInfo?.tokenUri?.brand_image} brandColor={communityInfo?.tokenUri?.brand_color}/>
      <div className='px-5 relative'>
        <div className='w-full pt-[40px]'>
          <AvatarCard outline size={100} src={communityInfo?.tokenUri?.image} className='absolute top-[-80px] left-5 rounded-[12px]'/>
          <div className="w-full flex flex-col">
            <div className='w-full flex items-center justify-between'>
              <h1 className='flex-1 flex items-center text-searchtitle text-secondaryBlack gap-2'>
                {
                  backLink ? (
                    <Link href={backLink} target="_self" className='flex items-center gap-2 hover:underline underline-offset-2'>
                      <BackIcon width="20" height="24" className="cursor-pointer"/>
                      <span>{ community }</span>
                    </Link>
                  ) : <span>{ community }</span>
                }
                <ValidStatus isExpired={communityInfoSet.isExpired} isRenewal={communityInfoSet.isRenewal}/>
                {
                  pendingSet && communityInfo.state === State.HOLD && (
                    <Tag text='Drafting' tooltip='User DID  minting disabled. Please enable in Mint Settings.'/>
                  )
                }
              </h1>
              <div className='flex items-center justify-end gap-2 text-secondaryBlack'>
                {
                  socialLinks.map(({ link, icon }, idx) => {
                    return (
                      <HoverIcon key={idx} link={link}>
                        { icon }
                      </HoverIcon>
                    )
                  })
                }
                <DividerLine mode='horizontal' />
                <Popover
                  title="Share"
                  className='w-[40px] h-[40px] rounded-full hover:bg-iconHoverBg'
                  id={`${keywords}-share`}
                  menus={shareMenus}
                  // disabled={communityInfoSet.networkDiff}
                  handleSelect={handleSelectShareMenu}
                >
                  <ShareIcon width='24' height='24' className='text-secondaryBlack'/>
                </Popover>
                {
                  (communityInfoSet.isOwner || communityInfoSet.isSigner) && !communityInfoSet.isExpired ? (
                    <Popover
                      title="Settings"
                      className='w-[40px] h-[40px] rounded-full hover:bg-iconHoverBg'
                      id={keywords}
                      menus={communityPopoverMenus}
                      // disabled={communityInfoSet.networkDiff}
                      handleSelect={handleSelectMenu}
                    >
                      <MoreIcon width='24' height='24' className='text-secondaryBlack'/>
                    </Popover>
                  ) : null
                }
                {
                  memberMintLink && (
                    <Link href={memberMintLink} target='_self' className='join-us-btn'>Join Community</Link>
                  )
                }
              </div>
            </div>
            {
              (pendingCommunitySet || pendingMintSet) && (
                <div className='mt-[14px] grid grid-cols-2 gap-3 text-statusTag'>
                  {
                    pendingMintSet && (
                      <MintTip text='Mint Settings' label='Customize Minting on demand:' onClick={() => {
                        handleSelectMenu(communityPopoverMenus.find(item => item.id === 'mint')!)
                      }} />
                    )
                  }
                  {
                    pendingCommunitySet && (
                      <MintTip text='Profile Settings' label='Set up your Brand Info:' onClick={() => {
                        handleSelectMenu(communityPopoverMenus.find(item => item.id === 'profile')!)
                      }} />
                    )
                  }
                </div>
              )
            }
            <Collapse className={
              classNames({
                'mt-5': !communityInfo?.tokenUri?.description,
                'mt-3': communityInfo?.tokenUri?.description
              })
            }>
              {
                communityInfo?.tokenUri?.description && (
                  <div className=''>
                    <p className='whitespace-pre-wrap'>
                      { communityInfo?.tokenUri?.description }
                    </p>
                  </div>
                )
              }
              <div className={
                classNames('flex flex-col', {
                  'mt-5': communityInfo?.tokenUri?.description
                })
              }>
                <div className='py-[6px] flex items-start gap-[50px] whitespace-nowrap'>
                  <div className='text-secondaryBlack'>
                    <p className='text-searchTagTitle'>Validity date</p>
                    <p className='text-searchTagContent text-secondaryBlack'>
                      { formatDate(communityInfo?.node?.createTime ?? 0) } - { formatDate(communityInfo?.node?.expireTime ?? 0) }
                    </p>
                  </div>
                  <div className='text-secondaryBlack'>
                    <div className='text-searchTagTitle flex horizontal items-center'>
                      <span className="mr-1">Commission Rate</span>
                      <ToolTip mode='sm' content={<p>{ Number(Number(communityInfo?.priceModel?.commissionRate ?? 0) / 100)}% of user DID minting fee goes to Brand DID Owner.</p>}>
                        <TipIcon width='14' height='14' className='text-mintPurple'/>
                      </ToolTip>
                    </div>
                    <p className='text-searchTagContent text-secondaryBlack'>{ Number(Number(communityInfo?.priceModel?.commissionRate ?? 0) / 100)}%</p>
                  </div>
                  <div className='text-secondaryBlack'>
                    <p className='text-searchTagTitle'>Owner</p>
                    <p className='text-searchTagContent'>
                      <PrimaryDID address={communityInfo?.owner ?? ''}/>
                    </p>
                  </div>
                </div>
                <DividerLine className='!bg-[#E7E7E7]' />
                <div className='py-[6px] flex items-start gap-[50px]'>
                  <div className='text-secondaryBlack'>
                    <div className='text-searchTagTitle flex horizontal items-center'>
                      <span className="mr-1">TVL</span>
                      <ToolTip mode='sm' content={<p><span className='text-mintPurple'>Total value locked:</span> Total value of tokens staked by community members, calculated in USDT.</p>}>
                        <TipIcon width='14' height='14' className='text-mintPurple'/>
                      </ToolTip>
                    </div>
                    <p className='text-searchTagContent'>
                      {tvl > 0 ? `${tvl.toFixed(2)} USDT` : `${formatPrice(communityInfo?.pool)} ${communityInfo?.coinSymbol}`}
                    </p>
                  </div>
                  <div className='text-secondaryBlack'>
                    <p className='text-searchTagTitle'>Mint Price</p>
                    {
                      mintPrice ? (
                        <p className='text-searchTagContent text-secondaryBlack'>{ mintPrice } { communityInfo?.coinSymbol } / year</p>
                      ) : (
                        <p className='text-searchTagContent text-secondaryBlack'>Free</p>
                      )
                    }
                  </div>
                  <div className='text-secondaryBlack'>
                    <div className='text-searchTagTitle flex horizontal items-center'>
                      <span className="mr-1">User Count</span>
                      {
                        !config?.publicMint && communityInfoSet.isOwner && <ToolTip className='!bottom-[-6px]' content={<p>No new members? Enable public mint in mint settings to make it public.</p>}>
                          <TipIcon width='14' height='14' className='text-mintPurple'/>
                        </ToolTip>
                      }
                    </div>
                    <p className='text-searchTagContent'>
                      { Number(communityInfo?.totalSupply) ?? 0 }
                    </p>
                  </div>
                </div>
                <DividerLine className='!bg-[#E7E7E7]' />
                <div className='py-[6px] flex items-start gap-[50px]'>
                  <div className='text-secondaryBlack'>
                    <div className='text-searchTagTitle flex horizontal items-center'>
                      <span className="mr-1">Burn Mode</span>
                      {/* <ToolTip mode='sm' content={<p><span className='text-mintPurple'>Total value locked:</span> Total value of tokens staked by community members, calculated in USDT.</p>}>
                        <TipIcon width='14' height='14' className='text-mintPurple'/>
                      </ToolTip> */}
                    </div>
                    <p className='text-searchTagContent text-secondaryBlack'>
                      { SequenceMode[communityInfo?.config?.sequenceMode ?? 0] }
                    </p>
                  </div>
                  <div className='text-secondaryBlack'>
                    <p className='text-searchTagTitle'>Burn Anytime</p>
                    <p className='text-searchTagContent text-secondaryBlack'>
                      { communityInfo.config?.burnAnytime ? 'Yes' : 'No' }
                    </p>
                  </div>
                  <div className='text-secondaryBlack'>
                    <div className='text-searchTagTitle flex horizontal items-center'>
                      <span className="mr-1">Formula of Mint Price</span>
                      {/* {
                        !config?.publicMint && communityInfoSet.isOwner && <ToolTip className='!bottom-[-6px]' content={<p>No new members? Enable public mint in mint settings to make it public.</p>}>
                          <TipIcon width='14' height='14' className='text-mintPurple'/>
                        </ToolTip>
                      } */}
                    </div>
                    <p className='text-searchTagContent text-secondaryBlack'>
                      Y = { mintPriceNumericFormula }
                    </p>
                  </div>
                </div>
              </div>
            </Collapse>
            <CommunityRenewDialog
              open={Boolean(dialogOpenSet['renew'])}
              handleClose={() => setDialogOpenSet(prev => ({ ...prev, renew: false }))} />
            <CommunitySignatureDialog
              open={Boolean(dialogOpenSet['signature'])}
              handleClose={() => setDialogOpenSet(prev => ({ ...prev, signature: false }))} />
            <CommunityBindTelegram
              open={Boolean(dialogOpenSet['telegram'])}
              handleClose={() => setDialogOpenSet(prev => ({ ...prev, telegram: false }))} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityLayout