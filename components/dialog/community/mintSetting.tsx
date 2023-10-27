import { FC, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { useWallet } from '@/hooks/wallet'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import { formatContractError, isAddress } from '@/shared/helper'
import { ZERO_ADDRESS } from '@/shared/constant'
import { getTokenSymbol } from '@/shared/contract'
import useApi from '@/shared/useApi'
import { parseToUnitPrice, parseToDurationPrice } from '@/utils/formula'
import { toBN } from '@/utils/format'

import Dialog from '@/components/common/dialog'
import CommunityMintSetting, { MintCommunityMintLabels, PriceCommunityMintLabels, FormItemTypes, MintSettingLabels, MintCommunityMemberLabels } from '@/components/settings/community/mint'


import TipIcon from '~@/icons/tip.svg'
import { CommunityPrice, CommunityMintConfig, PriceMode, SequenceMode, CommunityMemberConfig } from '@/types/contract'
import { updateCommunity } from '@/shared/apis'

interface Props {
  open: boolean
  handleClose?: () => void
}

const CommunityMintSettingDialog: FC<Props> = ({ open, handleClose }) => {
  const { message } = useRoot()
  const { address: account } = useWallet()
  const { version, communityInfo } = useDetails()
  const { updateCommunityMintConfig, updateCommunityConfig, updateVariableCommunityMintConfig } = useApi()

  const defaultForms: CommunityMemberConfig & CommunityMintConfig & CommunityPrice = useMemo(() => {
    const params = {
      a_: toBN(communityInfo?.priceModel?.a ?? '0'),
      b_: toBN(communityInfo?.priceModel?.b ?? '0'),
      c_: toBN(communityInfo?.priceModel?.c ?? '0'),
      d_: toBN(communityInfo?.priceModel?.d ?? '0'),
    }
    const { a, b, c, d } = parseToDurationPrice(communityInfo.priceModel?.mode, params, communityInfo?.config?.durationUnit ?? 1)
    return {
      publicMint: communityInfo?.config?.publicMint ?? false,
      signatureMint: communityInfo?.config?.signatureMint ?? false,
      holdingMint: communityInfo?.config?.holdingMint ?? false,
      // signer: (communityInfo?.config?.signer === ZERO_ADDRESS) ? account : (communityInfo?.config?.signer ?? ''), // if signer is not set, use current account
      signer: communityInfo?.config?.signer ?? ZERO_ADDRESS, // if signer is not set, use zero address
      proofOfHolding: communityInfo?.config?.proofOfHolding.join('\n') ?? '',
      // coin: (communityInfo?.config?.coin === ZERO_ADDRESS) ? '' : (communityInfo?.config?.coin ?? ''),
      coin: communityInfo?.config?.coin ?? ZERO_ADDRESS,
      sequenceMode: communityInfo?.config?.sequenceMode ?? SequenceMode.INPUT_VALUE,
      durationUnit: communityInfo?.config?.durationUnit ?? 365,
      reserveDuration: communityInfo.config?.reserveDuration ?? 7 * 24 * 3600,
      burnAnytime: communityInfo.config?.burnAnytime ?? true,
      mode: communityInfo?.priceModel?.mode ?? PriceMode.CONSTANT,
      a: a,
      b: b,
      c: c,
      d: d,
      commissionRate: (Number(communityInfo?.priceModel?.commissionRate) / 100) ?? 10,
    }
  }, [communityInfo])

  const [settingLoading, setSettingLoading] = useState(false)
  const [coinSymbol, setCoinSymbol] = useState(communityInfo.coinSymbol || '')
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})

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

  // const [baseUriForm, setBaseUriForm] = useState<Record<BaseUriCommunityMintLabels, string | number | boolean | undefined>>({
  //   imageBaseURI: communityInfo?.config?.imageBaseURI ?? '',
  // })
  async function memberConfigFormPreFilter(input: Partial<CommunityMemberConfig>) {
    const _form = { ...memberConfigForm, ...input } as CommunityMemberConfig
    const rules: Record<MintCommunityMemberLabels, (value: CommunityMemberConfig[MintCommunityMemberLabels]) => Promise<CommunityMemberConfig[MintCommunityMemberLabels]>> = {
      reserveDuration: async (value) => value,
      burnAnytime: async (value) => value,
    }

    await Promise.all(
      Object.keys(rules).map(async (key) => {
        ;(_form[key as MintCommunityMemberLabels] as CommunityMemberConfig[MintCommunityMemberLabels]) = await rules[key as MintCommunityMemberLabels](_form[key as MintCommunityMemberLabels])
      })
    )

    return _form
  }

  async function mintFormPreFilter(input: Partial<CommunityMintConfig>) {
    const _form = { ...mintForm, ...input } as CommunityMintConfig
    const rules: Record<MintCommunityMintLabels, (value: CommunityMintConfig[keyof CommunityMintConfig]) => Promise<CommunityMintConfig[keyof CommunityMintConfig]>> = {
      publicMint: async (value) => value,
      signatureMint: async (value) => value,
      holdingMint: async (value) => value,
      signer: async (value) => {
        const prevSigner = _form.signer ?? ZERO_ADDRESS
        // less gas if signer is not set
        if (!_form.signatureMint) return prevSigner
        return (_form.signer === ZERO_ADDRESS) ? String(account ?? prevSigner) : value // if signer is not set, use current account
      },
      proofOfHolding: async (value) => value,
      coin: async (value) => value,
      sequenceMode: async (value) => value,
      durationUnit: async (value) => value,
    }

    await Promise.all(
      Object.keys(rules).map(async (key) => {
        ;(_form[key as MintCommunityMintLabels] as CommunityMintConfig[keyof CommunityMintConfig]) = await rules[key as MintCommunityMintLabels](_form[key as MintCommunityMintLabels])
      })
    )

    return _form
  }

  async function priceFormPreFilter(input: Partial<CommunityPrice>) {
    const _form = { ...priceForm, ...input } as CommunityPrice
    // const rules: Record<PriceCommunityMintLabels, (value: string | number | boolean | undefined) => Promise<string | number | boolean | undefined>> = {
    //   mode: async (value) => value,
    //   a: async (value) => value,
    //   b: async (value) => value,
    //   c: async (value) => value,
    //   d: async (value) => value,
    //   commissionRate: async (value) => value
    // }

    // await Promise.all(
    //   Object.keys(rules).map(async (key) => {
    //     _form[key as PriceCommunityMintLabels] = await rules[key as PriceCommunityMintLabels](_form[key as PriceCommunityMintLabels])
    //   })
    // )

    return _form
  }

  // async function baseUriFormPreFilter(input: Partial<Record<BaseUriCommunityMintLabels, string | number | boolean | undefined>>) {
  //   const _form = { ...baseUriForm, ...input } as Record<BaseUriCommunityMintLabels, string | number | boolean | undefined>
  //   const rules: Record<BaseUriCommunityMintLabels, (value: string | number | boolean | undefined) => Promise<string | number | boolean | undefined>> = {
  //     imageBaseURI: async (value) => value,
  //   }

  //   await Promise.all(
  //     Object.keys(rules).map(async (key) => {
  //       _form[key as BaseUriCommunityMintLabels] = await rules[key as BaseUriCommunityMintLabels](_form[key as BaseUriCommunityMintLabels])
  //     })
  //   )

  //   return _form
  // }

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
          const symbol = await getTokenSymbol(value, communityInfo.chainId)
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

  // async function validateBaseUriForm() {
  //   const rules: Record<BaseUriCommunityMintLabels, (value: string) => Promise<string | undefined>> = {
  //     imageBaseURI: async (value) => {
  //       if (value.startsWith('http') || value.startsWith('https') || !value) {
  //         return
  //       }
  //       return 'Please enter a valid url'
  //     },
  //   }
  //   const results: Partial<Record<BaseUriCommunityMintLabels, string | undefined>> = {}

  //   const keys = Object.keys(rules) as BaseUriCommunityMintLabels[]
  //   for (const key of keys) {
  //     const result = await rules[key as BaseUriCommunityMintLabels]?.(String(baseUriForm[key as BaseUriCommunityMintLabels]))
  //     if (result) {
  //       results[key] = result
  //     }
  //   }
  //   return results
  // }

  // function needUpdateBaseImageURI() {
  //   const isImageBaseUriChanged = baseUriForm.imageBaseURI !== communityInfo?.config?.imageBaseURI
  //   return isImageBaseUriChanged
  // }

  function needUpdateMemberConfig() {
    const isReserveDurationChanged = memberConfigForm.reserveDuration !== defaultForms.reserveDuration
    const isBurnAnytimeChanged = memberConfigForm.burnAnytime !== defaultForms.burnAnytime
    return isReserveDurationChanged || isBurnAnytimeChanged
  }

  function needUpdateConfig() {
    const isPublicMintChanged = mintForm.publicMint !== defaultForms.publicMint
    const isSignatureMintChange = mintForm.signatureMint !== defaultForms.signatureMint
    const isHoldingMintChanged = mintForm.holdingMint !== defaultForms.holdingMint
    const isSignerChanged = mintForm.signer !== defaultForms.signer
    const isProofOfHoldingChanged = mintForm.proofOfHolding !== defaultForms.proofOfHolding
    const isCoinChanged = mintForm.coin !== defaultForms.coin
    return isPublicMintChanged || isSignatureMintChange || isHoldingMintChanged || isSignerChanged || isProofOfHoldingChanged || isCoinChanged
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
    if (!communityInfo?.node) return
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
      setSettingLoading(true)
      const chainId = communityInfo.chainId as number
      if (needUpdateConfig() || needUpdatePriceConfig() || needUpdateMemberConfig()) {
        const params = {
          a: Number(priceForm.a ?? 0),
          b: Number(priceForm.b ?? 0),
          c: Number(priceForm.c ?? 0),
          d: Number(priceForm.d ?? 0)
        }
        const { a_, b_, c_, d_ } = parseToUnitPrice(priceForm.mode, params, Number(mintForm.durationUnit))
        console.log('-- update payload', {
          signatureMint: mintForm.signatureMint,
          publicMint: mintForm.publicMint,
          holdingMint: mintForm.holdingMint,
          proofOfHolding: ((mintForm.proofOfHolding?.toString()) || '').split('\n').filter(v => isAddress(v)),
          signer: mintForm.signer,
          coin: mintForm.coin || ZERO_ADDRESS,
          sequenceMode: mintForm.sequenceMode,
          durationUnit: mintForm.durationUnit,
          commissionRate: Number(priceForm.commissionRate),
          // mode: 1,
          mode: priceForm.mode,
          a: a_,
          b: b_,
          c: c_,
          d: d_
        })
        if (!needUpdatePriceConfig()) {
          await updateVariableCommunityMintConfig(communityInfo.node.registry, communityInfo.node.registryInterface, {
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
          }, { chainId })
        } else {
          await updateCommunityMintConfig(communityInfo.node.registry, communityInfo.node.registryInterface, {
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
            commissionRate: Number(priceForm.commissionRate),
            // mode: 1,
            mode: priceForm.mode,
            a: a_,
            b: b_,
            c: c_,
            d: d_
          }, { chainId })
        }
        await updateCommunity(communityInfo.node.node, true)
        message({ type: 'success', content: 'Update successfully!' })
        location.reload()
      } else {
        message({ type: 'warning', content: 'Nothing to update.' })
      }
    } catch (e) {
      console.error(e)
      message({
        type: 'error',
        content: 'Failed to update setting: ' + formatContractError(e),
      })
    } finally {
      setSettingLoading(false)
    }
  }

  // const handleUpdateMintConfig = async () => {
  //   if (!communityInfo?.node) return

  //   const validateResult = await validateMintForm()
  //   if (Object.keys(validateResult).length > 0) {
  //     setValidation(validateResult)
  //     return
  //   }

  //   try {
  //     setSettingLoadingSet(prev => ({ ...prev, mint: true }))
  //     if (needUpdateConfig()) {
  //       await updateCommnuityConfig(communityInfo.node.registryInterface, {
  //         signatureMint: mintForm.signatureMint,
  //         publicMint: mintForm.publicMint,
  //         holdingMint: mintForm.holdingMint,
  //         proofOfHolding: ((mintForm.proofOfHolding?.toString()) || '').split('\n').filter(v => isAddress(v)),
  //         signer: mintForm.signer,
  //         coin: mintForm.coin || ZERO_ADDRESS,
  //       })

  //       message({ type: 'success', content: 'Update successfully!' })
  //       // location.reload()
  //     } else {
  //       message({ type: 'warning', content: 'Nothing to update.' })
  //     }
  //     setSettingLoadingSet(prev => ({ ...prev, mint: false }))
  //   } catch (e) {
  //     console.error(e)
  //     message({
  //       type: 'error',
  //       content: 'Failed to update setting: ' + formatContractError(e),
  //     })
  //   } finally {
  //     setSettingLoadingSet(prev => ({ ...prev, mint: false }))
  //   }
  // }

  // const handleUpdatePriceConfig = async () => {
  //   if (!communityInfo?.node) return

  //   const validateResult = await validatePriceForm()
  //   if (Object.keys(validateResult).length > 0) {
  //     setValidation(validateResult)
  //     return
  //   }

  //   try {
  //     setSettingLoadingSet(prev => ({ ...prev, price: true }))
  //     if (needUpdatePriceConfig()) {
  //       await updateCommnuityPriceConfig(communityInfo.node.registry, {
  //         mode: 1,
  //         commissionRate: Number(priceForm.commissionRate),
  //         a: priceForm.price
  //       })

  //       message({ type: 'success', content: 'Update successfully!' })
  //       // location.reload()
  //     } else {
  //       message({ type: 'warning', content: 'Nothing to update.' })
  //     }
  //     setSettingLoadingSet(prev => ({ ...prev, price: false }))
  //   } catch (e) {
  //     console.error(e)
  //     message({
  //       type: 'error',
  //       content: 'Failed to update setting: ' + formatContractError(e),
  //     })
  //   } finally {
  //     setSettingLoadingSet(prev => ({ ...prev, price: false }))
  //   }
  // }

  // const handleUpdateBaseUriConfig = async () => {
  //   if (!communityInfo?.node) return

  //   setValidation({})
  //   const validateResult = await validateBaseUriForm()
  //   if (Object.keys(validateResult).length > 0) {
  //     setValidation(validateResult)
  //     return
  //   }

  //   try {
  //     setSettingLoadingSet(prev => ({ ...prev, baseUri: true }))
  //     if (needUpdateBaseImageURI()) {
  //       await updateCommnuityImageBaseURI(communityInfo.node.registry, baseUriForm.imageBaseURI as string)
  //       message({ type: 'success', content: 'Update successfully!' })
  //       // location.reload()
  //     } else {
  //       message({ type: 'warning', content: 'Nothing to update.' })
  //     }

  //     setSettingLoadingSet(prev => ({ ...prev, baseUri: false }))
  //   } catch (e) {
  //     console.error(e)
  //     message({
  //       type: 'error',
  //       content: 'Failed to update setting: ' + formatContractError(e),
  //     })
  //   } finally {
  //     setSettingLoadingSet(prev => ({ ...prev, baseUri: false }))
  //   }
  // }

  useEffect(() => {
    async function getCoinSymbol() {
      const symbol = await getTokenSymbol((mintForm.coin as string) || ZERO_ADDRESS, communityInfo.chainId)
      setCoinSymbol(symbol)
    }
    getCoinSymbol()
  }, [mintForm.coin])

  useEffect(() => {
    if (!communityInfo.tokenUri) return
    setValidation({})
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
    //   imageBaseURI: communityInfo?.config?.imageBaseURI ?? ''
    // })
  }, [communityInfo, defaultForms])

  return (
    <Dialog
      open={open}
      title={
        <p className='flex items-center justify-center gap-2'>
          <span>Mint Settings</span>
          <Link href='https://docs.communities.id/brand-guide/mint-settings' target='_blank'>
            <TipIcon width='16' height='16' className='text-mintPurple'/>
          </Link>
        </p>
      }
      loading={settingLoading}
      confirmText='Save on-chain'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleUpdateFullMintSetting}>
      <CommunityMintSetting
        version={version}
        forms={{
          memberConfig: memberConfigForm,
          mint: mintForm,
          price: priceForm,
          // baseUri: baseUriForm,
        }}
        defaultForms={defaultForms}
        loading={settingLoading}
        validation={validation}
        coinSymbol={coinSymbol}
        handleChange={async (type, value) => {
          if (type === 'memberConfig') {
            setMemberConfigForm({ ...memberConfigForm, ...await memberConfigFormPreFilter(value) })
          }
          if (type === 'mint') {
            setMintForm({ ...mintForm, ...await mintFormPreFilter(value) })
          }
          if (type === 'price') {
            setPriceForm({ ...priceForm, ...await priceFormPreFilter(value as Partial<CommunityPrice>) })
          }
          // if (type === 'baseUri') {
          //   setBaseUriForm({ ...baseUriForm, ...await baseUriFormPreFilter({ [name]: value }) })
          // }
        }}
        // handleSave={(type) => {
        //   // if (type === 'mint') {
        //   //   handleUpdateMintConfig()
        //   // }
        //   // if (type === 'price') {
        //   //   handleUpdatePriceConfig()
        //   // }
        //   // if (type === 'baseUri') {
        //   //   handleUpdateBaseUriConfig()
        //   // }
        // }}
      />
    </Dialog>
  )
}

export default CommunityMintSettingDialog