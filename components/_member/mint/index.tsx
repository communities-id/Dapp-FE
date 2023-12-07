import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { ZERO_ADDRESS, MAIN_CHAIN_ID, BrandDID } from '@communitiesid/id';
import { BigNumber } from 'ethers';
import { useSwitchNetwork } from 'wagmi';

import { useRoot } from '@/contexts/root';
import { useDetails } from '@/contexts/details';
import { CHAIN_ID, DEFAULT_TOKEN_SYMBOL } from '@/shared/constant';
import { formatContractError, isDotMember } from '@/shared/helper';
import { parseToDurationPrice, calcCurrentMintPrice } from '@/utils/formula';
import useApi, { getMintMemberPrice, searchCommunity } from '@/shared/useApi';
import { useGlobalDialog } from '@/contexts/globalDialog';
import { useSignUtils } from '@/hooks/sign';
import { useWallet } from '@/hooks/wallet';
import { useDIDContent } from '@/hooks/content';
import { updateCommunity } from '@/shared/apis';

import PriceModeChart from '@/components/common/priceModeChart'
import Button from '@/components/_common/button';
import Modal from '@/components/_common/modal';
import Input from '@/components/_common/input';
import EstimatedCard from '@/components/_common/estimatedCard';

import { PriceMode } from '@/types/contract';
import { CommunityInfo } from '@/types';

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
}

const MemberMint: FC<Props> = ({ brandName, brandInfo: inputBrandInfo }) => {
  const { message, tracker, NetOps } = useRoot()
  const { handleMintSuccess } = useGlobalDialog()
  const { mintMember, approveErc20, burnMember } = useApi()
  const { verifyMemberTypedMessage } = useSignUtils()
  const { address: account } = useWallet()

  const [protocolFee, setProtocoFee] = useState<BigNumber>(BigNumber.from(0))
  const [mintLoading, setMintLoading] = useState(false)
  const [form, setForm] = useState<Record<'memberName' | 'invitationCode' | 'mintTo', string>>({
    memberName: '',
    invitationCode: '',
    mintTo: '',
  })

  const { brandInfo, brandInfoLoading } = useDIDContent({ brandName, brandInfo: inputBrandInfo })

  const { node, owner, totalSupply, config, tokenUri, priceModel } = brandInfo

  const brand = brandName || (node?.node || '')
  const member = form.memberName
  const chainId = brandInfo?._chaninId || CHAIN_ID
  const coinSymbol = brandInfo.coinSymbol ?? DEFAULT_TOKEN_SYMBOL[chainId]
  const brandColor = brandInfo?.tokenUri?.brand_color || '#8840FF'
  
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
    const { priceWei } = calcCurrentMintPrice(totalSupply ?? 0, params)
    const { priceWei: nonezeroPriceWei } = calcCurrentMintPrice(100, params)
    return {
      priceWei,
      nonezeroPriceWei
    }
  }, [totalSupply, priceModel, config])

  const mintPrice = mintPriceData.priceWei
  console.log('- mintPrice', mintPrice)

  const isFreeMint = useMemo(() => {
    return mintPriceData.nonezeroPriceWei.eq(0)
  }, [mintPriceData])
  
  const priceChartParams = useMemo(() => {
    if (!priceModel || !config) return {
      mode: PriceMode.CONSTANT,
      commissionRate: 0,
      a: '0',
      b: '0',
      c: '0',
      d: '0',
    }
    const input = {
      a_: priceModel.a ?? '0',
      b_: priceModel.b ?? '0',
      c_: priceModel.c ?? '0',
      d_: priceModel.d ?? '0',
    }
    const formulaParams = parseToDurationPrice(priceModel.mode, input, config?.durationUnit ?? 1)
    return {
      mode: priceModel.mode as PriceMode,
      commissionRate: priceModel.commissionRate.toNumber(), 
      ...formulaParams
    }
  }, [priceModel, config])

  const shouldApproveCoin = useMemo(() => {
    if (!config) return false
    return config.coin !== ZERO_ADDRESS
  }, [config])

  const communityMintType = useMemo(() => {
    return {
      publicMint: config?.publicMint ?? false,
      invitationMint: config?.signatureMint ?? false,
      holdingMint: config?.holdingMint ?? false,
    }
  }, [config, member])

  const signatureMintValidator = useMemo(() => {
    if (!node || !owner) return { powerful: false, designated: false }
    if (!form.invitationCode) return { powerful: false, designated: false }
    console.log('- invitationCode', form.invitationCode, owner, member, form.mintTo || account!, node.registry, node.registryInterface, { chainId })
    return verifyMemberTypedMessage(form.invitationCode, owner, member, form.mintTo || account!, node.registry, node.registryInterface, { chainId })
  }, [communityMintType.invitationMint, form.invitationCode, form.mintTo, member, account, node, owner, chainId])

  const isMemberMintValid = useMemo(() => {
    // pass: public mint or holding mint and no signature
    // to do: verify holding mint
    console.log('------ isMemberMintValid ------', member)
    if (!isDotMember(member) && !communityMintType.invitationMint) return true
    console.log('-- verify isMemberMintValid --', communityMintType)
    const { powerful, designated } = signatureMintValidator
    return powerful || designated
  }, [communityMintType.invitationMint, signatureMintValidator, form.invitationCode, member])

  // signature mint mode and the owner is self account
  const isSignatureSelf = useMemo(() => {
    if (!account || signatureMintValidator.powerful) return false
    return signatureMintValidator.designated && (!form.mintTo || (form.mintTo.toLowerCase() === account.toLowerCase()))
  }, [signatureMintValidator, account, form.mintTo])

  const mintToPlaceholder = useMemo(() => {
    // powerful mode and isSignatureSelf mode use account as default mintTo (designated mode use member as default mintTo)
    if (signatureMintValidator.powerful || isSignatureSelf) return account
    return undefined
  }, [signatureMintValidator.powerful, isSignatureSelf, account])

  const disabled = !member || !isMemberMintValid || brandInfoLoading

  const actions = useMemo(() => {
    const list: {
      label: string
      value: string
      placeholder?: string
      name: string
    }[] = [
      {
        label: 'Mint to',
        value: form.mintTo,
        placeholder: mintToPlaceholder ?? '0x...',
        name: 'mintTo',
      }
    ]
    if (communityMintType.invitationMint) {
      list.unshift({
        label: 'Invitation Code',
        value: form.invitationCode,
        placeholder: 'Enter Invitation Code',
        name: 'invitationCode',
      })
    }
    return list
  }, [form.invitationCode, form.mintTo, mintToPlaceholder, communityMintType])

  const estimatedList = [
    {
      name: '1 year registration price',
      amount: mintPrice,
      symbol: coinSymbol,
    },
    {
      name: 'Estimated Fee',
      amount: protocolFee,
      symbol: coinSymbol,
    },
  ]

  // const shouldBurn = useMemo(() => {
  //   if (!memberInfo.state) {
  //     return false
  //   }
  //   return memberInfo.state === State.EXPIRED
  // }, [memberInfo.state])

  // const confirmExitWhenLoading = (e: any) => {
  //   if (mintLoading) {
  //     e.preventDefault()
  //     return e.returnValue = ''
  //   }
  // }

  async function getPrice() {
    if (!node?.registry || !chainId) {
      return {
        price: BigNumber.from(0),
        fee: BigNumber.from(0)
      }
    }
    
    try {
      const DIDName = `${member}.${brand}`
      const { price, protocolFee: fee } = await getMintMemberPrice(DIDName, brandInfo as BrandDID)
      // setPrice(price || 0)
      setProtocoFee(fee)
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

  const handleSubmit = async () => {
    if (!node || !account) return
    try {
      const network = await NetOps.handleSwitchNetwork(chainId)
      setMintLoading(true)
      const DIDName = `${member}.${brand}`
      const { price: _price, fee } = await getPrice()
      const price = mintPrice.gte(_price) ? mintPrice : _price
      // const chainId = communityInfo.chainId as number
      if (shouldApproveCoin && config) {
        await approveErc20?.(config.coin, node.registryInterface, { price, chainId: network })
      }
      // to do: burn?
      // if (shouldBurn) {
      //   await burnMember(communityInfo as BrandDID, DIDName)
      // }
      const { invitationCode, mintTo } = form
      const { powerful } = signatureMintValidator
      const finalPrice = shouldApproveCoin ? fee : price.add(fee)
      const _mintTo = mintTo || account // mintTo is empty, use account as default
      // signature mint
      if (invitationCode) {
        const __mintTo = powerful ? _mintTo : ZERO_ADDRESS // who does member belong to
        const __owner = powerful ? ZERO_ADDRESS : _mintTo // signature config owner
        await mintMember?.(brandInfo as BrandDID, DIDName, { price: finalPrice, signature: invitationCode, mintTo: __mintTo, owner: __owner, chainId: network })
      } else {
        // public mint or holding mint
        await mintMember?.(brandInfo as BrandDID, DIDName, { price: finalPrice, signature: invitationCode, mintTo: _mintTo, chainId: network })
      }
      tracker('success:member-mint', { brand, member, owner: _mintTo, price: finalPrice.toString() })
      await updateCommunity(node.node, true)
      handleMintSuccess?.({ community: brand, member, owner: _mintTo, avatar: brandInfo.tokenUri?.image }, 'member')
    } catch (e) {
      console.log('member min error', e)
      message({
        type: 'error',
        content: 'Failed to mint: ' + formatContractError(e),
      }, { t: 'member-mint', i: 1 })
    } finally {
      setMintLoading(false)
    }
  }

  const handleFormChange = (name: string, value: string) => {
    setForm?.({
      ...form,
      [name]: value,
    })
  }

  return (
    <div
      className='h-full flex flex-col pt-4'
      style={{ '--var-brand-color': brandColor } as CSSProperties}
    >
      <div className='flex-1 overflow-auto'>
        <div className="py-[70px] dapp-page text-center flex-itmc flex-col">
          <h1 className="title font-Saira">Join Community, set Your <span><span>ID</span></span> here</h1>
          <form
            className="mt-7.5"
            onSubmit={handleSubmit}
          >
            <div className='w-full bg-white max-w-[488px] rounded-full flex justify-between items-center border-xs border-primary border-[6px] overflow-hidden'>
              <div className='w-full'>
                <Input
                  inputclassname="!py-3 !px-8 h-15 outline-none !border-none text-lgx !leading-[34px]"
                  type="text"
                  placeholder='Search for a name'
                  value={form.memberName}
                  endAdornment={(
                    <div className='flex-itmc'>
                      <div className='mx-5 h-5 w-[1px] bg-main-black'></div>
                      <span className='var-brand-textcolor'>.{ brand }</span>
                    </div>
                  )}
                  onChange={(e) => handleFormChange('memberName', e.target.value.toLowerCase())}
                />
              </div>
            </div>
          </form>
        </div>
        <div className='px-15 py-10'>
          <ul className="pb-5 w-full flex flex-col gap-5">
            {
              actions.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      classNames(
                        'w-full gap-[10px] flex flex-col',
                      )
                    }
                  >
                    <p className="text-sm-b text-main-black">{ item.label }</p>
                    <div className='flex-1'>
                      <Input
                        inputclassname='w-full'
                        value={item.value}
                        placeholder={item.placeholder}
                        onChange={(e) => handleFormChange(item.name, e.target.value)}
                      />
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <EstimatedCard list={estimatedList}/>
          <div className='mt-[10px] w-full bg-white rounded-xs'>
            <PriceModeChart
              height={200}
              params={priceChartParams}
              markerSymbol={coinSymbol}
              currentLabel={(brandInfo.totalSupply ?? 0) + 1}
              colors={[brandColor]}
            />
          </div>
        </div>
      </div>
      <div className='px-15 pt-[30px] pb-10 border-t-[1px] border-solid border-gray-7'>
        <Button
          wrapClassName='w-full'
          className='w-full var-brand-bgcolor'
          mode='full'
          theme='variable'
          loading={mintLoading || NetOps.loading}
          disabled={disabled}
          size='medium'
          onClick={handleSubmit}
        >Mint Now</Button>
      </div>
    </div>
  )
}

export default MemberMint