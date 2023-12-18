import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';

import { ZERO_ADDRESS, MAIN_CHAIN_ID, BrandDID } from '@communitiesid/id';
import { BigNumber } from 'ethers';

import { useRoot } from '@/contexts/root';
import { CHAIN_ID, DEFAULT_TOKEN_SYMBOL } from '@/shared/constant';
import { isDotMember, toastError } from '@/shared/helper';
import { parseToDurationPrice, calcCurrentMintPrice } from '@/utils/formula';
import useApi, { getMintMemberPrice, searchCommunity } from '@/shared/useApi';
import { useGlobalDialog } from '@/contexts/globalDialog';
import { useSignUtils } from '@/hooks/sign';
import { useWallet } from '@/hooks/wallet';
import { useDIDContent } from '@/hooks/content';
import { updateCommunity } from '@/shared/apis';

import PriceModeChart from '@/components/common/priceModeChart'
import Input from '@/components/_common/input';
import EstimatedCard from '@/components/_common/estimatedCard';
import DividerLine from '@/components/common/dividerLine'
import ConnectButton from '@/components/_common/connectButton'

import RoundedLogo from '~@/logo-round.svg'
import { PriceMode } from '@/types/contract';
import { CommunityInfo } from '@/types';

interface Props {
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  invitationCode?: string
  classes: Record<string, string>
}

const MemberMint: FC<Props> = ({ brandName, brandInfo: inputBrandInfo, invitationCode = '', classes }) => {
  const { message, tracker, NetOps } = useRoot()
  const { handleMintSuccess } = useGlobalDialog()
  const { mintMember, approveErc20, burnMember } = useApi()
  const { verifyMemberTypedMessage } = useSignUtils()
  const { address: account } = useWallet()

  const [mintLoading, setMintLoading] = useState(false)
  const [form, setForm] = useState<Record<'memberName' | 'invitationCode' | 'mintTo', string>>({
    memberName: '',
    invitationCode,
    mintTo: '',
  })

  const { brandInfo, brandInfoLoading } = useDIDContent({ brandName, brandInfo: inputBrandInfo })

  const { node, totalSupply, config, tokenUri, priceModel } = brandInfo

  const brand = brandName || (node?.node || '')
  const member = form.memberName
  const chainId = brandInfo?._chaninId || CHAIN_ID
  const coinSymbol = brandInfo.coinSymbol ?? DEFAULT_TOKEN_SYMBOL[chainId]
  const brandColor = brandInfo?.tokenUri?.brand_color || '#8840FF'
  const owner = brandInfo.config?.signer
  
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
    if (communityMintType.publicMint || communityMintType.holdingMint) return true
    console.log('------ isMemberMintValid ------', member)
    if (!isDotMember(member) && !communityMintType.invitationMint) return true
    console.log('-- verify isMemberMintValid --', communityMintType)
    const { powerful, designated } = signatureMintValidator
    return powerful || designated
  }, [communityMintType.invitationMint, signatureMintValidator, form.invitationCode, member])

  const disabled = !member || !isMemberMintValid || brandInfoLoading

  const estimatedList = [
    {
      name: '1 year registration price',
      amount: mintPrice,
      symbol: coinSymbol,
    },
  ]

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
      const shouldApproveCoin = config && config.coin !== ZERO_ADDRESS
      if (shouldApproveCoin) {
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
      toastError(message, 'Failed to mint: ', e, { t: 'member-mint', i: 1 })
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

  useEffect(() => {
    if (!form.mintTo) {
      handleFormChange('mintTo', account || '')
    }
  }, [account])

  return (
    <div
      className={`h-full flex flex-col pt-4 ${classes.container}`}
      style={{ '--var-brand-color': brandColor } as CSSProperties}
    >
      <div className={`flex-1 overflow-auto flex flex-col ${classes.content}`}>
        <div className={`py-[66px] dapp-page text-center flex-itmc flex-col ${classes.formsContainer}`}>
          <h1 className={`font-Saira text-main-black text-[30px] leading-[47px] font-extrabold ${classes.title}`}>Join Community, set Your <span className='shadowed-text'><span>ID</span></span> here</h1>
          <div className={`forms mt-8 w-full px-15 ${classes.forms}`}>
            <div className="flex justify-between gap-5 sm:flex-col">
              { communityMintType.invitationMint &&  <div className="w-full h-12.5 bg-white border border-gray-7 rounded-md px-6 flex items-center gap-2">
                <span className="flex-shrink-0 min-w-[120px] text-main-black opacity-50">Invited Code:</span>
                <DividerLine mode="horizontal" />
                <input
                  type="text"
                  className="outline-none w-full placeholder-gray-5"
                  placeholder="0x..."
                  value={form.invitationCode}
                  onChange={e => handleFormChange('invitationCode', e.target.value)}
                />
              </div> }
              <div className="w-full h-12.5 bg-white border border-gray-7 rounded-md px-6 flex items-center gap-2">
                <span className="flex-shrink-0 min-w-[120px] text-main-black opacity-50">Mint to:</span>
                <DividerLine mode="horizontal" />
                <input
                  type="text"
                  className="outline-none w-full placeholder-gray-5"
                  placeholder='0x...'
                  value={form.mintTo}
                  onChange={e => handleFormChange('mintTo', e.target.value)}
                />
              </div>
            </div>
            <form className={`mt-7.5 w-full flex-center px-[46px] ${classes.nameForm}`} onSubmit={handleSubmit}>
              <div className='w-full bg-white rounded-full flex justify-between items-center border-xs var-brand-bordercolor border-[6px] overflow-hidden'>
                <div className='w-full flex px-3 py-3'>
                  <RoundedLogo width="58" height="58" className="flex-shrink-0" />
                  <Input
                    inputclassname="!py-3 !px-3 h-15 outline-none !border-none !text-lgx"
                    type="text"
                    placeholder='Search for a name'
                    value={form.memberName}
                    endAdornment={(
                      <div className='flex-itmc ml-3'>
                        <span className='var-brand-textcolor'>.{ brand }</span>
                      </div>
                    )}
                    onChange={(e) => handleFormChange('memberName', e.target.value.toLowerCase())}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <DividerLine wrapClassName='!m-0' />
        <div className={`px-15 py-10 ${classes.infoContainer}`}>
          <EstimatedCard list={estimatedList} className={classes.infoCard} />
          <div className={`mt-[10px] w-full bg-gray-6 rounded-xs px-7.5 py-5 ${classes.infoCard}`}>
            <div className="text-gray-1 text-md">Price Model:</div>
            <div className="mt-[10px] bg-white rounded-md">
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
      </div>
      <div className={`px-15 pt-[30px] pb-10 border-t-[1px] border-solid border-gray-7 ${classes.submit}`}>
        <ConnectButton
          wrapClassName={`w-full ${classes.submitButton}`}
          className='w-full var-brand-bgcolor'
          mode='full'
          theme='variable'
          loading={mintLoading || NetOps.loading}
          disabled={disabled}
          size='medium'
          onClick={handleSubmit}
        >Mint Now</ConnectButton>
      </div>
    </div>
  )
}

export default MemberMint