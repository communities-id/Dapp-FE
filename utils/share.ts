import { isLink } from '@/utils/tools'

import { SearchModeType } from '@/types'

export const getMintedTwitterShareLink = (info: { mode: SearchModeType; community: string; member?: string; owner: string; avatar?: string }) => {
  const { mode, community, member, avatar } = info
  
  const keyword = member ? `${member}.${community}` : `.${community}`
  const origin = process.env.NODE_ENV === 'development' ? 'https://communities.id' : (typeof window !== 'undefined' && location.origin)
  const url = `${origin}/share/twitter?mode=${mode}&keywords=${keyword}&image=${avatar || 'https://ipfs.io/ipfs/QmSYEgebBb8PWfsJkdtYQJsXWDTvTAXwjNN5VPYteJZhrw/'}`
  const texts = member ? [
    `🚀 Just minted my <${keyword}> User DID on @CommunitiesID and joined the <.${community}> community! Excited to be a part of this growing ecosystem. #DID #${keyword} #CommunitiesID`,
    `Join in together:`
    // `[${host}/${mode}/${keyword}]`
  ] : [
    `🆔We've officially joined @CommunitieslD Ecosystem and successfully deployed <${keyword}> Brand DID. With DaaS protocol, our brand consensus will be inscribedon the entire blockchain. #DID #${community} #CommunitiesID`,
    `Join us in minting your exclusive user DIDs!`,
    //  `[${host}/${mode}/${keyword}]`,
  ]
  
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts.join('\n\n'))}&url=${encodeURIComponent(url)}`
}

export const getCommunityTwitterShareLink = (info: { name: string; owner: string }) => {
  const { name, owner } = info
  const texts = [
    `It's a community of ${name} on Communities.id!`,
    `It's owner is ${owner}`,
    `Visit it on https://www.communities.id/community/${name}.`
  ]
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts.join('\n'))}&hashtags=${name},Communities.id`
}

export const getNormalTwitterShareLink = (link: string) => {
  const text = `Check out this collection on OpenSea ${link} From @CommunitiesID`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export const formatDiscordLink = (link: string) => {
  return isLink(link) ? link : `https://discord.gg/${link}`
}

export const formatTelegramLink = (link: string) => {
  return isLink(link) ? link : `https://t.me/${link}`
}

export const formatTwitterLink = (link: string) => {
  return isLink(link) ? link : `https://twitter.com/${link}`
}