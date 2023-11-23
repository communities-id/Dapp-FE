import { FC, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames';

import { ZERO_ADDRESS, MAIN_CHAIN_ID, BrandDID } from '@communitiesid/id';
import { BigNumber } from 'ethers';
import { useSwitchNetwork } from 'wagmi';

import { useRoot } from '@/contexts/root';
import { useDetails } from '@/contexts/details';
import { CHAIN_ID, DEFAULT_TOKEN_SYMBOL } from '@/shared/constant';
import { formatContractError, isDotMember } from '@/shared/helper';
import { parseToDurationPrice, calcCurrentMintPrice } from '@/utils/formula';
import useApi, { getMintMemberPrice } from '@/shared/useApi';
import { useGlobalDialog } from '@/contexts/globalDialog';
import { useSignUtils } from '@/hooks/sign';
import { useWallet } from '@/hooks/wallet';
import { updateCommunity } from '@/shared/apis';

import Button from '@/components/_common/button';
import Modal from '@/components/_common/modal';
import Input from '@/components/_common/input';
import EstimatedCard from '@/components/_common/estimatedCard';

import { PriceMode } from '@/types/contract';

import CloseIcon from '~@/_brand/close.svg'

interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberMint: FC<Props> = ({ open, handleClose }) => {
  const { message, tracker, NetOps } = useRoot()
  const { keywords, community, communityInfo, memberInfo, memberInfoSet, refreshInfo } = useDetails()
  const { handleMintSuccess } = useGlobalDialog()
  const { mintMember, approveErc20, burnMember } = useApi()
  const { switchNetworkAsync } = useSwitchNetwork()
  const { verifyMemberTypedMessage } = useSignUtils()
  const { address: account } = useWallet()

  const [form, setForm] = useState<Record<'memberName' | 'invitationCode' | 'mintTo', string>>({
    memberName: '',
    invitationCode: '',
    mintTo: '',
  })
  const [protocolFee, setProtocoFee] = useState<BigNumber>(BigNumber.from(0))
  const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

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

  const brand = communityInfo?.node?.node || ''
  const member = form.memberName
  const chainId = communityInfo?._chaninId || CHAIN_ID

  const coinSymbol = communityInfo.coinSymbol ?? DEFAULT_TOKEN_SYMBOL[communityInfo.chainId || CHAIN_ID]

  const communityMintType = useMemo(() => {
    return {
      publicMint: communityInfo.config?.publicMint ?? false,
      invitationMint: communityInfo.config?.signatureMint ?? false,
      holdingMint: communityInfo.config?.holdingMint ?? false,
    }
  }, [communityInfo.config, member])

  const signatureMintValidator = useMemo(() => {
    if (!communityInfo || !communityInfo.node || !communityInfo.owner) return { powerful: false, designated: false }
    if (!form.invitationCode) return { powerful: false, designated: false }
    console.log('- invitationCode', form.invitationCode, communityInfo.owner, member, form.mintTo || account!, communityInfo.node.registry, communityInfo.node.registryInterface, { chainId: communityInfo._chaninId })
    return verifyMemberTypedMessage(form.invitationCode, communityInfo.owner, member, form.mintTo || account!, communityInfo.node.registry, communityInfo.node.registryInterface, { chainId: communityInfo._chaninId })
  }, [communityMintType.invitationMint, form.invitationCode, form.mintTo, member, account, communityInfo])

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

  const disabled = !member || !isMemberMintValid

  const actions = [
    {
      label: 'Invitation Code',
      value: form.invitationCode,
      placeholder: 'Enter Invitation Code',
      name: 'invitationCode',
    },
    {
      label: 'Mint to',
      value: form.mintTo,
      placeholder: mintToPlaceholder ?? '0x...',
      name: 'mintTo',
    },
  ]

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
    if (!communityInfo.node || !account) return
    try {
      const network = await NetOps.handleSwitchNetwork(chainId)
      setMintLoading(true)
      const { node } = communityInfo
      const DIDName = `${member}.${community}`
      const { price: _price, fee } = await getPrice()
      const price = mintPrice.gte(_price) ? mintPrice : _price
      // const chainId = communityInfo.chainId as number
      if (shouldApproveCoin && communityInfo.config) {
        await approveErc20?.(communityInfo.config.coin, communityInfo.node.registryInterface, { price, chainId: network })
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
        await mintMember?.(communityInfo as BrandDID, DIDName, { price: finalPrice, signature: invitationCode, mintTo: __mintTo, owner: __owner, chainId: network })
      } else {
        // public mint or holding mint
        await mintMember?.(communityInfo as BrandDID, DIDName, { price: finalPrice, signature: invitationCode, mintTo: _mintTo, chainId: network })
      }
      tracker('success:member-mint', { community, member, owner: _mintTo, price: finalPrice.toString() })
      await updateCommunity(node.node, true)
      handleMintSuccess?.({ community, member, owner: _mintTo, avatar: communityInfo.tokenUri?.image }, 'member')
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
    setForm({
      ...form,
      [name]: value,
    })
  }

  // useEffect(() => {
  //   setIsMounted(false)
  //   getPrice().then(() => {
  //     setIsMounted(true)
  //   })
  // }, [communityInfo])
  
  return (
    <Modal
      open={open}
      wrapClassName="h-screen justify-end"
      containerClassName="h-full"
      enableBackdropClick
      onBackdropClick={handleClose}
      slideProps={{
        direction: 'X',
        offset: 800
      }}>
        <div className='relative flex flex-col pt-4 w-[90vw] h-full max-w-[800px] bg-white'>
          <div
            className='absolute left-5 top-8 z-icon p-2 bg-white border border-solid border-gray-7 cursor-pointer rounded-xs'
            onClick={handleClose}
          >
            <CloseIcon width='16' height='16' className='text-gray-1' />
          </div>
          <div className='flex-1 overflow-auto'>
            <div className="py-[70px] dapp-page text-center flex-itmc flex-col">
              <h1 className="title font-Saira">Join Community, set Your <span><span>ID</span></span> here</h1>
              <form
                className="mt-7.5 bg-white"
                onSubmit={handleSubmit}
              >
                <div className='w-full max-w-[488px] rounded-full flex justify-between items-center border-xs border-primary border-[6px] overflow-hidden'>
                  <div className='w-full'>
                    <Input
                      inputclassname="!py-3 !px-8 h-15 outline-none !border-none text-lgx !leading-[34px]"
                      type="text"
                      placeholder='Search for a name'
                      endAdornment={(
                        <div className='flex-itmc'>
                          <div className='mx-5 h-5 w-[1px] bg-main-black'></div>
                          <span className='text-primary'>.{ brand }</span>
                        </div>
                      )}
                      onChange={(e) => handleFormChange('memberName', e.target.value)}
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
            </div>
          </div>
          <div className='px-15 pt-[30px] pb-10 border-t-[1px] border-solid border-gray-7'>
            <Button
              className=''
              mode='full'
              theme='primary'
              loading={mintLoading || NetOps.loading}
              disabled={disabled}
              size='medium'
              onClick={handleSubmit}
            >Mint Now</Button>
          </div>
        </div>
    </Modal>
  )
}

export default MemberMint