import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'

import { DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant'
import { useDetails } from '@/contexts/details'
import { calcCurrentMintPrice, priceModeFormulaMap } from '@/utils/formula'
import { constantsRule, decimalsRule } from '@/utils/price'

import PriceModeChart from '@/components/common/priceModeChart'
import Input from '@/components/common/input'
import Switch from '@/components/common/switch'
import ToolTip from '@/components/common/tooltip'
import InfoLabel from '@/components/common/infoLabel'
import MintButton from '@/components/mint/button'
import DividerLine from '@/components/common/dividerLine'

import { CommunityPrice, MintModeLabels, SequenceMode, SequenceModeLabels, PriceMode, PriceModeLabels, PriceModeKeys, CommunityMintConfig, CommunityMemberConfig, ContractVerison } from '@/types/contract'

import TipIcon from '~@/icons/tip.svg'
import classNames from 'classnames'

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
}

export type FormItemTypes = 'memberConfig' | 'mint' | 'price' | 'baseUri'

export type MintCommunityMemberLabels = keyof CommunityMemberConfig

export type MintCommunityMintLabels = keyof CommunityMintConfig

export type PriceCommunityMintLabels = keyof CommunityPrice

export type MintSettingLabels = MintCommunityMemberLabels | MintCommunityMintLabels | PriceCommunityMintLabels

interface CommunityMintProps {
  version: ContractVerison
  forms: {
    memberConfig: CommunityMemberConfig,
    mint: CommunityMintConfig,
    price: CommunityPrice,
  }
  defaultForms: CommunityMemberConfig & CommunityMintConfig & CommunityPrice
  validation: Record<string, string | undefined>
  loading: boolean
  coinSymbol: string,
  handleChange?: (type: FormItemTypes, value: Partial<CommunityMemberConfig & CommunityMintConfig & CommunityPrice>) => void
  handleSave?: (type: FormItemTypes) => void
}

type FormProps<T = MintSettingLabels> = {
  type: 'text' | 'textarea' | 'switch',
  name: T,
  label: string,
  tooltip?: string,
  placeholder: string,
  unit: ReactNode,
  append?: ReactNode,
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
 
const CommunityMint: FC<CommunityMintProps> = ({ version, forms, defaultForms, validation, loading, coinSymbol, handleChange, handleSave }) => {
  const { communityInfo } = useDetails()

  const priceModelDisabled = Number(communityInfo.totalSupply) > 0
  const burnAnytimeDisabled = Number(communityInfo.totalSupply) > 0
  
  const mintModeOption: {
    disabled: boolean
    label: string
    unit: string
    formType: FormItemTypes
    tabs: {
      label: string
      name: MintCommunityMintLabels
      active: boolean
      forms: FormProps<MintCommunityMintLabels>[]
    }[]
  } = {
    disabled: Number(communityInfo.totalSupply) > 0,
    label: 'How would you like your community to mint their IDs？',
    unit: '',
    formType: 'mint',
    tabs: [
      {
        label: MintModeLabels.SIGNATURE,
        active: Boolean(forms.mint.signatureMint),
        name: 'signatureMint',
        forms: [
          {
            type: 'switch',
            name: 'signatureMint',
            label: 'Enable signature mint',
            placeholder: '0/1',
            unit: '',
            value: true,
            hidden: true
          },
          {
            type: 'text',
            name: 'signer',
            label: 'Signer',
            // tooltip: 'The wallet address that can generate signature',
            placeholder: '0x0...',
            unit: 'address',
            child: true,
            value: forms.mint.signer,
          },
        ]
      },
      {
        label: MintModeLabels.PUBLIC,
        name: 'publicMint',
        active: Boolean(forms.mint.publicMint),
        forms: [
          {
            type: 'switch',
            name: 'publicMint',
            label: 'Enable public mint',
            placeholder: '0/1',
            unit: '',
            value: true,
            hidden: true
          }
        ]
      },
      {
        label: MintModeLabels.HOLDING, 
        name: 'holdingMint',
        active: Boolean(forms.mint.holdingMint),
        forms: [
          {
            type: 'switch',
            name: 'publicMint',
            label: 'Enable public mint',
            placeholder: '0/1',
            unit: '',
            value: true,
            hidden: true
          },
          {
            type: 'textarea',
            name: 'proofOfHolding',
            label: 'Proof of holding',
            placeholder: '0x...',
            unit: 'One address per line',
            hidden: !forms.mint.holdingMint,
            child: true,
            value: forms.mint.proofOfHolding,
          },
        ]
      }
    ]
  }

  const activeModeTab = mintModeOption.tabs.find(tab => tab.active)

  // Token Contract of Minting Fee setting option
  const burnAnytimeOption: {
    disabled: boolean
    label: string
    unit: string
    formType: FormItemTypes
    tabs: {
      label: string
      name: MintCommunityMemberLabels
      active: boolean
      disabled: boolean
      value: boolean
      forms: FormProps<MintCommunityMemberLabels>[]
    }[]
  } = {
    disabled: Number(communityInfo.totalSupply) > 0,
    label: 'Would you like members to be able to burn tokens anytime？',
    unit: '',
    formType: 'memberConfig',
    tabs: [
      {
        label: 'YES',
        name: 'burnAnytime',
        active: forms.memberConfig.burnAnytime,
        disabled: burnAnytimeDisabled,
        value: true,
        forms: []
      },
      {
        label: 'NO',
        name: 'burnAnytime',
        active: !forms.memberConfig.burnAnytime,
        disabled: priceModelDisabled,
        value: false,
        forms: []
      }
    ]
  }

  // Token Contract of Minting Fee setting option
  const tokenSymbolOption: {
    disabled: boolean
    label: string
    unit: string
    formType: FormItemTypes
    tabs: {
      label: string
      name: MintCommunityMintLabels
      active: boolean
      disabled: boolean
      value: string
      forms: FormProps<MintCommunityMintLabels>[]
    }[]
  } = {
    disabled: Number(communityInfo.totalSupply) > 0,
    label: 'Which token will you accept？',
    unit: '',
    formType: 'mint',
    tabs: [
      {
        label: DEFAULT_TOKEN_SYMBOL[communityInfo.chainId ?? MAIN_CHAIN_ID],
        name: 'coin',
        active: forms.mint.coin === ZERO_ADDRESS,
        disabled: priceModelDisabled,
        value: ZERO_ADDRESS,
        forms: []
      },
      {
        label: 'Other',
        name: 'coin',
        active: forms.mint.coin !== ZERO_ADDRESS,
        disabled: priceModelDisabled,
        // 1. if defaultForms.coin === ZERO_ADDRESS ? '': defaultForms.coin || ''
        value: String(defaultForms.coin === ZERO_ADDRESS ? '' : defaultForms.coin || ''),
        forms: [
          {
            type: 'text',
            name: 'coin',
            label: 'Token Contract of Minting Fee',
            // tooltip: 'Contract for ERC20 tokens required for staking when users mint member domains. <br/><br/>If no ERC20 contract is specified, the native token of the network will be used by default.',
            placeholder: '0x0...',
            unit: 'address',
            disabled: priceModelDisabled,
            value: forms.mint.coin,
            child: true
          }
        ]
      }
    ]
  }

  const activeTokenSymbolTab = tokenSymbolOption.tabs.find(tab => tab.active)

  // sequenceMode setting option
  const sequenceModeOption: {
    disabled: boolean
    label: string
    unit: string
    formType: FormItemTypes
    tabs: {
      label: SequenceModeLabels
      name: MintCommunityMintLabels
      active: boolean
      disabled: boolean
      value: SequenceMode
      forms: FormProps<MintCommunityMintLabels>[]
    }[]
  } = {
    disabled: priceModelDisabled,
    label: 'Which economic model will you accept？',
    unit: '',
    formType: 'mint',
    tabs: [
      {
        label: SequenceModeLabels.INPUT_VALUE,
        name: 'sequenceMode',
        active: forms.mint.sequenceMode === SequenceMode.INPUT_VALUE,
        disabled: priceModelDisabled,
        value: SequenceMode.INPUT_VALUE,
        forms: []
      },
      {
        label: SequenceModeLabels.BURN_INDEX,
        name: 'sequenceMode',
        active: forms.mint.sequenceMode === SequenceMode.BURN_INDEX,
        disabled: priceModelDisabled,
        value: SequenceMode.BURN_INDEX,
        forms: []
      },
      {
        label: SequenceModeLabels.TOTAL_SUPPLY,
        name: 'sequenceMode',
        active: forms.mint.sequenceMode === SequenceMode.TOTAL_SUPPLY,
        disabled: priceModelDisabled,
        value: SequenceMode.TOTAL_SUPPLY,
        forms: []
      },
    ]
  }

  // linear、Exponentiation、Reciprocal、Langmuir
  const mintPriceTabsOption: {
    disabled: boolean
    label: string
    unit: ReactNode
    formType: FormItemTypes
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
    // basePriceForms: FormProps<PriceCommunityMintLabels>[],
    // mintingPeriodForms: FormProps[],
  } = {
    disabled: priceModelDisabled,
    label: 'What’s the mint price per year you expect from an ID?',
    unit: <span><span className='text-searchpurple font-medium'>{ coinSymbol }</span> per year</span>,
    formType: 'price',
    tabs: [
      {
        label: PriceModeLabels.CONSTANT,
        name: 'mode',
        active: Number(forms.price.mode) === 1,
        disabled: priceModelDisabled,
        value: 1,
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
            value: forms.price.a,
            format: decimalsRule,
            primary: true,
            child: true
          }
        ],
      },
      {
        label: PriceModeLabels.LINEAR,
        name: 'mode',
        active: Number(forms.price.mode) === 2,
        disabled: priceModelDisabled,
        value: 2,
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
            value: forms.price.a,
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
            value: forms.price.b,
            format: decimalsRule,
            child: true
          }
        ],
      },
      {
        label: PriceModeLabels.EXPONENTIAL,
        name: 'mode',
        active: Number(forms.price.mode) === 3,
        disabled: priceModelDisabled,
        value: 3,
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
            value: forms.price.a,
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
            value: forms.price.b,
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
            value: forms.price.c,
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
            value: forms.price.d,
            format: constantsRule,
            child: true
          }
        ],
      },
      {
        label: PriceModeLabels.SQUARE,
        name: 'mode',
        active: Number(forms.price.mode) === 4,
        disabled: priceModelDisabled,
        value: 4,
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
            value: forms.price.a,
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
            value: forms.price.b,
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
            value: forms.price.c,
            format: constantsRule,
            child: true
          }
        ],
      },
    ],
    // basePriceForms: [
    //   // {
    //   //   type: 'text',
    //   //   name: 'a',
    //   //   label: '',
    //   //   placeholder: '0',
    //   //   unit: <span><span className='text-searchpurple font-medium'>{ coinSymbol }</span> per year</span>,
    //   //   append: <span className='text-mintLabelGray text-mintTipTitle whitespace-nowrap'>{ coinSymbol }</span>,
    //   //   disabled: true,
    //   //   value: perYearBaseMintPrice,
    //   // },
    //   {
    //     type: 'text',
    //     name: 'a',
    //     label: '',
    //     placeholder: '0',
    //     unit: <span><span className='text-searchpurple font-medium'>{ coinSymbol }</span> per day</span>,
    //     append: <span className='text-mintLabelGray text-mintTipTitle whitespace-nowrap'>per day</span>,
    //     disabled: priceModelDisabled,
    //     format: decimalsRule,
    //     // child: true,
    //     value: forms.price.a,
    //   }
    // ],
    // mintingPeriodForms: [
    //   {
    //     formType: 'mint',
    //     type: 'text',
    //     name: 'durationUnit',
    //     label: 'Minting Period',
    //     placeholder: '0',
    //     unit: 'days',
    //     outsideAppend: <span className='text-mintLabelGray text-mintTipTitle whitespace-nowrap'>days</span>,
    //     // disabled: priceModelDisabled,
    //     disabled: true,
    //     format: decimalsRule,
    //     // child: true,
    //     value: forms.mint.durationUnit,
    //   }
    // ]
  }

  const activePriceTab = mintPriceTabsOption.tabs.find(tab => tab.active)

  // commission rate setting option
  const commissionRateOption: {
    disabled: boolean
    label: string
    unit: string
    formType: FormItemTypes
    forms: FormProps<PriceCommunityMintLabels>[]
  } = {
    disabled: Number(communityInfo.totalSupply) > 0,
    label: 'How much royalty fee do you plan to charge in percentage？',
    unit: '[0,100] %',
    formType: 'price',
    forms: [
      {
        type: 'text',
        name: 'commissionRate',
        label: '',
        placeholder: '0',
        range: [0, 100],
        unit: '%',
        disabled: Number(communityInfo.totalSupply) > 0,
        value: forms.price.commissionRate,
      }
    ]
  }
  
  // const baseUriForms: FormProps[] = useMemo(() => {
  //   return [
  //     {
  //       type: 'text',
  //       name: 'imageBaseURI',
  //       label: 'Base image URL',
  //       placeholder: 'https://',
  //       unit: 'url',
  //       value: forms.baseUri.imageBaseURI,
  //     },
  //   ]
  // }, [forms.baseUri])

  useEffect(() => {
    if (!activeModeTab) {
      handleChange?.('mint', {
        ...mintModeOption.tabs.reduce((acc, cur) => {
          acc[cur.name as 'signatureMint' | 'publicMint' | 'holdingMint'] = false
          return acc
        }, {} as CommunityMintConfig),
        [mintModeOption.tabs[0].name]: true
      })
    }
  }, [activeModeTab])

  function renderInput(item: FormProps, type: FormItemTypes, loading?: boolean) {
    return (
      <Input
        value={item.value}
        placeholder={item.placeholder}
        disabled={item.disabled || loading}
        endAdornment={item.append}
        onChange={(e) => {
          if (e.target.value && item.format) {
            item.format.test(e.target.value) && handleChange?.(type, { [item.name]: e.target.value })
            return
          }
          if (e.target.value && item.range) {
            const num = Number(e.target.value)
            if (num >= item.range[0] && num <= item.range[1]) {
              handleChange?.(type, { [item.name]: e.target.value })
            }
            return
          }
          handleChange?.(type, { [item.name]: e.target.value })
        }}
      />
    )
  }

  function renderInputArea(item: FormProps, type: FormItemTypes, loading?: boolean) {
    return (
      <Input
        multiline
        rows={4}
        placeholder={item.placeholder}
        disabled={item.disabled || loading}
        value={item.value}
        onChange={(e) => {
          handleChange?.(type, { [item.name]: e.target.value })
        }}
      />
    )
  }

  function renderSwitch(item: FormProps, type: FormItemTypes, loading?: boolean) {
    return (
      <InfoLabel sub={item.child} label={item.label} tooltip={item.tooltip} disabled={item.disabled || loading}>
        <Switch
          checked={Boolean(item.value)}
          disabled={item.disabled || loading}
          onChange={(e) => {
            handleChange?.(type, { [item.name]: e.target.checked })
          }}
        />
      </InfoLabel>
    )
  }

  function renderItem(item: FormProps, type: FormItemTypes, loading?: boolean) {
    const renderMap = {
      text: renderInput,
      textarea: renderInputArea,
      switch: renderSwitch,
    }
    return (
      <div className={ classnames({
        // 'mb-3': item.child
      }) }>
        { renderMap[item.type](item, type, loading) }
      </div>
    )
  }

  function renderFormulaInput(item: FormProps, type: FormItemTypes, loading?: boolean) {
    return (
      <div className='flex items-center gap-3'>
        <Input
          inputclassname='!px-2 !py-2'
          value={item.value}
          placeholder={item.placeholder}
          disabled={item.disabled || loading}
          endAdornment={item.append}
          onChange={(e) => {
            if (e.target.value && item.format) {
              item.format.test(e.target.value) && handleChange?.(type, { [item.name]: e.target.value })
              return
            }
            if (e.target.value && item.range) {
              const num = Number(e.target.value)
              if (num >= item.range[0] && num <= item.range[1]) {
                handleChange?.(type, { [item.name]: e.target.value })
              }
              return
            }
            handleChange?.(type, { [item.name]: e.target.value })
          }}
        />
        { item.outsideAppend }
      </div>
    )
  }

  function renderFormulaItem(mode: PriceMode, items: FormProps[], type: FormItemTypes, loading?: boolean) {
    const params = items
      .map(item => ({ name: item.name, value: item.value }))
      .reduce((acc, cur) => {
        const name = cur.name as 'a' | 'b' | 'c' | 'd'
        acc[name] = String(cur.value || 0)
        return acc
      }, {} as { a: string; b: string; c: string; d: string })

    // const labels = [0, 1000, 2000, 3000, 4000, 5000, 6000]

    // const values = labels.map(x => {
    //   // price is the final price of multiple days
    //   return Number(calcCurrentMintPrice(x, { ...params, mode }).price)
    // })

    const formula = priceModeFormulaMap[mode]
    const coefficients = formula.match(/[abcd]+/g) || []
    const _formula = `_${formula}_`
    const words = _formula.split(/[abcd]+/g)

    return (
      <Fragment>
        <PriceModeChart
          params={{
            mode,
            commissionRate: Number(forms.price.commissionRate),
            ...params
          }}
          markerSymbol={coinSymbol}
          hiddenMarkers
        />
        <div className='flex items-center gap-1 whitespace-nowrap'>
          <span>Y</span>
          <span>=</span>
          {
            words.map((word, idx) => {
              const item = items.find(item => item.name === coefficients[idx])
              return (
                <Fragment key={idx}>
                  <span>{ word.replace('_', '') }</span>
                  {
                    item && renderFormulaInput(item, type, loading)
                  }
                </Fragment>
              )
            })
          }
        </div>
      </Fragment>
    )
  }

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-[10px]">
      <div className='w-full flex flex-col gap-5'>

        {/* mint mode section */}
        <section className='w-full'>
          <div className='flex items-end justify-between'>
            <span className='text-mintLabelGray text-mintTipTitle'>{ mintModeOption.label }</span>
            { mintModeOption.unit && <span className='text-mintUnit text-mainGray'>{ mintModeOption.unit }</span> }
          </div>
          <ul className='mt-3 grid grid-cols-3 gap-3'>
            {
              mintModeOption.tabs.map((tab, index) => {
                return (
                  <Fragment key={index}>
                    <li
                      key={index}
                      className='group cursor-pointer'
                      onClick={() => {
                        handleChange?.(mintModeOption.formType, {
                          ...mintModeOption.tabs.reduce((acc, cur) => {
                            acc[cur.name as 'signatureMint' | 'publicMint' | 'holdingMint'] = false
                            return acc
                          }, {} as CommunityMintConfig),
                          [tab.name]: true
                        })
                      }}>
                        <div
                          className={
                            classnames(
                              'flex items-center justify-center w-full px-4 py-6',
                              'text-[#363E49] text-mint-setting-tab group-hover:border-searchpurple',
                              'border-solid border-[#E8E8E8] border-[1px] rounded-[6px]',
                              {
                                '!text-white !bg-searchpurple !border-searchpurple': tab.active
                              }
                            )
                          }
                        >
                          { tab.label }
                        </div>
                    </li>
                  </Fragment>
                )
              })
            }
          </ul>
          {
            activeModeTab?.forms.find(item => !item.hidden) && (
              <ul className='mt-3'>
                {
                  activeModeTab.forms.filter(i => !i.hidden).map((item, cIndex) => {
                    return (
                      <li key={cIndex} className={classnames('w-full', {
                        // 'mt-4': item.gap,
                        'pl-4': item.child,
                        'hidden': item.hidden,
                      })}>
                        <div className={classnames('flex items-center justify-between', {
                          'hidden': item.type === 'switch'
                        })}>
                          <span className={classnames('flex items-center gap-1 text-mintLabelGray', {
                            'text-mintTipTitle': !item.child,
                            'text-mintTipSubTitle': item.child
                          })}>
                            <span>{ item.label }</span>
                            {
                              item.tooltip && (
                                <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: item.tooltip }}></div>}>
                                  <TipIcon width='16' height='16' className='text-mintPurple'/>
                                </ToolTip>
                              )
                            }
                          </span>
                          { item.unit && <span className='text-mintUnit text-mainGray'>{ item.unit }</span> }
                        </div>
                        <div className={classnames('w-full', { 'mt-[10px]': item.type !== 'switch' })}>
                          { renderItem(item, mintModeOption.formType, loading) }
                          { validation[item.name] && <p className="text-error">{validation[item.name]}</p> }
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            )
          }
        </section>
        <DividerLine />

        {/* token symbol section */}
        <section className='w-full'>
          <div className='flex items-end justify-between'>
            <span className='text-mintLabelGray text-mintTipTitle'>{ tokenSymbolOption.label }</span>
            { tokenSymbolOption.unit && <span className='text-mintUnit text-mainGray'>{ tokenSymbolOption.unit }</span> }
          </div>
          <ul className='mt-3 flex items-center gap-3'>
            {
              tokenSymbolOption.tabs.map((tab, index) => {
                return (
                  <Fragment key={index}>
                    <li
                      key={index}
                      className={classNames('group cursor-pointer', {
                        'bg-disabled opacity-80 pointer-events-none select-none': tab.disabled
                      })}
                      onClick={() => {
                        handleChange?.(tokenSymbolOption.formType, {
                          [tab.name]: tab.value
                        })
                      }}>
                        <div
                          className={
                            classnames(
                              'flex items-center justify-center w-full px-4 py-3',
                              'text-[#363E49] text-mint-setting-tab group-hover:border-searchpurple',
                              'border-solid border-[#E8E8E8] border-[1px] rounded-[6px]',
                              {
                                '!text-white !bg-searchpurple !border-searchpurple': tab.active
                              }
                            )
                          }
                        >
                          { tab.label }
                        </div>
                    </li>
                  </Fragment>
                )
              })
            }
          </ul>
          {
            activeTokenSymbolTab?.forms.find(item => !item.hidden) && (
              <ul className='mt-3'>
                {
                  activeTokenSymbolTab.forms.filter(i => !i.hidden).map((item, cIndex) => {
                    return (
                      <li key={cIndex} className={classnames('w-full', {
                        // 'mt-4': item.gap,
                        'pl-4': item.child,
                        'hidden': item.hidden,
                      })}>
                        <div className={classnames('flex items-center justify-between', {
                          'hidden': item.type === 'switch'
                        })}>
                          <span className={classnames('flex items-center gap-1 text-mintLabelGray', {
                            'text-mintTipTitle': !item.child,
                            'text-mintTipSubTitle': item.child
                          })}>
                            <span>{ item.label }</span>
                            {
                              item.tooltip && (
                                <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: item.tooltip }}></div>}>
                                  <TipIcon width='16' height='16' className='text-mintPurple'/>
                                </ToolTip>
                              )
                            }
                          </span>
                          { item.unit && <span className='text-mintUnit text-mainGray'>{ item.unit }</span> }
                        </div>
                        <div className={classnames('w-full', { 'mt-[10px]': item.type !== 'switch' })}>
                          { renderItem(item, mintModeOption.formType, loading) }
                          { validation[item.name] && <p className="text-error">{validation[item.name]}</p> }
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            )
          }
        </section>
        <DividerLine />

        {/* burnAnytime section */}
        {
          version >= ContractVerison.V3 && (
            <Fragment>
              <section className='w-full'>
                <div className='flex items-end justify-between'>
                  <span className='text-mintLabelGray text-mintTipTitle'>{ burnAnytimeOption.label }</span>
                  { burnAnytimeOption.unit && <span className='text-mintUnit text-mainGray'>{ burnAnytimeOption.unit }</span> }
                </div>
                <ul className='mt-3 flex items-center gap-3'>
                  {
                    burnAnytimeOption.tabs.map((tab, index) => {
                      return (
                        <Fragment key={index}>
                          <li
                            key={index}
                            className={classNames('group cursor-pointer', {
                              'bg-disabled opacity-80 pointer-events-none select-none': tab.disabled
                            })}
                            onClick={() => {
                              handleChange?.(burnAnytimeOption.formType, {
                                [tab.name]: tab.value
                              })
                            }}>
                              <div
                                className={
                                  classnames(
                                    'flex items-center justify-center w-full px-4 py-3',
                                    'text-[#363E49] text-mint-setting-tab group-hover:border-searchpurple',
                                    'border-solid border-[#E8E8E8] border-[1px] rounded-[6px]',
                                    {
                                      '!text-white !bg-searchpurple !border-searchpurple': tab.active
                                    }
                                  )
                                }
                              >
                                { tab.label }
                              </div>
                          </li>
                        </Fragment>
                      )
                    })
                  }
                </ul>
              </section>
              <DividerLine />
            </Fragment>
          )
        }

        {/* sequenceMode section */}
        <section className='w-full'>
          <div className='flex items-end justify-between'>
            <span className='text-mintLabelGray text-mintTipTitle'>{ sequenceModeOption.label }</span>
            { sequenceModeOption.unit && <span className='text-mintUnit text-mainGray'>{ sequenceModeOption.unit }</span> }
          </div>
          <ul className='mt-3 flex items-center gap-3'>
            {
              sequenceModeOption.tabs.map((tab, index) => {
                return (
                  <Fragment key={index}>
                    <li
                      key={index}
                      className={classNames('group cursor-pointer', {
                        'bg-disabled opacity-80 pointer-events-none select-none': tab.disabled
                      })}
                      onClick={() => {
                        handleChange?.(sequenceModeOption.formType, {
                          [tab.name]: tab.value
                        })
                      }}>
                        <div
                          className={
                            classnames(
                              'flex items-center justify-center w-full px-4 py-3',
                              'text-[#363E49] text-mint-setting-tab group-hover:border-searchpurple',
                              'border-solid border-[#E8E8E8] border-[1px] rounded-[6px]',
                              {
                                '!text-white !bg-searchpurple !border-searchpurple': tab.active
                              }
                            )
                          }
                        >
                          { tab.label }
                        </div>
                    </li>
                  </Fragment>
                )
              })
            }
          </ul>
        </section>
        <DividerLine />

        {/* mint price section */}
        <section className='w-full'>
          <div className='flex items-end justify-between'>
            <span className='text-mintLabelGray text-mintTipTitle'>{ mintPriceTabsOption.label }</span>
            { mintPriceTabsOption.unit && <span className='text-mintUnit text-mainGray'>{ mintPriceTabsOption.unit }</span> }
          </div>
          {/* <ul className='mt-3 w-full flex items-center gap-3'>
            <span className='whitespace-nowrap'>Base Price:</span>
            {
              mintPriceTabsOption.basePriceForms.map((item, index) => {
                return (
                  <li key={index} className='w-full'>
                    <div className='w-full'>
                      { renderItem(item, mintPriceTabsOption.formType, loading) }
                    </div>
                  </li>
                )
              })
            }
          </ul> */}
          <DividerLine />
          <ul className='mt-3 grid grid-cols-4 gap-3'>
            {
              mintPriceTabsOption.tabs.map((tab, index) => {
                return (
                  <Fragment key={index}>
                    <li
                      key={index}
                      className={classNames('group cursor-pointer', {
                        'bg-disabled opacity-80 pointer-events-none select-none': tab.disabled
                      })}
                      onClick={() => {
                        const { defaultValues } = tab
                        // online mode data
                        if (tab.value === defaultForms.mode) {
                          handleChange?.(mintPriceTabsOption.formType, {
                            [tab.name]: tab.value,
                            b: String(defaultForms.b || 0),
                            c: String(defaultForms.c || 0),
                            d: String(defaultForms.d || 0),
                          })
                          return
                        }
                        handleChange?.(mintPriceTabsOption.formType, {
                          [tab.name]: tab.value,
                          b: String((defaultValues.b ?? defaultForms.b) || 0),
                          c: String((defaultValues.c ?? defaultForms.c) || 0),
                          d: String((defaultValues.d ?? defaultForms.d) || 0),
                        })
                      }}>
                        <div
                          className={
                            classnames(
                              'flex items-center justify-center w-full px-4 py-3',
                              'text-[#363E49] text-mint-setting-tab group-hover:border-searchpurple',
                              'border-solid border-[#E8E8E8] border-[1px] rounded-[6px]',
                              {
                                '!text-white !bg-searchpurple !border-searchpurple': tab.active
                              }
                            )
                          }
                        >
                          { tab.label }
                        </div>
                    </li>
                  </Fragment>
                )
              })
            }
          </ul>
          <div className='mt-3'>
            {
              activePriceTab?.forms.find(item => !item.hidden) && (
                renderFormulaItem(activePriceTab.value, activePriceTab?.forms, mintPriceTabsOption.formType)
              )
            }
          </div>
          {/* <DividerLine wrapClassName='pl-6'/>
          <ul className='pl-6 mt-3 w-full flex items-center gap-3'>
            <span className='whitespace-nowrap'>MP</span>
            <span className='whitespace-nowrap'>=</span>
            {
              mintPriceTabsOption.mintingPeriodForms.map((item, index) => {
                return (
                  <li key={index} className='w-full'>
                    <div className='w-full'>
                      { renderFormulaInput(item, 'mint', loading) }
                    </div>
                  </li>
                )
              })
            }
          </ul> */}
        </section>
        <DividerLine/>

        {/* commission rate section */}
        <section className='w-full'>
          <div className='flex items-end justify-between'>
            <span className='text-mintLabelGray text-mintTipTitle'>{ commissionRateOption.label }</span>
            { commissionRateOption.unit && <span className='text-mintUnit text-mainGray'>{ commissionRateOption.unit }</span> }
          </div>
          <ul className='mt-3 w-full flex flex-col gap-3'>
            {
              commissionRateOption.forms.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <li key={index} className={classnames('w-full', {
                      // 'mt-4': item.gap,
                      // 'pl-4': item.child,
                      'hidden': item.hidden,
                    })}>
                      <div className={classnames('flex items-center justify-between', {
                        'hidden': item.type === 'switch' || !item.label
                      })}>
                        <span className={classnames('flex items-center gap-1 text-mintLabelGray text-mintTipTitle', {
                          // 'text-mintTipTitle': !item.child,
                          // 'text-mintTipSubTitle': item.child
                        })}>
                          <span>{ item.label }</span>
                          {
                            item.tooltip && (
                              <ToolTip className='whitespace-pre-line' content={<div className='min-w-[280px]' dangerouslySetInnerHTML={{ __html: item.tooltip }}></div>}>
                                <TipIcon width='16' height='16' className='text-mintPurple'/>
                              </ToolTip>
                            )
                          }
                        </span>
                        { item.unit && <span className='text-mintUnit text-mainGray'>{ item.unit }</span> }
                      </div>
                      <div className={classnames('w-full', { 'mt-[10px]': item.type !== 'switch' })}>
                        { renderItem(item, commissionRateOption.formType, loading) }
                        { validation[item.name] && <p className="text-error">{validation[item.name]}</p> }
                      </div>
                    </li>
                  </Fragment>
                )
              })
            }
          </ul>
        </section>
      </div>
    </div>
  )
}

export default CommunityMint