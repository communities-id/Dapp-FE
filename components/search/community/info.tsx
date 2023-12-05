import { FC, ReactNode, useEffect, useMemo, useState, Fragment, use, CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSwitchNetwork } from 'wagmi'
import { DEFAULT_AVATAR, MAIN_CHAIN_ID, SCAN_MAP, ZERO_ADDRESS } from '@/shared/constant'
import { useRoot, useRootConfig } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { formatDate, formatPrice, formatConstantsPrice, parseImgSrc, calcMintPrice } from '@/shared/helper'
import useApi from '@/shared/useApi'
import { getOpenseaLink, getCommunityOpenseaLink } from '@/utils/tools'
import { calcCurrentMintPrice, parseToDurationPrice, parseNumericFormula } from '@/utils/formula'
import { getNormalTwitterShareLink, formatDiscordLink, formatTelegramLink, formatTwitterLink } from '@/utils/share'
import { updateCommunity } from '@/shared/apis'
import themeColor from '@/_themes/colors'

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
import DividerLine from '@/components/common/dividerLine'

import OpenseaIcon from '~@/icons/info/opensea.svg'
import TwitterIcon from '~@/icons/info/twitter.svg'
import WebsiteIcon from '~@/icons/info/website.svg'
import MoreIcon from '~@/icons/info/more.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'
import TipIcon from '~@/icons/tip.svg'
import BurnIcon from '~@/icons/burn.svg'
import ShareIcon from '~@/icons/share.svg'
import RefreshIcon from '~@/icons/settings/refresh.svg'
import SignatureIcon from '~@/icons/settings/signature.svg'
import LinkIcon from '~@/icons/link.svg'
import BackIcon from '~@/icons/back.svg'
import DuplicateIcon from '~@/icons/duplicate.svg'

import { CommunityInfo, State } from '@/types'
import { TotalSupportedChainIDs } from '@/types/chain'
import ExpandableDescription from '@/components/common/expandableDescription'
import { BrandDID } from '@communitiesid/id'
import CommunityDuplicate from '@/components/dialog/community/duplicate'
import BrandInviteDialog from '@/components/_dialog/brand/invitation'
import styled from '@emotion/styled'
import { lighten } from '@mui/system'
import { SequenceMode } from '@/types/contract'
import { useDIDContent } from '@/hooks/content'
import PlusIconWithColor from '@/components/common/PlusWithColor'

interface Props {
  children?: ReactNode
}

const CommunityLayout: FC<Props> = () => {
  const { message } = useRoot()
  const { isMobile } = useRootConfig()
  const { keywords, community, communityInfo, communityInfoSet } = useDetails()
  const { showGlobalDialog } = useGlobalDialog()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { brandNotLoaded } = useDIDContent({ brandName: communityInfo.node?.node, brandInfo: communityInfo })

  const { erc20PriceToUSD } = useApi()

  const [dialogOpenSet, setDialogOpenSet] = useState<Record<string, boolean>>({})
  const [tvl, setTvl] = useState(0)
  const communityPopoverMenus: PopoverMenuItem[] = [
    {
      id: 'refresh',
      text: 'Refresh Metadata',
      icon: <RefreshIcon width={16} height={16} className='text-[#333]' />,
      global: false
    },
  ]

  // if ((communityInfoSet.isOwner || communityInfoSet.isSigner) && !communityInfoSet.isExpired) {
  //   communityPopoverMenus.push({
  //     id: 'profile',
  //     text: 'Community Settings',
  //     icon: <SettingIcon width={16} height={16} className='text-[#333]' />,
  //     global: true
  //   }, {
  //     id: 'mint',
  //     text: 'Mint Settings',
  //     icon: <MintSettingIcon width={16} height={16} className='text-[#333]' />,
  //     global: true
  //   }, {
  //     id: 'renew',
  //     text: 'Renew',
  //     icon: <RenewIcon width={16} height={16} className='text-[#333]' />,
  //     global: false
  //   }, {
  //     id: 'signature',
  //     text: 'Generate Invited Code',
  //     icon: <SignatureIcon width={16} height={16} className='text-[#333]' />,
  //     global: false
  //   })
  // }

  if (communityInfo.config?.signatureMint && communityInfoSet.isSigner) {
    communityPopoverMenus.push({
      id: 'signature',
      text: 'Generate Invited Code',
      icon: <SignatureIcon width={16} height={16} className='text-[#333]' />,
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
        icon: <TwitterIcon width={16} height={16} className='text-[#333]' />,
        link: getNormalTwitterShareLink(brandLink)
      }
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
        icon: <ChainIcon colorMode size={14} wrapperSize={24} chainId={Number(communityInfo._chaninId)} />,
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
    return calcMintPrice(communityInfo as BrandDID)
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
    return brandNotLoaded && communityInfoSet.isOwner
  }, [brandNotLoaded, communityInfoSet.isOwner])

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

  const toggleDialogHandler = (key: string | number, value?: boolean) => {
    setDialogOpenSet(prev => ({ ...prev, [key]: value ?? !prev[key] }))
  }

  const handleSelectMenu = async (menu: PopoverMenuItem) => {
    if (menu.id === 'refresh') {
      message({
        type: 'success',
        content: 'We\'ve queued this item for an update! Page will reload automaticaly after refresh completed'
      }, { t: 'brand-refresh-metadata' })
      await updateCommunity(communityInfo.node?.node ?? '', true)
      location.reload()
      return
    }
    if (communityInfoSet.networkDiff) {
      await switchNetworkAsync?.(communityInfo?._chaninId)
    }
    if (menu.global) {
      showGlobalDialog(String(menu.id))
    }
    toggleDialogHandler(menu.id, true)
  }

  const openGlobalDialog = (name: string) => {
    showGlobalDialog(name, { brandName: communityInfo.node?.node, brandInfo: communityInfo, options: {}, mobile: isMobile })
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

  useEffect(() => {
    if (!pendingMintSet || !communityInfoSet.isOwner || communityInfoSet.initialized) return
    openGlobalDialog('brand-not-loaded')
  }, [pendingMintSet, communityInfoSet.isOwner, communityInfoSet.initialized])

  if (communityInfoSet.unMint) return (
    <Banner />
  )

  const brandColor = communityInfo.tokenUri?.brand_color || themeColor.primary
  const BrandColorButton = styled('button')({
    backgroundColor: `transparent`,
    '&:hover': {
      backgroundColor: `${brandColor}33`
    }
  });

  const BrandColorButtonGroup = styled('div')({
    '.divide':{
      height: '100%',
      backgroundColor: brandColor,
    },
    button: {
      backgroundColor: brandColor,
      '&:hover': {
        backgroundColor: `${brandColor}cc`
      }
    }
  });

  const commisionRate = 100 - Number(Number(communityInfo?.priceModel?.commissionRate ?? 0) / 100)
  const refundModel = SequenceMode[communityInfo.config?.sequenceMode as SequenceMode]
  const formula = `Y = ${ mintPriceNumericFormula }`

  return (
    <div className='relative w-full'  style={{ '--var-brand-color': brandColor } as CSSProperties}>
      <Banner banner={communityInfo?.tokenUri?.brand_image} brandColor={communityInfo?.tokenUri?.brand_color} />
      <div className='dapp-container px-10 sm:px-4 pb-10 sm:pb-6 relative'>
        <div className='w-full pt-[80px] sm:pt-[35px]'>
          <AvatarCard outline size={120} src={communityInfo?.tokenUri?.image} className='sm:hidden absolute top-[-60px] left-10 sm:left-4 rounded-[30px]' />
          <AvatarCard outline size={80} src={communityInfo?.tokenUri?.image} className='pc:hidden absolute top-[-55px] left-4 rounded-[20px]' />
          <div className="community-info">
            <div className="brand-info flex-initial basis-0">
              <div className='flex justify-between items-center'>
                <div>
                  <div className="name text-xxl text-main-black flex items-center gap-2">
                    {
                      backLink ? (
                        <Link href={backLink} target="_self" className='flex items-center gap-2 hover:underline underline-offset-2'>
                          <BackIcon width="30" height="36" className="cursor-pointer"/>
                          <span>{communityInfo.node?.node}</span>
                        </Link>
                      ) : <span>{communityInfo.node?.node}</span>
                    }
                    <ValidStatus isExpired={communityInfoSet.isExpired} isRenewal={communityInfoSet.isRenewal}/>
                  </div>
                  <div className="owner text-main-black text-lg sm:text-sm">
                    <PrimaryDID address={communityInfo.owner || ''} />
                  </div>
                </div>
                <div className='pc:hidden flex'>
                  <Popover
                    title="Share"
                    className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg'
                    id={`${keywords}-share`}
                    menus={shareMenus}
                  >
                    <ShareIcon width='24' height='24' className='text-secondaryBlack' />
                  </Popover>
                  <Popover
                    title="Settings"
                    className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg'
                    id={keywords}
                    menus={communityPopoverMenus}
                    handleSelect={handleSelectMenu}
                  >
                    <MoreIcon width='24' height='24' className='text-secondaryBlack' />
                  </Popover>
                </div>
              </div>
              <div className="actions mt-6 sm:mt-3 flex items-center gap-[10px]">
                <BrandColorButtonGroup className="btn-group button-md px-0 w-auto text-white text-sm-b flex sm:hidden">
                  { communityInfoSet.isOwner && <>
                    <button className="min-w-[98px] px-5 h-full rounded-l-full" onClick={() => toggleDialogHandler('invite', true)}>Invite</button>
                    <div className='divide flex items-center'>
                      <DividerLine mode='horizontal' className='bg-white mx-0' wrapClassName='!h-4 !mx-0' />
                    </div>
                  </> }
                  <button className={`px-5 h-full flex items-center justify-center gap-1.5 ${communityInfoSet.isOwner ? 'rounded-r-full min-w-[98px]' : 'rounded-full min-w-[120px]'}`} onClick={() => {
                    openGlobalDialog('member-mint')
                  }}>
                    {!communityInfoSet.isOwner && <PlusIconWithColor color='#fff' className='w-4 h-4'/>}
                    <span>Join</span>
                  </button>
                </BrandColorButtonGroup>
                { communityInfoSet.isOwner && <BrandColorButton
                  className="button-md text-main-black border-2 border-main-black flex gap-3 sm:hidden text-sm-b"
                  onClick={() => {
                    openGlobalDialog('brand-manage-setting')
                  }}>
                  Manage
                </BrandColorButton> }
                {
                  socialLinks.map(({ type, link, icon }, idx) => {
                    return (
                      <>
                        <HoverIcon className="w-10 h-10" key={idx} link={link}>
                          {icon}
                        </HoverIcon>
                      </>
                    )
                  })
                }
                <DividerLine mode='horizontal' className='bg-main-black' wrapClassName='!h-4 sm:hidden' />
                <Popover
                  title="Share"
                  className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg sm:hidden'
                  id={`${keywords}-share`}
                  menus={shareMenus}
                >
                  <ShareIcon width='24' height='24' className='text-secondaryBlack' />
                </Popover>
                <Popover
                  title="Settings"
                  className='w-[40px] h-[40px] rounded-[10px] hover:bg-iconHoverBg sm:hidden'
                  id={keywords}
                  menus={communityPopoverMenus}
                  handleSelect={handleSelectMenu}
                >
                  <MoreIcon width='24' height='24' className='text-secondaryBlack' />
                </Popover>
              </div>
              <div className="desc mt-6 sm:mt-3 sm:text-sm">
                <ExpandableDescription>
                  <p className='text-md text-gray-1'>
                    {communityInfo.tokenUri?.description}
                  </p>
                </ExpandableDescription>
              </div>
            </div>
            <div className="mint-info">
              <table className={`mint-info-table ${pendingMintSet ? 'pending-set' : ''}`}>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <div className="flex justify-between items-center">
                        <div className='col'>
                          <p className='config-name'>Current Mint Price</p>
                          <p className='config-value'>{Number(mintPrice) ? `${mintPrice} ${communityInfo?.coinSymbol} / Year` : "Free"}</p>
                        </div>
                        { pendingMintSet ? (
                          <button
                            className='bg-orange-1 text-white text-xs rounded-[10px] h-8 px-2.5 flex items-center gap-[6px]'
                            onClick={() => {
                              openGlobalDialog('brand-manage-setting')
                            }}
                          >
                            <TipIcon width='14' height='14' className='text-white'/>
                            <span>Pending set</span>
                          </button>
                        ) : (
                          <button
                            className='bg-white text-main-black text-xs rounded-[10px] h-8 px-2.5 flex items-center gap-[6px]'
                            onClick={() => setDialogOpenSet(prev => ({ ...prev, duplicate: true }))}
                          >
                            <span>Duplicate</span>
                            <DuplicateIcon />
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='config-name'>
                        <span>Refund Rate</span>
                        <ToolTip mode='sm' content={<p>{ Number(Number(communityInfo?.priceModel?.commissionRate ?? 0) / 100)}% of user DID minting fee goes to Brand DID Owner.</p>}>
                          <TipIcon width='14' height='14' className='var-brand-textcolor'/>
                        </ToolTip>
                      </div>
                      <p className='config-value'>{ 100 - Number(Number(communityInfo?.priceModel?.commissionRate ?? 0) / 100)}%</p>
                    </td>
                    <td>
                      <div className='config-name'>
                        <span>TVL</span>
                        <ToolTip mode='sm' content={
                          <>
                            <p className='var-brand-textcolor'>Total value locked:</p>
                            <p>Total value of tokens staked by community members, calculated in USDT.</p>
                          </>
                        }>
                          <TipIcon width='14' height='14' className='var-brand-textcolor'/>
                        </ToolTip>
                      </div>
                      <p className='config-value'>{tvl > 0 ? `${tvl.toFixed(2)} USDT` : `${formatPrice(communityInfo?.pool)} ${communityInfo?.coinSymbol}`}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className='config-name'>Refund Model</p>
                      <div className='flex items-center gap-1 config-value'>
                        <span>{SequenceMode[communityInfo.config?.sequenceMode as SequenceMode]}</span>
                        { communityInfo.config?.burnAnytime && <ToolTip mode='sm' content={<p>Burn any time</p>}>
                          <BurnIcon width='16' height='16' className='text-red-1'/>
                        </ToolTip> }
                      </div>
                    </td>
                    <td>
                      <p className='config-name'>Mint Price Formula</p>
                      <p className='config-value'>Y = { mintPriceNumericFormula }</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="pc:hidden fixed bottom-0 pb-safe-offset-4 py-4 bg-white left-0 right-0 z-10 flex gap-2.5 justify-center border-t border-gray-7">
        { communityInfoSet.isOwner && <BrandColorButton
          className="button-md text-main-black border-2 border-main-black flex gap-3 text-sm-b"
          onClick={() => openGlobalDialog('mobile-manage-drawer')}>
          Manage
        </BrandColorButton> }
        <BrandColorButtonGroup className="btn-group button-md px-0 w-auto text-white text-sm-b flex">
          { communityInfoSet.isOwner && <>
            <button
              className="min-w-[98px] px-5 h-full rounded-l-full"
              onClick={() => openGlobalDialog('mobile-brand-invitation')}>Invite</button>
            <div className='divide flex items-center'>
              <DividerLine mode='horizontal' className='bg-white mx-0' wrapClassName='!h-4 !mx-0' />
            </div>
          </> }
          <button className={`px-5 h-full flex items-center justify-center gap-1.5 ${communityInfoSet.isOwner ? 'rounded-r-full min-w-[98px]' : 'rounded-full min-w-[120px]'}`} onClick={() => {
            openGlobalDialog('mobile-member-mint')
          }}>
            {!communityInfoSet.isOwner && <PlusIconWithColor color='#fff' className='w-4 h-4'/>}
            <span>Join</span>
          </button>
        </BrandColorButtonGroup>
      </div>
      <CommunityRenewDialog
        open={Boolean(dialogOpenSet['renew'])}
        handleClose={() => toggleDialogHandler('renew', false)} />
      <CommunitySignatureDialog
        open={Boolean(dialogOpenSet['signature'])}
        handleClose={() => toggleDialogHandler('signature', false)} />
      <CommunityBindTelegram
        open={Boolean(dialogOpenSet['telegram'])}
        handleClose={() => toggleDialogHandler('telegram', false)} />
      {/* <BrandManageDialog
        open={Boolean(dialogOpenSet['manage'])}
        handleClose={() => toggleDialogHandler('manage', false)} /> */}
      <CommunityDuplicate
        open={Boolean(dialogOpenSet['duplicate'])}
        communityInfo={communityInfo as CommunityInfo}
        commisionRate={commisionRate}
        refundModel={refundModel}
        formula={formula}
        handleClose={() => toggleDialogHandler('duplicate', false)} />
      <BrandInviteDialog
        brandName={communityInfo.node?.node}
        brandInfo={communityInfo}
        open={Boolean(dialogOpenSet['invite'])}
        handleClose={() => toggleDialogHandler('invite', false)} />
    </div>
  )
}

export default CommunityLayout