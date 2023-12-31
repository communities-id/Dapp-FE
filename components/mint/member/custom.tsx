import { FC, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { BigNumber } from 'ethers'
import { useSwitchNetwork } from 'wagmi'
import { BrandDID } from '@communitiesid/id'
import { DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'
import useApi, { getMintMemberPrice } from '@/shared/useApi'
import { formatPrice, isDotMember, toastError } from '@/shared/helper'
import { updateCommunity } from '@/shared/apis'
import { useDetails } from '@/contexts/details'
import { useGlobalDialog } from '@/contexts/globalDialog'
import { useRoot } from '@/contexts/root'
import { useSignUtils } from '@/hooks/sign'
import { useWallet } from '@/hooks/wallet'
import { calcCurrentMintPrice, parseToDurationPrice } from '@/utils/formula'
import { formatInputName } from '@/utils/format'

import NumberInput from '@/components/common/numberInput'
import ConnectButton from '@/components/common/connectButton'
import PriceModeChart from '@/components/common/priceModeChart'
import AdvancedMintSetting from '@/components/common/advanceMintSetting'
import ToolTip from '@/components/common/tooltip'
import Input from '@/components/common/input'
import Empty from '@/components/search/empty'

import TipIcon from '~@/icons/tip.svg'

import { State } from '@/types'
import { PriceMode } from '@/types/contract'

interface MemberCustomMintProps {
}

const MemberCustomMint: FC<MemberCustomMintProps> = () => {
  const router = useRouter()
  const { message, tracker } = useRoot()
  const { keywords, community, communityInfo, memberInfo, memberInfoSet, refreshInfo } = useDetails()
  const { handleMintSuccess } = useGlobalDialog()
  const { mintMember, approveErc20, burnMember } = useApi()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { verifyMemberTypedMessage } = useSignUtils()
  const { address: account } = useWallet()

  const [slippage, setSlippage] = useState(1)
  const [member, setMemberInput] = useState('')
  // const [mintPrice, setPrice] = useState<BigNumber>(BigNumber.from(0))
  // const [protocolFee, setProtocoFee] = useState<BigNumber>(BigNumber.from(0))
  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  const [advanceMintSetting, setAdvanceMintSetting] = useState<{ mintTo: string, signature: string }>({
    mintTo: '',
    signature: ''
  })
  const [isMounted, setIsMounted] = useState(false)
  const DIDName = `${member}.${community}`
  const { totalSupply, config, tokenUri, priceModel } = communityInfo
  
  const mintPriceData = useMemo(() => {
    if (!priceModel) return {
      priceWei: BigNumber.from(0),
      nonezeroPriceWei: BigNumber.from(0)
    }
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
    const { priceWei } = calcCurrentMintPrice(slippage ?? totalSupply ?? 0, params)
    const { priceWei: nonezeroPriceWei } = calcCurrentMintPrice(100, params)
    return {
      priceWei,
      nonezeroPriceWei
    }
  }, [totalSupply, priceModel, config, slippage])

  const mintPrice = mintPriceData.priceWei
  console.log('- mintPrice', mintPrice)

  const isFreeMint = useMemo(() => {
    return mintPriceData.nonezeroPriceWei.eq(0)
  }, [mintPriceData])

  const priceChartParams = useMemo(() => {
    if (!communityInfo.priceModel || !communityInfo?.config) return {
      mode: PriceMode.CONSTANT,
      commissionRate: 0,
      a: '0',
      b: '0',
      c: '0',
      d: '0',
    }
    const input = {
      a_: communityInfo.priceModel.a ?? '0',
      b_: communityInfo.priceModel.b ?? '0',
      c_: communityInfo.priceModel.c ?? '0',
      d_: communityInfo.priceModel.d ?? '0',
    }
    const formulaParams = parseToDurationPrice(communityInfo.priceModel.mode, input, communityInfo.config?.durationUnit ?? 1)
    return {
      mode: communityInfo.priceModel.mode as PriceMode,
      commissionRate: communityInfo.priceModel.commissionRate.toNumber(), 
      ...formulaParams
    }
  }, [communityInfo.priceModel, communityInfo?.config])

  const shouldApproveCoin = useMemo(() => {
    if (!communityInfo.config) return false
    return communityInfo.config.coin !== ZERO_ADDRESS
  }, [communityInfo.config])

  const shouldBurn = useMemo(() => {
    if (!memberInfo.state) {
      return false
    }
    return memberInfo.state === State.EXPIRED
  }, [memberInfo.state])

  const confirmExitWhenLoading = (e: any) => {
    if (mintLoading) {
      e.preventDefault()
      return e.returnValue = ''
    }
  }

  const coinSymbol = communityInfo.coinSymbol ?? DEFAULT_TOKEN_SYMBOL[communityInfo.chainId || MAIN_CHAIN_ID]

  const communityMintType = useMemo(() => {
    return {
      publicMint: communityInfo.config?.publicMint ?? false,
      invitedMint: communityInfo.config?.signatureMint ?? false,
      holdingMint: communityInfo.config?.holdingMint ?? false,
    }
  }, [communityInfo.config])

  const signatureMintValidator = useMemo(() => {
    if (!communityInfo || !communityInfo.node || !communityInfo.owner) return { powerful: false, designated: false }
    if (!advanceMintSetting.signature || !advanceMintSetting.signature) return { powerful: false, designated: false }
    return verifyMemberTypedMessage(advanceMintSetting.signature, communityInfo.owner, member, advanceMintSetting.mintTo || account!, communityInfo.node.registry, communityInfo.node.registryInterface, { chainId: communityInfo._chaninId })
  }, [communityMintType.invitedMint, advanceMintSetting.signature, advanceMintSetting.mintTo, account, communityInfo, member])

  const isMemberMintValid = useMemo(() => {
    // pass: public mint or holding mint and no signature
    // to do: verify holding mint
    if (member && !advanceMintSetting.signature && !isDotMember(member) && (communityMintType.publicMint || communityMintType.holdingMint)) return true
    console.log('-- verify isMemberMintValid --', communityMintType)
    const { powerful, designated } = signatureMintValidator
    return powerful || designated
  }, [communityMintType.invitedMint, signatureMintValidator, advanceMintSetting.signature, member])

  // signature mint mode and the owner is self account
  const isSignatureSelf = useMemo(() => {
    if (!account || signatureMintValidator.powerful) return false
    return signatureMintValidator.designated && (!advanceMintSetting.mintTo || (advanceMintSetting.mintTo.toLowerCase() === account.toLowerCase()))
  }, [signatureMintValidator, account, advanceMintSetting.mintTo])

  const mintToPlaceholder = useMemo(() => {
    // powerful mode and isSignatureSelf mode use account as default mintTo (designated mode use member as default mintTo)
    if (signatureMintValidator.powerful || isSignatureSelf) return account
    return undefined
  }, [signatureMintValidator.powerful, isSignatureSelf, account])

  const isMintDisabled = useMemo(() => {
    return !isMemberMintValid || !isMounted
  }, [isMemberMintValid, isMounted])

  const isCommunityOpenMint = useMemo(() => {
    return communityInfo.config?.publicMint || communityInfo.config?.signatureMint || communityInfo.config?.holdingMint
  }, [communityInfo])

  const mintTypes = useMemo(() => {
    return Object.keys(communityMintType).filter(key => communityMintType[key as keyof typeof communityMintType]).map(key => {
      if (key === 'publicMint') return {
        label: 'Public Mint',
        tip: 'Anyone can mint this member'
      }
      if (key === 'invitedMint') return {
        label: 'Invited Mint',
        tip: 'Only the designated address can mint this member'
      }
      if (key === 'holdingMint') return {
        label: 'Holding Mint',
        tip: 'Only holding these NFTs can mint this member'
      }
      return {
        label: '',
        tip: ''
      }
    }).filter(v => v.label)
  }, [communityMintType])

  const swichToCorrectChain = async () => {
    const chainId = communityInfo._chaninId as number
    if (memberInfoSet.networkDiff) {
      setSwitchNetworkLoading(true)
      try {
        await switchNetworkAsync?.(chainId)
      } catch (e) {
        setSwitchNetworkLoading(false)
        throw e
      }
      setSwitchNetworkLoading(true)
    }
    return chainId
  }

  const handleMint = async () => {
    if (!communityInfo.node || !account) return
    try {
      const chainId = await swichToCorrectChain()
      setMintLoading(true)
      const { node } = communityInfo
      const { price: _price, fee } = await getPrice()
      const price = mintPrice.gte(_price) ? mintPrice : _price
      // const chainId = communityInfo.chainId as number
      if (shouldApproveCoin && communityInfo.config) {
        await approveErc20?.(communityInfo.config.coin, communityInfo.node.registryInterface, { price, chainId })
      }
      // to do: burn?
      if (shouldBurn) {
        await burnMember(communityInfo as BrandDID, DIDName)
      }
      const { signature, mintTo } = advanceMintSetting
      const { powerful } = signatureMintValidator
      const finalPrice = shouldApproveCoin ? fee : price.add(fee)
      const _mintTo = mintTo || account // mintTo is empty, use account as default
      // signature mint
      if (signature) {
        const __mintTo = powerful ? _mintTo : ZERO_ADDRESS // who does member belong to
        const __owner = powerful ? ZERO_ADDRESS : _mintTo // signature config owner
        await mintMember?.(communityInfo as BrandDID, DIDName, { price: finalPrice, signature, mintTo: __mintTo, owner: __owner, chainId })
      } else {
        // public mint or holding mint
        await mintMember?.(communityInfo as BrandDID, DIDName, { price: finalPrice, signature, mintTo: _mintTo, chainId })
      }
      tracker('success:member-mint', { DIDName, mintTo: _mintTo, price: price.toString() })
      await updateCommunity(node.node, true)
      handleMintSuccess?.({ community, member, owner: _mintTo, avatar: communityInfo.tokenUri?.image }, 'member')
    } catch (e) {
      console.log('member min error', e)
      toastError(message, 'Failed to mint: ', e, { t: 'member-mint', k: DIDName, i: 1 })
    } finally {
      setMintLoading(false)
    }
  }

  async function getPrice() {
    if (!communityInfo.node?.registry || !communityInfo.chainId) {
      return {
        price: BigNumber.from(0),
        fee: BigNumber.from(0)
      }
    }
    
    try {
      const DIDName = `${member}.${community}`
      const { price, protocolFee: fee } = await getMintMemberPrice(DIDName, communityInfo as BrandDID)
      // setPrice(price || 0)
      // setProtocoFee(fee)
      return {
        price,
        fee
      }
    } catch (e) {
      console.log(e)
      return {
        price: BigNumber.from(0),
        fee: BigNumber.from(0)
      }
    }
  }

  // set mintTo to account when isSignatureSelf
  useEffect(() => {
    if (!account) return
    if (isSignatureSelf || !communityMintType.invitedMint) {
      setAdvanceMintSetting({
        ...advanceMintSetting,
        mintTo: account
      })
    }
  }, [isSignatureSelf, communityMintType.invitedMint, account])

  useEffect(() => {
    router.beforePopState(() => {
      if (mintLoading) {
        return window.confirm('Changes you made may not be saved.')
      }

      return true
    })
  }, [router, mintLoading])

  useEffect(() => {
    window.addEventListener("beforeunload", confirmExitWhenLoading)
    return () => {
      window.removeEventListener("beforeunload", confirmExitWhenLoading)
    };
  }, [mintLoading]);

  useEffect(() => {
    setIsMounted(false)
    if (!member) return
    // to do: calc with formula
    getPrice().then(() => {
      setIsMounted(true)
    })
  }, [member, communityInfo])

  if (!isCommunityOpenMint) return <Empty text='This Community is not open now.' />

  return (
    <div className="px-[60px] pt-[30px] pb-[40px] flex flex-col items-center bg-white rounded-[10px]">
      <div className='w-full'>
        <label className='flex items-center'>
          <span className="mr-1"><>{mintTypes.map(({ label, tip }, idx) => {
              return (
                <li key={idx} className='text-searchTagTitle flex horizontal items-center gap-1'>
                  <span className="mr-1">Mint name: { label }</span>
                  {
                    tip && (
                      <ToolTip className='!bottom-[-6px]' content={<p>{ tip }</p>}>
                        <TipIcon width='14' height='14' className='text-mintPurple'/>
                      </ToolTip>
                    )
                  }
                </li>
              )
            })
          }</></span>
        </label>
        <Input
          value={member}
          placeholder='member name'
          endAdornment={`.${community}`}
          inputclassname={'my-input-class'}
          onChange={(e) => {
            setMemberInput(formatInputName(e.target.value))
          }}
        />
      </div>
      <div className='mt-[24px] w-full'>
        <PriceModeChart
          name='member-mint-price-chart'
          height={200}
          params={priceChartParams}
          markerSymbol={coinSymbol}
          currentLabel={(communityInfo.totalSupply ?? 0) + 1}
        />
      </div>

      {/* signature mint form */}
      {
        <AdvancedMintSetting
          className='w-full'
          value={advanceMintSetting}
          hiddenSignature={!communityMintType.invitedMint}
          mintToPlaceholder={mintToPlaceholder}
          // disabledMintTo={signatureMintValidator.powerful}
          onChange={v => setAdvanceMintSetting(v)}
        />
      }

      {/* <DividerLine wrapClassName='my-[30px]'/> */}

      <div className='mt-[30px] w-full flex flex-col gap-[10px] px-[30px] py-[16px] text-mintTipDesc text-mainGray rounded-[6px] bg-tag'>
        <div className='flex items-center'>
          <p className='flex-1'>1 year registration price</p>
          <p>{formatPrice(mintPrice)} {coinSymbol}</p>
        </div>
      </div>

      <div className='mt-[30px] flex flex-col items-center gap-[10px] w-full'>
        <ConnectButton
          loading={mintLoading || switchNetworkLoading}
          size='auto'
          theme='purple'
          className='px-[34px] w-full'
          disabled={isMintDisabled}
          onClick={handleMint}>Mint Now</ConnectButton>
      </div>
      {
        !isFreeMint && (
          <div className='mt-[24px]'>
            <h3 className='mb-[16px] text-center'>Slippage Index</h3>
            <NumberInput
              min={0}
              max={100}
              value={slippage}
              onChange={(e, val) => setSlippage(Number(val))} />
          </div>
        )
      }
    </div>
  )
}

export default MemberCustomMint