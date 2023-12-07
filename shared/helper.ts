import { ethers, BigNumber, utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { ERROR_MAP } from './constant'

import { CHAIN_ID, CONTRACT_MAP, MAIN_CHAIN_ID, ZERO_ADDRESS } from "@/shared/constant"
import { formatToDecimal } from '@/utils/format'

import { SearchModeType } from '@/types'
import { BrandDID } from '@communitiesid/id'
import { calcCurrentMintPrice, parseToDurationPrice } from '@/utils/formula'

export function isAddress(str: string) {
  return /^0x[0-9A-F]{40}$/i.test(str)
}

export function isColor(str: string) {
  return /^#[0-9A-F]{6}$/i.test(str)
}

export function isDate(str: string) {
  const date = new Date(str)
  return !isNaN(date.getTime())
}

export function isValidLabel(name: string) {
  name = (name ?? '').toLocaleLowerCase()
  if (name.length === 0) {
    return false
  }
  if (name.length > 20) {
    return false
  }
  return /^[a-z0-9_]*$/.test(name)
}

export const isDotMember = (keywords: string) => {
  return keywords.split('.').filter(_ => isValidLabel(_)).length === 3
}

export function execSearch(key: string): {
  type: SearchModeType
  keywords: string
  community: string
  member: string
} {
  const keywords = (key || "").trim().toLowerCase()
  const keywordsArr = keywords.split('.')

  try {
    if (keywordsArr.length > 3 || keywords.match(/\.{2,}/)) {
      throw new Error('unknown keywords')
    }
   
    // 0xb4470231D4A60da63c4d17aa28d23154c22E9571
    if (isAddress(keywords)) {
      return {
        type: 'address',
        keywords,
        community: '',
        member: ''
      }
    }
  
    // .community
    if (keywords.startsWith('.') && keywordsArr.filter(_ => _).length === 1 && keywords.length > 1) {
      if (!isValidLabel(keywordsArr[1])) throw new Error('unknown keywords')
      return {
        type: 'community',
        keywords,
        community: keywordsArr[1],
        member: ''
      }
    }
  
    // community
    if (!keywords.includes('.')) {
      if (!isValidLabel(keywords)) throw new Error('unknown keywords')
      return {
        type: 'community',
        keywords: `.${keywords}`,
        community: keywords,
        member: ''
      }
    }
  
    // community.member
    if (keywords.includes('.') && keywordsArr.length >= 2) {
      for (const text of keywordsArr) {
        if (!isValidLabel(text)) throw new Error('unknown keywords')
      }
      
      return {
        type: 'member',
        keywords,
        community: keywordsArr[keywordsArr.length - 1],
        member: keywordsArr.slice(0, -1).join('.')
      }
    }
    
    throw new Error('unknown keywords')
  } catch (err) {
    return {
      type: 'unknown',
      keywords,
      community: '',
      member: ''
    }
  }
}

export function formatAddress(address: string) {
  if (!address) {
    return '-'
  }
  const _addr = address.toLowerCase()
  return `${_addr?.slice(0, 6)}...${_addr?.slice(-4)}`
}

export function formatTransaction(transactionHash: string) {
  if (!transactionHash) {
    return '-'
  }
  const hash = transactionHash.toLowerCase()
  return `${hash?.slice(0, 6)}...${hash?.slice(-4)}`
}

export function keccak256(value: string) {
  return utils.keccak256(utils.toUtf8Bytes(value));
}

export function formatContractError(err: any) {
  if (err.error && err.error.data) {
    const { originalError = {}, data, message } = err.error.data
    return ERROR_MAP[data as string] || ERROR_MAP[originalError.data as string] || message || originalError.message || err.error.message
  }
  if (err.data && err.data.message) {
    return err.data.message
  }
  if (err.error) {
    return err.error.message
  }
  if(err.reason || err.message) {
    return err.reason || err.message
  }
  const unknownErrorMap: any = {
    'missing provider': 'There is some problem with your network, please try again later.',
  }
  return unknownErrorMap[err.toString().toLowerCase()] || err.toString()
}

export function stringToUint8Array(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

export function parseImgSrc(src?: string) {
  if (!src) {
    return ''
  }
  if (src.startsWith('<svg')) {
    return "data:image/svg+xml;base64,"+btoa(src);
  }
  if (src.startsWith('ipfs://')) {
    const val = src.substring(7)
    return `https://ipfs.io/ipfs/${val}/`
  }
  return src
}

export function formatDate(_date: number | BigNumber, format = 'YYYY/MM/DD') {
  if (!_date) {
    return '-'
  }
  let date = new Date(Number(_date) * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return format.replace('YYYY', year.toString()).replace('MM', month.toString()).replace('DD', day.toString())
}

export function formatTime(_date: number | BigNumber) {
  if (!_date) {
    return '-'
  }
  let date = new Date(Number(_date) * 1000)
  const dateStr = formatDate(_date)
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${dateStr} ${hour}:${minute}:${second}`
}

export function formatPrice(price: BigNumber | number | string = '0', decimals: number = 4) {
  const etherPrice = formatEther(price.toString())
  return formatConstantsPrice(etherPrice, decimals)
}

export function formatConstantsPrice(price: number | string = '0', decimals: number = 4) {
  if (Number(price) === 0) {
    return '0'
  }
  if (Number(price) < 1e-3) {
    return '< 0.001'
  }
  return formatToDecimal(price, 0, decimals)
}

export function encodeString(str: string) {
  if (!str) return ''
  return str.trim().replace(/\n{1,}/g, '<br>').replace(/\"/g, '&quot;').replace(/\'/g, '&apos;').replace(/\\/g, '&backslash;')
}

export function escapeString(str: string) {
  return str.replace(/<br>/g, '\n').replace(/&quot;/g, '\"').replace(/&apos;/g, '\'').replace(/&backslash;/g, '\\')
}

export function parseTokenURI(tokenURI: string | object) {
  try {
    let tokenUri = tokenURI
    if (typeof tokenURI === 'string') {
      const base64String = tokenURI.split('base64,')[1] || ''
      const tokenUriStr = Buffer.from(base64String, 'base64').toString() || '{}'
      tokenUri = JSON.parse(tokenUriStr)
    }
    const res = tokenUri as any
    for (const key in res) {
      if (typeof res[key] === 'string') {
        res[key] = escapeString(res[key])
      }
    }
    const attributes = res.attributes || []
    res.attr = {}
    for(let i = 0; i < attributes.length; i++) {
      res.attr[attributes[i].trait_type] = attributes[i].value
    }
    return res
  } catch (e) {
    console.error('Failed to parse tokenUri:', e)
    return {
      attr: {}
    }
  } 
}

export function hexToBytes(hex: string) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function hex2a(hexx: number | string) {
  const hex = hexx.toString();
  let str = '';
  for (let i = 2; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export const getCommunitySignPayload = (node: string, owner: string, verifyingContract: string, config: { deadline?: number;  chainId?: number } = {}) => {
  // const { type, community } = execSearch(node)
  // const _node = type === 'unknown' ? node : community

  const domain = {
    name: "CommunityRegistryInterfaceMintCommitment",
    version: "1",
    chainId: config?.chainId || CHAIN_ID,
    verifyingContract: verifyingContract,
  }

  const types = {
    Commitment: [
      { name: "node", type: "string" },
      { name: "owner", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
  }

  const commitment = {
    node,
    owner: owner || ZERO_ADDRESS,
    deadline: config?.deadline || 999999999999,
  }

  return {
    domain,
    types,
    commitment,
  }
}

export const getCommunityOmninodeSignPayload = (node: string, owner: string, config: { deadline?: number;  chainId?: number } = {}) => {
  // const { type, community } = execSearch(node)
  // const _node = type === 'unknown' ? node : community
  console.log('getCommunityOmninodeSignPayload', node, owner, config, keccak256(node))

  const domain = {
    name: "RelayerCommunityRegistryInterfaceMintCommitment",
    version: "1",
    chainId: CHAIN_ID,
    verifyingContract: CONTRACT_MAP[CHAIN_ID].RelayerCommunityRegistryInterface,
  }

  const types = {
    Commitment: [
      { name: "chainId", type: "uint256" },
      { name: "nodehash", type: "bytes32" },
      { name: "owner", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
  }

  const commitment = {
    chainId: config?.chainId || CHAIN_ID,
    nodehash: keccak256(node),
    owner: owner || ZERO_ADDRESS,
    deadline: config?.deadline || 999999999999,
  }

  return {
    domain,
    types,
    commitment,
  }
}


export const getMemberSignPayload = (node: string, owner: string, registry: string, verifyingContract: string, config: { day?: number; deadline?: number;  chainId?: number } = {}) => {
  // const { type, member } = execSearch(node)
  // const _node = type === 'unknown' ? node : member

  const domain = {
    name: "MemberRegistryInterface",
    version: "1",
    chainId: config?.chainId || CHAIN_ID,
    verifyingContract: verifyingContract,
  }

  const types = {
    Commitment: [
      { name: "registry", type: "address" },
      { name: "node", type: "string" },
      { name: "owner", type: "address" },
      { name: "day", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  }

  const commitment = {
    registry,
    node,
    owner: owner || ZERO_ADDRESS,
    day: config?.day || 365,
    deadline: config?.deadline || 999999999999,
  }

  return {
    domain,
    types,
    commitment,
  }
}

export const calcMintPrice = (communityInfo: BrandDID) => {
  const { priceModel, totalSupply, config } = communityInfo
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
}