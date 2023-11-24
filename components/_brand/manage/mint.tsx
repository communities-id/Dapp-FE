import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

import { MAIN_CHAIN_ID, ZERO_ADDRESS } from '@communitiesid/id'
import { CHAIN_ID, DEFAULT_AVATAR, DEFAULT_TOKEN_SYMBOL } from '@/shared/constant'
import { useDetails } from '@/contexts/details'

import { toBN } from '@/utils/format'
import { parseToDurationPrice, parseToUnitPrice, priceModeFormulaMap } from '@/utils/formula'
import { constantsRule, decimalsRule } from '@/utils/price'
import { updateCommunity } from '@/shared/apis'
import { formatContractError, isAddress } from '@/shared/helper'
import { useRoot } from '@/contexts/root'
import useApi from '@/shared/useApi'
import { getTokenSymbol } from '@/shared/contract'

import SettingNotice from '@/components/_common/settingNotice'
import PriceModeChart from '@/components/common/priceModeChart'
import InputNumber from '@/components/_common/inputNumber'
import BaseButton from '@/components/_common/baseButton'
import Button from '@/components/_common/button'
import Input from '@/components/_common/input'

import { CommunityMemberConfig, CommunityMintConfig, CommunityPrice, MintModeLabels, PriceMode, PriceModeLabels, SequenceMode } from '@/types/contract'

import ActiveIcon from '~@/_brand/active.svg'
import CheckedIcon from '~@/_brand/checked.svg'
import TipsIcon from '~@/_brand/tips.svg'
import RightIcon from '~@/_brand/right.svg'
import TriangleIcon from '~@/_brand/triangle.svg'
import ForwardsIcon from '~@/_brand/forwards.svg'
import MinusIcon from '~@/_brand/minus.svg'
import PlusIcon from '~@/_brand/plus.svg'
import EditIcon from '~@/_brand/edit.svg'
import { CommunityInfo } from '@/types'

export type FormItemTypes = 'memberConfig' | 'mint' | 'price' | 'baseUri'

export type MintCommunityMemberLabels = keyof CommunityMemberConfig

export type MintCommunityMintLabels = keyof CommunityMintConfig

export type PriceCommunityMintLabels = keyof CommunityPrice

export type MintSettingLabels = MintCommunityMemberLabels | MintCommunityMintLabels | PriceCommunityMintLabels

type FormProps<T = MintSettingLabels> = {
  type: 'text' | 'multiple' | 'textarea' | 'switch',
  name: T,
  label: string,
  tooltip?: string,
  placeholder: string,
  description?: string | ReactNode,
  unit: ReactNode,
  startAdornment?: ReactNode,
  endAdornment?: ReactNode,
  outsideAppend?: ReactNode,
  format?: RegExp
  startIcon?: JSX.Element,
  disabled?: boolean,
  gap?: boolean,
  hidden?: boolean,
  child?: boolean
  value: string | number | boolean | undefined
  range?: [number, number]
  primary?: boolean
  formType?: FormItemTypes
}

interface Props {
  brandInfo: Partial<CommunityInfo>
}

export default function BrandMannageMintSettings({ brandInfo }: Props) {
  const { message } = useRoot()
  const { updateVariableCommunityMintConfig, updateCommunityMintConfig } = useApi()

  const [tab, setTab] = useState(1)
  const [step, setStep] = useState(1)

  const [coinSymbol, setCoinSymbol] = useState('')
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})

  const { totalSupply, config, tokenUri, priceModel } = brandInfo

  const defaultForms: CommunityMemberConfig & CommunityMintConfig & CommunityPrice = useMemo(() => {
    const params = {
      a_: toBN(brandInfo?.priceModel?.a ?? '0'),
      b_: toBN(brandInfo?.priceModel?.b ?? '0'),
      c_: toBN(brandInfo?.priceModel?.c ?? '0'),
      d_: toBN(brandInfo?.priceModel?.d ?? '0'),
    }
    const { a, b, c, d } = parseToDurationPrice(brandInfo.priceModel?.mode, params, brandInfo?.config?.durationUnit ?? 1)
    return {
      publicMint: brandInfo?.config?.publicMint ?? false,
      signatureMint: brandInfo?.config?.signatureMint ?? false,
      holdingMint: brandInfo?.config?.holdingMint ?? false,
      // signer: (brandInfo?.config?.signer === ZERO_ADDRESS) ? account : (brandInfo?.config?.signer ?? ''), // if signer is not set, use current account
      signer: brandInfo?.config?.signer ?? ZERO_ADDRESS, // if signer is not set, use zero address
      proofOfHolding: brandInfo?.config?.proofOfHolding.join('\n') ?? '',
      // coin: (brandInfo?.config?.coin === ZERO_ADDRESS) ? '' : (brandInfo?.config?.coin ?? ''),
      coin: brandInfo?.config?.coin ?? ZERO_ADDRESS,
      sequenceMode: brandInfo?.config?.sequenceMode ?? SequenceMode.INPUT_VALUE,
      durationUnit: brandInfo?.config?.durationUnit ?? 365,
      reserveDuration: brandInfo.config?.reserveDuration ?? 7 * 24 * 3600,
      burnAnytime: brandInfo.config?.burnAnytime ?? true,
      mode: brandInfo?.priceModel?.mode ?? PriceMode.CONSTANT,
      a: a,
      b: b,
      c: c,
      d: d,
      commissionRate: (Number(brandInfo?.priceModel?.commissionRate) / 100) ?? 10,
    }
  }, [brandInfo])

  // is community profile settled
  // const profileSettled = useMemo(() => {
  //   return (!tokenUri?.image || (tokenUri?.image === DEFAULT_AVATAR)) && !tokenUri?.brand_image && !tokenUri?.brand_color && communityInfoSet.isOwner
  // }, [tokenUri, communityInfoSet.isOwner])

  // // is community mint setting outside
  // const pendingMintSet = useMemo(() => {
  //   return !config?.publicMint && !config?.signatureMint && !config?.holdingMint && communityInfoSet.isOwner
  // }, [config, communityInfoSet.isOwner])

  // const pendingSet = useMemo(() => {
  //   return Number(totalSupply) === 0
  //   && Number(priceModel?.a) === 0
  //   && Number(priceModel?.commissionRate) === 1000
  //   && config?.coin === ZERO_ADDRESS
  //   && pendingMintSet
  // }, [totalSupply, priceModel, config, pendingMintSet])

  const [memberConfigForm, setMemberConfigForm] = useState<CommunityMemberConfig>({
    reserveDuration: defaultForms.reserveDuration,
    burnAnytime: defaultForms.burnAnytime
  })

  const [mintForm, setMintForm] = useState<CommunityMintConfig>({
    publicMint: defaultForms.publicMint,
    signatureMint: defaultForms.signatureMint,
    holdingMint: defaultForms.holdingMint,
    signer: defaultForms.signer,
    proofOfHolding: defaultForms.proofOfHolding,
    coin: defaultForms.coin,
    sequenceMode: defaultForms.sequenceMode,
    durationUnit: defaultForms.durationUnit,
  })

  const [priceForm, setPriceForm] = useState<CommunityPrice>({
    mode: defaultForms.mode,
    a: defaultForms.a,
    b: defaultForms.b,
    c: defaultForms.c,
    d: defaultForms.d,
    commissionRate: defaultForms.commissionRate
  })

  const changed = useMemo(() => {
    return {
      memberConfig: needUpdateMemberConfig(),
      mintConfig: needUpdateMintConfig(),
      priceConfig: needUpdatePriceConfig()
    }
  }, [memberConfigForm, mintForm, priceForm, needUpdateMemberConfig, needUpdateMintConfig, needUpdatePriceConfig])

  const settled = useMemo(() => {
    return {
      mint: config?.publicMint || config?.signatureMint || config?.holdingMint,
    }
  }, [tokenUri, config, totalSupply, priceModel])

  const editLocked = useMemo(() => {
    return {
      price: Number(totalSupply) >= 0,
      burnAnyTime: Number(totalSupply) >= 0,
    }
  }, [totalSupply, priceModel, config, settled.mint])

  async function validateMemberConfigForm() {
    const rules: Record<MintCommunityMemberLabels, (value: string) => Promise<string | undefined>> = {
      reserveDuration: async (value) => {
        return undefined
      },
      burnAnytime: async (value) => {
        return undefined
      },
    }
    const results: Partial<Record<MintCommunityMemberLabels, string | undefined>> = {}

    const keys = Object.keys(rules) as MintCommunityMemberLabels[]
    for (const key of keys) {
      const result = await rules[key as MintCommunityMemberLabels]?.(String(memberConfigForm[key as MintCommunityMemberLabels]))
      if (result) {
        results[key] = result
      }
    }
    return results
  }

  async function validateMintForm() {
    const rules: Record<MintCommunityMintLabels, (value: string) => Promise<string | undefined>> = {
      publicMint: async (value) => {
        return undefined
      },
      signatureMint: async (value) => {
        return undefined
      },
      signer: async (value) => {
        if (value && !isAddress(value)) {
          return 'Please enter a valid address'
        }
      },
      holdingMint: async (value) => {
        return undefined
      },
      proofOfHolding: async (value) => {
        if (!value) {
          return
        }
        const addresses = value.split('\n')
        if (addresses.length > 0) {
          for (const address of addresses) {
            // to do: check if address is a valid erc721 address
            if (!isAddress(address)) {
              return `${address} is not a valid address`
            }
          }
        }
        if (addresses.length > 20) {
          return 'You can only set at most 20 proof of holdings'
        }
      },
      coin: async (value) => {
        if (value && !isAddress(value)) {
          return 'Please enter a valid address'
        }
        if (value && value !== ZERO_ADDRESS) {
          const symbol = await getTokenSymbol(value, brandInfo.chainId)
          if (!symbol) {
            return 'Please enter a valid ERC20 token address'
          }
        }
      },
      sequenceMode: async (value) => {
        return undefined
      },
      durationUnit: async (value) => {
        return undefined
      },
    }
    const results: Partial<Record<MintCommunityMintLabels, string | undefined>> = {}

    const keys = Object.keys(rules) as MintCommunityMintLabels[]
    for (const key of keys) {
      const result = await rules[key as MintCommunityMintLabels]?.(String(mintForm[key as MintCommunityMintLabels]))
      if (result) {
        results[key] = result
      }
    }
    return results
  }

  async function validatePriceForm() {
    const rules: Record<PriceCommunityMintLabels, (value: string) => Promise<string | undefined>> = {
      // price: async (value) => {
      //   const price = Number(value)
      //   if (price < 0) {
      //     return 'Please enter a value not less than 0'
      //   }
      // },
      mode: async (value) => {
        const price = Number(value)
        if (price < 0) {
          return 'Please choose price mode'
        }
      },
      a: async (value) => {
        const a = Number(value)
        if (a < 0) {
          return 'Please enter a value not less than 0'
        }
      },
      b: async (value) => {
        const b = Number(value)
        if (b < 0) {
          return 'Please enter a value not less than 0'
        }
      },
      c: async (value) => {
        const c = Number(value)
        if (c < 0) {
          return 'Please enter a value not less than 0'
        }
      },
      d: async (value) => {
        const d = Number(value)
        if (d < 0) {
          return 'Please enter a value not less than 0'
        }
      },
      commissionRate: async (value) => {
        const commision = Number(value)
        if (commision < 0 || commision > 100) {
          return 'Please enter a value between 0 and 100'
        }
      },
    }
    const results: Partial<Record<PriceCommunityMintLabels, string | undefined>> = {}

    const keys = Object.keys(rules) as PriceCommunityMintLabels[]
    for (const key of keys) {
      const result = await rules[key as PriceCommunityMintLabels]?.(String(priceForm[key as PriceCommunityMintLabels]))
      if (result) {
        results[key] = result
      }
    }
    return results
  }

  function needUpdateMemberConfig() {
    const isReserveDurationChanged = memberConfigForm.reserveDuration !== defaultForms.reserveDuration
    const isBurnAnytimeChanged = memberConfigForm.burnAnytime !== defaultForms.burnAnytime
    return isReserveDurationChanged || isBurnAnytimeChanged
  }

  function needUpdateMintConfig() {
    const isPublicMintChanged = mintForm.publicMint !== defaultForms.publicMint
    const isSignatureMintChange = mintForm.signatureMint !== defaultForms.signatureMint
    const isHoldingMintChanged = mintForm.holdingMint !== defaultForms.holdingMint
    const isSignerChanged = mintForm.signer !== defaultForms.signer
    const isProofOfHoldingChanged = mintForm.proofOfHolding !== defaultForms.proofOfHolding
    const isCoinChanged = mintForm.coin !== defaultForms.coin
    const isSequenceModeChanged = mintForm.sequenceMode !== defaultForms.sequenceMode
    return isPublicMintChanged || isSignatureMintChange || isHoldingMintChanged || isSignerChanged || isProofOfHoldingChanged || isCoinChanged || isSequenceModeChanged
  }

  function needUpdatePriceConfig() {
    const isPriceModeChanged = priceForm.mode !== defaultForms.mode
    const isPriceAChanged = priceForm.a !== defaultForms.a
    const isPriceBChanged = priceForm.b !== defaultForms.b
    const isPriceCChanged = priceForm.c !== defaultForms.c
    const isPriceDChanged = priceForm.d !== defaultForms.d
    const isCommissionRateChanged = priceForm.commissionRate !== defaultForms.commissionRate
    return [isPriceModeChanged, isPriceAChanged, isPriceBChanged, isPriceCChanged, isPriceDChanged, isCommissionRateChanged].find(v => v)
  }

  const handleUpdateFullMintSetting = async () => {
    if (!brandInfo?.node) return
    const mintValidateResult = await validateMintForm()
    if (Object.keys(mintValidateResult).length > 0) {
      setValidation(mintValidateResult)
      return
    }

    const priceValidateResult = await validatePriceForm()
    if (Object.keys(priceValidateResult).length > 0) {
      setValidation(priceValidateResult)
      return
    }

    try {
      setLoading(true)
      const chainId = brandInfo.chainId as number
      if (needUpdateMintConfig() || needUpdatePriceConfig() || needUpdateMemberConfig()) {
        const params = {
          a: Number(priceForm.a ?? 0),
          b: Number(priceForm.b ?? 0),
          c: Number(priceForm.c ?? 0),
          d: Number(priceForm.d ?? 0)
        }
        const { a_, b_, c_, d_ } = parseToUnitPrice(priceForm.mode, params, Number(mintForm.durationUnit))
        const mintConfig = {
          signatureMint: mintForm.signatureMint,
          publicMint: mintForm.publicMint,
          holdingMint: mintForm.holdingMint,
          proofOfHolding: ((mintForm.proofOfHolding?.toString()) || '').split('\n').filter(v => isAddress(v)).join('\n'),
          signer: mintForm.signer,
          coin: mintForm.coin || ZERO_ADDRESS,
          sequenceMode: mintForm.sequenceMode,
          durationUnit: mintForm.durationUnit,
          reserveDuration: memberConfigForm.reserveDuration,
          burnAnytime: memberConfigForm.burnAnytime,
        }
        const priceConfig = {
          commissionRate: Number(priceForm.commissionRate),
          // mode: 1,
          mode: priceForm.mode,
          a: a_,
          b: b_,
          c: c_,
          d: d_
        }
        console.log('-- update payload', mintConfig, priceConfig)
        if (!needUpdatePriceConfig()) {
          await updateVariableCommunityMintConfig(brandInfo.node.registry, brandInfo.node.registryInterface, mintConfig, { chainId })
        } else {
          await updateCommunityMintConfig(brandInfo.node.registry, brandInfo.node.registryInterface, {
            ...mintConfig,
            ...priceConfig
          }, { chainId })
        }
        await updateCommunity(brandInfo.node.node, true)
        message({ type: 'success', content: 'Update successfully!' }, { t: 'brand-mint-setting', k: brandInfo.node.node })
        location.reload()
      } else {
        message({ type: 'warning', content: 'Nothing to update.' }, { t: 'brand-mint-setting', k: brandInfo.node.node })
      }
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to update setting: ' + formatContractError(e),
      }, { t: 'brand-mint-setting', k: brandInfo.node.node })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    handleResetTab()
    setMemberConfigForm({
      reserveDuration: defaultForms.reserveDuration,
      burnAnytime: defaultForms.burnAnytime
    })
    setMintForm({
      publicMint: defaultForms.publicMint,
      signatureMint: defaultForms.signatureMint,
      holdingMint: defaultForms.holdingMint,
      signer: defaultForms.signer,
      proofOfHolding: defaultForms.proofOfHolding,
      coin: defaultForms.coin,
      sequenceMode: defaultForms.sequenceMode,
      durationUnit: defaultForms.durationUnit,
    })
    setPriceForm({
      // price: defaultForms.price,
      mode: defaultForms.mode,
      a: defaultForms.a,
      b: defaultForms.b,
      c: defaultForms.c,
      d: defaultForms.d,
      commissionRate: defaultForms.commissionRate
    })
    // setBaseUriForm({
    //   imageBaseURI: brandInfo?.config?.imageBaseURI ?? ''
    // })
  }

  const handleSaveOnChain = () => {
    console.log('memberConfigForm', memberConfigForm)
    console.log('mintForm', mintForm)
    console.log('priceForm', priceForm)
    handleUpdateFullMintSetting()
  }

  const handleResetTab = () => {
    if (settled.mint) {
      setStep(7)
      setTab(7)
    } else {
      setTab(1)
    }
  }

  const handleNextTab = () => {
    const next = tab + 1
    if (next > 6) return
    setTab(next)
    setStep(Math.max(step, next))
  }

  useEffect(() => {
    async function getCoinSymbol() {
      const symbol = await getTokenSymbol((mintForm.coin as string) || ZERO_ADDRESS, brandInfo.chainId)
      setCoinSymbol(symbol)
    }
    getCoinSymbol()
  }, [mintForm.coin])

  useEffect(() => {
    if (!brandInfo.tokenUri) return
    setValidation({})
    handleReset()
  }, [brandInfo, defaultForms])

  useEffect(() => {
    handleResetTab()
  }, [settled.mint])

  return (
    <div className="modal-content-container relative h-full flex flex-col">
      <div className='flex-1 modal-content overflow-auto'>
        <h1 className='text-main-black text-xl'>Mint Settings</h1>
        <div className='relative flex gap-10 mt-[30px]'>
          {
            step < 6 && (
              <div className='absolute left-[7px] w-0 h-full border border-dashed border-black-tr-10'></div>
            )
          }
          <ol className='relative z-normal pb-10 w-full flex flex-col'>
            <li className='relative pb-[42px]'>
              {
                step >= 2 && (
                  <div className='absolute left-[7px] w-[2px] h-full bg-primary'></div>
                )
              }
              <BrandMintMode
                className='relative z-normal'
                form={mintForm}
                defaultForms={defaultForms}
                active={step >= 1}
                checked={tab === 1}
                settled={settled.mint}
                handleChoose={() => setTab(1)}
                handleChange={(payload) => {
                  setMintForm({
                    ...mintForm,
                    ...payload
                  })
                }}
              />
            </li>
            <li className='relative pb-[42px]'>
              {
                step >= 3 && (
                  <div className='absolute left-[7px] w-[2px] h-full bg-primary'></div>
                )
              }
              <BrandMintToken
                className='relative z-normal'
                form={mintForm}
                defaultForms={defaultForms}
                active={step >= 2}
                checked={tab === 2}
                locked={editLocked.price}
                handleChoose={() => setTab(2)}
                handleChange={(payload) => {
                  setMintForm({
                    ...mintForm,
                    ...payload
                  })
                }}
              />
            </li>
            <li className='relative pb-[42px]'>
              {
                step >= 4 && (
                  <div className='absolute left-[7px] w-[2px] h-full bg-primary'></div>
                )
              }
              <BrandMintPrice
                className='relative z-normal'
                form={priceForm}
                defaultForms={defaultForms}
                active={step >= 3}
                checked={tab === 3}
                locked={editLocked.price}
                handleChoose={() => setTab(3)}
                handleChange={(payload) => {
                  setPriceForm({
                    ...priceForm,
                    ...payload
                  })
                }}
              />
            </li>
            <li className='relative pb-[42px]'>
              {
                step >= 5 && (
                  <div className='absolute left-[7px] w-[2px] h-full bg-primary'></div>
                )
              }
              <BrandMintPercentage
                className='relative z-normal'
                form={priceForm}
                defaultForms={defaultForms}
                active={step >= 4}
                checked={tab === 4}
                locked={editLocked.price}
                handleChoose={() => setTab(4)}
                handleChange={(payload) => {
                  setPriceForm({
                    ...priceForm,
                    ...payload
                  })
                }}
              />
            </li>
            <li className='relative pb-[42px]'>
              {
                step >= 6 && (
                  <div className='absolute left-[7px] w-[2px] h-full bg-primary'></div>
                )
              }
              <BrandBurnAnyTime
                className='relative z-normal'
                form={memberConfigForm}
                defaultForms={defaultForms}
                active={step >= 5}
                checked={tab === 5}
                locked={editLocked.price}
                handleChoose={() => setTab(5)}
                handleChange={(payload) => {
                  setMemberConfigForm({
                    ...memberConfigForm,
                    ...payload
                  })
                }}
              />
            </li>
            <li>
              <BrandEconomicModel
                className='relative z-normal'
                form={mintForm}
                defaultForms={defaultForms}
                active={step >= 6}
                checked={tab === 6}
                locked={editLocked.price}
                handleChoose={() => setTab(6)}
                handleChange={(payload) => {
                  setMintForm({
                    ...mintForm,
                    ...payload
                  })
                }}
              />
            </li>
          </ol>
        </div>
      </div>
      {
        (changed.memberConfig || changed.mintConfig || changed.priceConfig) && (
          <SettingNotice loading={loading} onReset={handleReset} onSaveOnChain={handleSaveOnChain} />
        )
      }
      {
        !settled.mint && (
          <div className='modal-bottom'>
            <div className='w-full h-[1px] bg-gray-6'></div>
            <div className='mt-5 flex justify-end'>
              {
                step < 6 && (
                  <Button
                    className='w-60 flex-center gap-1'
                    size='medium'
                    theme='primary'
                    onClick={handleNextTab}
                  >
                    <span>Next {tab}/6</span>
                    <ForwardsIcon width='16' height='16' className='text-white' />
                  </Button>
                )
              }
              {
                step >= 6 && (
                  <Button
                    className='w-60 flex-center gap-1'
                    size='medium'
                    theme='primary'
                    loading={loading}
                    onClick={handleSaveOnChain}
                  >
                    <span>Save On-Chain</span>
                  </Button>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

interface BrandMintTabProps<T = CommunityMintConfig> {
  form: T
  defaultForms?: T
  active?: boolean
  checked?: boolean
  chainId?: number
  coinSymbol?: string
  settled?: boolean
  locked?: boolean
  className?: string
  handleChoose?: () => void
  handleChange?: (payload: Partial<T>) => void
}

const BrandMintMode: FC<BrandMintTabProps<CommunityMintConfig>> = ({ active, checked, locked, form, className, handleChange, handleChoose }) => {

  const mintModes: {
    label: string
    name: MintCommunityMintLabels
    active: boolean
    triangle?: boolean
    forms: FormProps<MintCommunityMintLabels>[]
  }[] = [
    {
      label: MintModeLabels.SIGNATURE,
      active: Boolean(form.signatureMint),
      name: 'signatureMint',
      triangle: true,
      forms: [
        {
          type: 'text',
          name: 'signer',
          label: 'Signer',
          // tooltip: 'The wallet address that can generate signature',
          placeholder: '0x0...',
          unit: 'address',
          child: true,
          value: form.signer,
          startAdornment: (
            <div className='flex-itmc mr-5 gap-5'>
              <span>Signer</span>
              <div className='w-[1px] h-4 bg-gray-7'></div>
            </div>
          ),
          description: (
            <p className='text-sm text-black-tr-40 text-center'>
              <b>Note:</b>
              <span> Only the brand owner can invite users to join the community.</span>
            </p>
          )
        },
      ]
    },
    {
      label: MintModeLabels.PUBLIC,
      name: 'publicMint',
      active: Boolean(form.publicMint),
      forms: []
    },
    {
      label: MintModeLabels.HOLDING, 
      name: 'holdingMint',
      active: Boolean(form.holdingMint),
      triangle: true,
      forms: [
        {
          type: 'multiple',
          name: 'proofOfHolding',
          label: 'Proof of holding',
          placeholder: '0x...',
          unit: 'One address per line',
          hidden: !form.holdingMint,
          child: true,
          value: form.proofOfHolding,
          startAdornment: (
            <div className='flex-itmc mr-5 gap-5 whitespace-nowrap'>
              <span>Token Contract</span>
              <div className='w-[1px] h-4 bg-gray-7'></div>
            </div>
          ),
          description: (
            <p className='text-sm text-black-tr-40 text-center'>
              <b>Note:</b>
              <span> Only the brand owner can invite users to join the community.</span>
            </p>
          )
        },
      ]
    }
  ]

  const activeMintMode = mintModes.find(item => item.active)

  const title = '1、How would you like your community to mint their IDs？'
  // const description = 'Warning: You can only choose one token to accept.'
  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          activeTitle='There is your mint mode：'
          activeText={activeMintMode?.label}
          // description={description}
          active={active}
          checked={checked}
          onClick={handleChoose}
        />
        {
          checked && (
            <div className='mt-5'>
              <ul className='relative z-1 w-full flex-itmc gap-[6px]'>
                {
                  mintModes.map(({ name, label, active, triangle }, index) => {
                    return (
                      <li key={index} className='relative flex-1'>
                        <Fragment>
                          <BaseButton
                            size='normal'
                            className={
                              classNames('w-full flex-center gap-[6px]', {
                                'bg-white text-gray-1 border border-solid border-gray-7': !active,
                                'bg-primary text-white': active,
                                'rounded-l-[22px]': index === 0,
                                'rounded-r-[22px]': index === mintModes.length - 1,
                              })
                            }
                            onClick={() => {
                              handleChange?.({
                                ...form,
                                signatureMint: false,
                                publicMint: false,
                                holdingMint: false,
                                [name]: true
                              })
                            }}
                          >
                            {
                              active && <RightIcon width='16' height='16' />
                            }
                            <span>{ label }</span>
                          </BaseButton>
                          {
                            (triangle && active) && (
                              <TriangleIcon
                                width='27'
                                height='27'
                                className='abs-hc text-gray-6 bottom-[-35px]' />
                            )
                          }
                        </Fragment>
                      </li>
                    )
                  })
                }
              </ul>
              {
                !!activeMintMode?.forms?.length && (
                  <div className='relative z-normal mt-[22px] p-[30px] bg-gray-6 rounded-md'>
                    <ul>
                      {
                        activeMintMode.forms.map((item, index) => {
                          return (
                            <li key={index} className='flex flex-col gap-5'>
                              {
                                item.type === 'text' && (
                                  <Input
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(e) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: e.target.value
                                      })
                                    }}
                                  />
                                )
                              }
                              {
                                item.type === 'multiple' && (
                                  <TokenGatedInput
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(_value) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: _value
                                      })
                                    }}
                                  />
                                )
                              }
                              { item.description }
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

interface TokenGatedInputProps<T = string | number | boolean | undefined> {
  value: T
  placeholder?: string
  startAdornment?: ReactNode
  onChange?: (value: T) => void
}
const TokenGatedInput: FC<TokenGatedInputProps> = ({ value, placeholder, startAdornment, onChange }) => {
  return (
    <Fragment>
      <Input
        startAdornment={startAdornment}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value)
        }}
      />
    </Fragment>
  )
}


const BrandMintToken: FC<BrandMintTabProps<CommunityMintConfig>> = ({ active, checked, locked, chainId, form, className, handleChoose, handleChange }) => {

  const priceModelDisabled = false

  const tokenModes: {
    label: string
    name: MintCommunityMintLabels
    active: boolean
    disabled?: boolean
    triangle?: boolean
    value?: string
    forms: FormProps<MintCommunityMintLabels>[]
  }[] = [
    {
      label: DEFAULT_TOKEN_SYMBOL[chainId ?? CHAIN_ID],
      name: 'coin',
      active: form.coin === ZERO_ADDRESS,
      disabled: priceModelDisabled,
      value: ZERO_ADDRESS,
      forms: []
    },
    {
      label: 'Other',
      name: 'coin',
      active: form.coin !== ZERO_ADDRESS,
      disabled: priceModelDisabled,
      // 1. if defaultForms.coin === ZERO_ADDRESS ? '': defaultForms.coin || ''
      value: '',
      forms: [
        {
          type: 'text',
          name: 'coin',
          label: 'Token Contract of Minting Fee',
          // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
          placeholder: '0x0...',
          unit: 'address',
          disabled: priceModelDisabled,
          value: form.coin,
          child: true,
          startAdornment: (
            <div className='flex-itmc mr-5 gap-5 whitespace-nowrap'>
              <span>Token Contract</span>
              <div className='w-[1px] h-4 bg-gray-7'></div>
            </div>
          ),
          description: (
            <p className='text-sm text-black-tr-40 text-center'>
              <b>Note:</b>
              <span> Please enter the Token Contract address.</span>
            </p>
          )
        }
      ]
    }
  ]

  const activeTokenMode = tokenModes.find(item => item.active)

  const title = '2、Which token will you accept?'
  const description = 'Warning: You can only choose one token to accept.'

  const handleClick = () => {
    if (locked) return
    handleChoose?.()
  }

  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          description={description}
          activeTitle='There is your token：'
          activeText={activeTokenMode?.label}
          active={active}
          checked={checked}
          locked={locked}
          onClick={handleClick}
        />
        {
          checked && (
            <div className='mt-5'>
              <ul className='relative z-1 w-full flex-itmc gap-[6px]'>
                {
                  tokenModes.map(({ name, value, label, active, triangle }, index) => {
                    return (
                      <li key={index} className='relative flex-1'>
                        <Fragment>
                          <BaseButton
                            size='normal'
                            className={
                              classNames('w-full flex-center gap-[6px]', {
                                'bg-white text-gray-1 border border-solid border-gray-7': !active,
                                'bg-primary text-white': active,
                                'rounded-l-[22px]': index === 0,
                                'rounded-r-[22px]': index === tokenModes.length - 1,
                              })
                            }
                            onClick={() => {
                              handleChange?.({
                                ...form,
                                [name]: value
                              })
                            }}
                          >
                            {
                              active && <RightIcon width='16' height='16' />
                            }
                            <span>{ label }</span>
                          </BaseButton>
                        </Fragment>
                      </li>
                    )
                  })
                }
              </ul>
              {
                !!activeTokenMode?.forms?.length && (
                  <div className='relative z-normal mt-[22px] p-[30px] bg-gray-6 rounded-md'>
                    <ul>
                      {
                        activeTokenMode.forms.map((item, index) => {
                          return (
                            <li key={index} className='flex flex-col gap-5'>
                              {
                                item.type === 'text' && (
                                  <Input
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(e) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: e.target.value
                                      })
                                    }}
                                  />
                                )
                              }
                              {
                                item.type === 'multiple' && (
                                  <TokenGatedInput
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(_value) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: _value
                                      })
                                    }}
                                  />
                                )
                              }
                              { item.description }
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}


const BrandMintPrice: FC<BrandMintTabProps<CommunityPrice>> = ({ active, checked, locked, form, defaultForms, coinSymbol, className, handleChoose, handleChange }) => {
  const title = '3、What’s the mint price per year you expect from an ID?'
  const description = 'Warning: You can only choose one token to accept.'
  const priceModelDisabled = false

  const priceModes: {
    label: string
    name: PriceCommunityMintLabels
    active: boolean
    value: PriceMode
    values: PriceMode[]
    showTab: boolean
    disabled?: boolean
    triangle?: boolean
    tabs: {
      label: PriceModeLabels
      name: PriceCommunityMintLabels
      active: boolean
      disabled: boolean
      value: PriceMode
      type?: 'normal' | 'formula'
      defaultValues: Record<string, number>
      formula: string
      forms: FormProps<PriceCommunityMintLabels>[]
    }[]
  }[] = [
    {
      label: 'Constant',
      name: 'mode',
      active: form.mode === PriceMode.CONSTANT,
      value: PriceMode.CONSTANT,
      values: [PriceMode.CONSTANT],
      disabled: priceModelDisabled,
      triangle: true,
      showTab: false,
      tabs: [
        {
          label: PriceModeLabels.CONSTANT,
          name: 'mode',
          active: Number(form.mode) === PriceMode.CONSTANT,
          disabled: priceModelDisabled,
          value: PriceMode.CONSTANT,
          type: 'formula',
          defaultValues: {},
          formula: priceModeFormulaMap[PriceMode.CONSTANT],
          forms: [
            {
              type: 'text',
              name: 'a',
              label: 'Price A',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'a',
              disabled: priceModelDisabled,
              value: form.a,
              format: decimalsRule,
              primary: true,
              child: true
            }
          ],
        },
      ]
    },
    {
      label: 'Dynamic Rate',
      name: 'mode',
      active: [PriceMode.LINEAR, PriceMode.EXPONENTIAL, PriceMode.SQUARE].includes(form.mode),
      value: form.mode !== PriceMode.CONSTANT ? form.mode : PriceMode.LINEAR,
      values: [PriceMode.LINEAR, PriceMode.EXPONENTIAL, PriceMode.SQUARE],
      disabled: priceModelDisabled,
      triangle: true,
      showTab: true,
      tabs: [
        {
          label: PriceModeLabels.LINEAR,
          name: 'mode',
          active: Number(form.mode) === PriceMode.LINEAR,
          disabled: priceModelDisabled,
          value: PriceMode.LINEAR,
          type: 'formula',
          defaultValues: {
            b: 0.00015,
          },
          formula: priceModeFormulaMap[PriceMode.LINEAR],
          forms: [
            {
              type: 'text',
              name: 'a',
              label: 'Price A',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'a',
              disabled: priceModelDisabled,
              value: form.a,
              format: decimalsRule,
              primary: true,
              child: true
            },
            {
              type: 'text',
              name: 'b',
              label: 'Price B',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'b',
              disabled: priceModelDisabled,
              value: form.b,
              format: decimalsRule,
              child: true
            }
          ],
        },
        {
          label: PriceModeLabels.EXPONENTIAL,
          name: 'mode',
          active: Number(form.mode) === PriceMode.EXPONENTIAL,
          disabled: priceModelDisabled,
          value: PriceMode.EXPONENTIAL,
          type: 'formula',
          defaultValues: {
            b: 1,
            c: 1,
            d: 1000
          },
          formula: priceModeFormulaMap[PriceMode.EXPONENTIAL],
          forms: [
            {
              type: 'text',
              name: 'a',
              label: 'Price A',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'a',
              disabled: priceModelDisabled,
              value: form.a,
              format: decimalsRule,
              primary: true,
              child: true
            },
            {
              type: 'text',
              name: 'b',
              label: 'Price B',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'b',
              disabled: priceModelDisabled,
              value: form.b,
              format: decimalsRule,
              child: true
            },
            {
              type: 'text',
              name: 'c',
              label: 'Price C',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'c',
              disabled: priceModelDisabled,
              value: form.c,
              format: constantsRule,
              child: true
            },
            {
              type: 'text',
              name: 'd',
              label: 'Price D',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'd',
              disabled: priceModelDisabled,
              value: form.d,
              format: constantsRule,
              child: true
            }
          ],
        },
        {
          label: PriceModeLabels.SQUARE,
          name: 'mode',
          active: Number(form.mode) === PriceMode.SQUARE,
          disabled: priceModelDisabled,
          value: PriceMode.SQUARE,
          type: 'formula',
          defaultValues: {
            b: 0.001,
            c: 10000,
          },
          formula: priceModeFormulaMap[PriceMode.SQUARE],
          forms: [
            {
              type: 'text',
              name: 'a',
              label: 'Price A',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'a',
              disabled: priceModelDisabled,
              value: form.a,
              format: decimalsRule,
              primary: true,
              child: true
            },
            {
              type: 'text',
              name: 'b',
              label: 'Price B',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'b',
              disabled: priceModelDisabled,
              value: form.b,
              format: decimalsRule,
              child: true
            },
            {
              type: 'text',
              name: 'c',
              label: 'Price C',
              // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
              placeholder: '0',
              unit: 'c',
              disabled: priceModelDisabled,
              value: form.c,
              format: constantsRule,
              child: true
            }
          ],
        },
      ]
    }
  ]

  const activePriceMode = priceModes.find(item => item.active)
  const activePriceModeTab = activePriceMode?.tabs.find(item => item.active)

  const __formula = activePriceModeTab?.formula ?? ''
  const coefficients = __formula.match(/[abcd]+/g) || []
  const _formula = `_${__formula}_`
  const words = _formula.split(/[abcd]+/g)

  const chartParams = activePriceModeTab?.forms
      .map(item => ({ name: item.name, value: item.value }))
      .reduce((acc, cur) => {
        const name = cur.name as 'a' | 'b' | 'c' | 'd'
        acc[name] = String(cur.value || 0)
        return acc
      }, {} as { a: string; b: string; c: string; d: string })

  const getActivePriceMode = (mode: PriceMode) => {
    return priceModes.find(item => item.values.includes(mode))
  }

  const getActivePriceTab = (mode: PriceMode) => {
    const activePriceMode = getActivePriceMode(mode)
    return activePriceMode?.tabs.find(item => item.value === mode)
  }

  const handleChooseTab = (mode: PriceMode) => {
    const tab = getActivePriceTab(mode)
    if (!tab) return
    const { defaultValues } = tab
    console.log('- tab', tab.name, mode, 'defaultValues', defaultValues)
    // online mode data
    if (tab.value === defaultForms?.mode) {
      handleChange?.({
        ...form,
        [tab.name]: mode,
        b: String(defaultForms?.b || 0),
        c: String(defaultForms?.c || 0),
        d: String(defaultForms?.d || 0),
      })
      return
    }
    handleChange?.({
      ...form,
      [tab.name]: mode,
      b: String((defaultValues.b ?? defaultForms?.b) || 0),
      c: String((defaultValues.c ?? defaultForms?.c) || 0),
      d: String((defaultValues.d ?? defaultForms?.d) || 0),
    })
  }

  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          description={description}
          activeTitle='There is your price mode：'
          activeText={activePriceModeTab?.label}
          active={active}
          checked={checked}
          locked={locked}
          onClick={handleChoose}
        />
        {
          checked && (
            <div className='mt-5'>
              <ul className='relative z-1 w-full flex-itmc gap-[6px]'>
                {
                  priceModes.map(({ name, label, value, active, triangle }, index) => {
                    return (
                      <li key={index} className='relative flex-1'>
                        <Fragment>
                          <BaseButton
                            size='normal'
                            className={
                              classNames('w-full flex-center gap-[6px]', {
                                'bg-white text-gray-1 border border-solid border-gray-7': !active,
                                'bg-primary text-white': active,
                                'rounded-l-[22px]': index === 0,
                                'rounded-r-[22px]': index === priceModes.length - 1,
                              })
                            }
                            onClick={() => {
                              handleChooseTab(value)
                            }}
                          >
                            {
                              active && <RightIcon width='16' height='16' />
                            }
                            <span>{ label }</span>
                          </BaseButton>
                        </Fragment>
                      </li>
                    )
                  })
                }
              </ul>
              {
                !!activePriceMode?.tabs?.length && (
                  <div className='relative z-normal mt-[22px] p-[30px] bg-gray-6 rounded-md'>
                    {
                      activePriceMode.showTab && (
                        <Fragment>
                          <ul className='flex-itmc gap-[10px]'>
                            {
                              activePriceMode.tabs.map((item, index) => {
                                return (
                                  <li key={index} className='flex-1'>
                                    <BaseButton
                                      size='medium'
                                      className={
                                        classNames('w-full flex-center gap-[6px] rounded-xs', {
                                          'bg-white text-gray-1 border border-solid border-gray-7': !item.active,
                                          'bg-primary text-white': item.active,
                                        })
                                      }
                                      onClick={() => {
                                        handleChooseTab(item.value)
                                      }}
                                    >
                                      {
                                        item.active && <RightIcon width='16' height='16' />
                                      }
                                      <span>{ item.label }</span>
                                    </BaseButton>
                                  </li>
                                )
                              })
                            }
                          </ul>
                          <div className='my-5 w-full h-[1px] bg-gray-3'></div>
                        </Fragment>
                      )
                    }
                    {
                      activePriceModeTab && (
                        <Fragment>
                          <div className='flex-itmc gap-[6px] text-md-b text-main-black whitespace-nowrap'>
                            <span>Price Formula: </span>
                            <div className='ml-[6px]'>Price = </div>
                            {
                              words.map((word, idx) => {
                                const unitItem = activePriceModeTab.forms.find(item => item.name === coefficients[idx])
                                return (
                                  <Fragment key={idx}>
                                    <span>{ word.replace('_', '') }</span>
                                    {
                                      unitItem && (
                                        <Input
                                          className='!px-3 !py-1 !inline-block min-w-[35px] max-w-[100px] w-auto border-s1 bg-white'
                                          value={unitItem.value}
                                          onChange={(e) => {
                                            const _value = e.target.value
                                            if (_value && unitItem.format) {
                                              unitItem.format.test(e.target.value) && handleChange?.({
                                                ...form,
                                                [unitItem.name]: _value
                                              })
                                              return
                                            }
                                            if (_value && unitItem.range) {
                                              const num = Number(_value)
                                              if (num >= unitItem.range[0] && num <= unitItem.range[1]) {
                                                handleChange?.({
                                                  ...form,
                                                  [unitItem.name]: _value
                                                })
                                              }
                                              return
                                            }
                                            handleChange?.({
                                              ...form,
                                              [unitItem.name]: _value
                                            })
                                          }}
                                        />
                                      )
                                    }
                                  </Fragment>
                                )
                              })
                            }
                          </div>
                          <div className='mt-5 w-full h-[230px] bg-white rounded-xs'>
                            <PriceModeChart
                              params={{
                                mode: form.mode,
                                commissionRate: Number(form.commissionRate),
                                ...chartParams!
                              }}
                              markerSymbol={coinSymbol}
                              hiddenMarkers
                            />
                          </div>
                        </Fragment>
                      )
                    }
                    {/* <ul>
                      {
                        activeTokenMode.forms.map((item, index) => {
                          return (
                            <li key={index} className='flex flex-col gap-5'>
                              {
                                item.type === 'text' && (
                                  <Input
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(e) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: e.target.value
                                      })
                                    }}
                                  />
                                )
                              }
                              {
                                item.type === 'multiple' && (
                                  <TokenGatedInput
                                    value={item.value}
                                    startAdornment={item.startAdornment}
                                    placeholder={item.placeholder}
                                    onChange={(_value) => {
                                      handleChange?.({
                                        ...form,
                                        [item.name]: _value
                                      })
                                    }}
                                  />
                                )
                              }
                              { item.description }
                            </li>
                          )
                        })
                      }
                    </ul> */}
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

const BrandMintPercentage: FC<BrandMintTabProps<CommunityPrice>> = ({ active, checked, locked, form, className, handleChoose, handleChange }) => {
  const title = '4、How much royalty fee do you plan to charge in percentage？'
  const description = 'Warning: You can only choose one token to accept.'

  const contentDescription = (
    <p className='mt-5 text-sm text-black-tr-40 text-left'>
      <b>Note:</b>
      <span> Royalty fee is your earning, while (1 - royalty rate) will be locked in token locker for users to get refund.</span>
    </p>
  )

  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          description={description}
          activeTitle='There is your royalty fee：'
          activeText={`${form.commissionRate}%`}
          active={active}
          checked={checked}
          locked={locked}
          onClick={handleChoose}
        />
        {
          checked && (
            <div className='relative mt-5 p-[30px] bg-gray-6 rounded-md'>
              <InputNumber
                value={form.commissionRate}
                range={[0, 100]}
                handleChange={(val) => {
                  handleChange?.({ commissionRate: val })
                }}
              >
                <div className='flex-center'>
                  <span>{ form.commissionRate }</span>
                  <span> %</span>
                </div>
              </InputNumber>
              { contentDescription }
            </div>
          )
        }
      </div>
    </div>
  )
}

const BrandBurnAnyTime: FC<BrandMintTabProps<CommunityMemberConfig>> = ({ active, checked, locked, form, className, handleChoose, handleChange }) => {
  const title = '5、Are you allowed your members to get refund (Burn IDs) at anytime？'
  const description = 'Warning: You can only choose one token to accept.'
  const contentDescription = (
    <p className='text-sm text-black-tr-40 text-left'>
      <b>Note:</b>
      <span> By burning IDs, users will get part or all their locked token; If users choose to renew your IDs, you will earn the locked token.</span>
    </p>
  )

  const burnAnytimeDisabled = false

  const burnTabs: {
    label: string
    name: MintCommunityMemberLabels
    active: boolean
    value: boolean
    disabled?: boolean
  }[] = [
    {
      label: 'Yes',
      name: 'burnAnytime',
      active: form.burnAnytime,
      disabled: burnAnytimeDisabled,
      value: true,
    },
    {
      label: 'No, burn after expiration',
      name: 'burnAnytime',
      active: !form.burnAnytime,
      disabled: burnAnytimeDisabled,
      value: false,
    }
  ]

  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          description={description}
          activeTitle='There is your burn mode：'
          activeText={form.burnAnytime ? 'BurnAnytime' : 'Burn after expiration'}
          active={active}
          checked={checked}
          locked={locked}
          onClick={handleChoose}
        />
        {
          checked && (
            <Fragment>
              <ul className='mt-5 relative z-1 w-full flex-itmc gap-[6px]'>
                {
                  burnTabs.map(({ name, value, label, active }, index) => {
                    return (
                      <li key={index} className='relative flex-1'>
                        <Fragment>
                          <BaseButton
                            size='normal'
                            className={
                              classNames('w-full flex-center gap-[6px]', {
                                'bg-white text-gray-1 border border-solid border-gray-7': !active,
                                'bg-primary text-white': active,
                                'rounded-l-[22px]': index === 0,
                                'rounded-r-[22px]': index === burnTabs.length - 1,
                              })
                            }
                            onClick={() => {
                              handleChange?.({
                                ...form,
                                [name]: value
                              })
                            }}
                          >
                            {
                              active && <RightIcon width='16' height='16' />
                            }
                            <span>{ label }</span>
                          </BaseButton>
                        </Fragment>
                      </li>
                    )
                  })
                }
              </ul>
              <div className='mt-[10px] p-[30px] bg-gray-6 rounded-md'>
                { contentDescription }
              </div>
            </Fragment>
          )
        }
      </div>
    </div>
  )
}

const BrandEconomicModel: FC<BrandMintTabProps<CommunityMintConfig>> = ({ active, checked, locked, form, className, handleChoose, handleChange }) => {
  const title = '6、Which economic model will you accept？'
  const description = 'Warning: You can only choose one token to accept.'

  const economicModelDisabled = false

  const economicTabs: {
    label: string
    name: MintCommunityMintLabels
    active: boolean
    value: SequenceMode
    disabled?: boolean
    description?: string | ReactNode
  }[] = [
    {
      label: 'Locked = Refund',
      name: 'sequenceMode',
      active: form.sequenceMode === SequenceMode.INPUT_VALUE,
      disabled: economicModelDisabled,
      value: SequenceMode.INPUT_VALUE,
      description: (
        <p className='text-sm text-black-tr-40 text-left'>
          <b>Note:</b>
          <span> Refund value = Users’ locked value when they minted your IDs</span>
        </p>
      )
    },
    {
      label: 'Laugh Last, Laugh Best',
      name: 'sequenceMode',
      active: form.sequenceMode === SequenceMode.BURN_INDEX,
      disabled: economicModelDisabled,
      value: SequenceMode.BURN_INDEX,
      description: (
        <p className='text-sm text-black-tr-40 text-left'>
          <b>Note:</b>
          <span> Refund value = Users’ locked value when they minted your IDs</span>
        </p>
      )
    },
    {
      label: 'Bonding Curve',
      name: 'sequenceMode',
      active: form.sequenceMode === SequenceMode.TOTAL_SUPPLY,
      disabled: economicModelDisabled,
      value: SequenceMode.TOTAL_SUPPLY,
      description: (
        <p className='text-sm text-black-tr-40 text-left'>
          <b>Note:</b>
          <span> Refund value = Users’ locked value when they minted your IDs</span>
        </p>
      )
    }
  ]

  const activeEconomicModel = economicTabs.find(item => item.active)

  return (
    <div className={classNames('flex gap-5', { 'hidden': !active }, className)}>
      <div className='py-1 box-content min-w-4 min-h-4 max-w-5 max-h-5 bg-white'>
        {
          (checked || locked) ? (
            <CheckedIcon width='20' height='20' className='text-primary -translate-x-[2px]' />
          ) : (
            <ActiveIcon width='16' height='16' className='text-primary' />
          )
        }
      </div>
      <div className='flex-1'>
        <ManageMintTitle
          title={title}
          description={description}
          activeTitle='There is your economic model：'
          activeText={activeEconomicModel?.label}
          active={active}
          checked={checked}
          locked={locked}
          onClick={handleChoose}
        />
        {
          checked && (
            <Fragment>
              <ul className='mt-5 relative z-1 w-full flex-itmc gap-[6px]'>
                {
                  economicTabs.map(({ name, value, label, active }, index) => {
                    return (
                      <li key={index} className='relative flex-1 min-w-0'>
                        <Fragment>
                          <BaseButton
                            size='normal'
                            className={
                              classNames('w-full flex-center gap-[6px]', {
                                'bg-white text-gray-1 border border-solid border-gray-7': !active,
                                'bg-primary text-white': active,
                                'rounded-l-[22px]': index === 0,
                                'rounded-r-[22px]': index === economicTabs.length - 1,
                              })
                            }
                            onClick={() => {
                              handleChange?.({
                                ...form,
                                [name]: value
                              })
                            }}
                          >
                            {
                              active && <RightIcon width='16' height='16' />
                            }
                            <span className='inline-block min-w-0 whitespace-nowrap overflow-hidden text-ellipsis'>{ label }</span>
                          </BaseButton>
                          {
                            active && (
                              <TriangleIcon
                                width='27'
                                height='27'
                                className='abs-hc text-gray-6 bottom-[-35px]' />
                            )
                          }
                        </Fragment>
                      </li>
                    )
                  })
                }
              </ul>
              {
                activeEconomicModel && (
                  <div className='mt-5 relative z-normal p-[30px] bg-gray-6 rounded-md'>
                    <div className='w-full h-[200px] bg-white rounded-xs'></div>
                    { activeEconomicModel.description }
                  </div>
                )
              }
            </Fragment>
          )
        }
      </div>
    </div>
  )
}

interface ManageMintTitleProps {
  title: string
  description?: string
  active?: boolean
  activeTitle?: string
  activeText?: string | ReactNode
  checked?: boolean
  locked?: boolean
  onClick?: () => void
}

const ManageMintTitle: FC<ManageMintTitleProps> = ({ title, description, active, activeTitle, activeText, checked, locked, onClick }) => {
  const handleClick = () => {
    if (locked) return
    onClick?.()
  }
  return (
    <div className=''>
      <div className={classNames('flex-itmc text-main-black', {
        'text-lg !font-bold': checked,
        'text-sm-b': !checked,
      })}>
        { checked && title }
        {
          active && !checked && (
            <div className='group flex-1 flex-itmc justify-between'>
              <div>{ activeTitle }</div>
              <div
                className='flex-1 flex-itmc gap-1 cursor-pointer'
                onClick={handleClick}
              >
                <div className='text-primary underline-normal font-bold'>
                  { activeText }
                </div>
                {
                  !locked && (<ForwardsIcon width='12' height='12' className='black-1' />)
                }
              </div>
              {
                locked ? (
                  <div className='invisible group-hover:visible px-2 py-1 flex items-center gap-1 text-gray-1 text-xs bg-gray-6 rounded-xs'>
                    <TipsIcon width='12' height='12' />
                    <span>Modification not supported</span>
                  </div>
                ) : (
                  <BaseButton
                    size='small'
                    className='invisible group-hover:visible w-15 gap-1 text-gray-1 bg-gray-6 rounded-xs'
                    onClick={handleClick}
                  >
                    <EditIcon width='12' height='12' />
                    <span>编辑</span>
                  </BaseButton>
                )
              }
            </div>
          )
        }
      </div>
      {
        (description && checked) && (
          <div className='mt-1 flex-itmc gap-[2px] text-xs-b text-red-1'>
            <TipsIcon width="12" height="12" />
            <span>{ description }</span>
          </div>
        )
      }
    </div>
  )
}