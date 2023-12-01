import { FC, Fragment, use, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { BigNumber } from 'ethers'
import { useDetails } from '@/contexts/details'
import { useConfiguration } from '@/contexts/configuration'
import { useRoot } from '@/contexts/root'
import { CHAINS_ID_TO_NETWORK, CHAIN_ID, CONTRACT_MAP, DEFAULT_TOKEN_SYMBOL, MAIN_CHAIN_ID } from '@/shared/constant'
import useApi from '@/shared/useApi'
import { formatPrice, isAddress } from '@/shared/helper'
import { useWallet } from '@/hooks/wallet'
import { useSignUtils } from '@/hooks/sign'
import { sleep } from '@/utils/tools'
import { useDIDContent } from '@/hooks/content'

import CommunityMintStatus from '@/components/_brand/mint/mobile/status'
import CommunityMintStart from '@/components/_brand//mint/mobile/register'
import CommunitySuccess from '@/components/_brand/mint/mobile/latest'
import Steps from '@/components/common/steps'
import DividerLine from '@/components/common/dividerLine'

import { CommunityInfo, SearchMode } from '@/types'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  options: {
    mintNetwork?: number
    mintTo?: string
    invitationCode?: string
  }
}

const MobileBrandMint: FC<Props> = ({ account, brandInfo, brandName, options }) => {
  const { masterAddress } = useConfiguration()
  const [step, setStep] = useState(0)
  const { message } = useRoot()
  const { getMintCommunityPrice, getBrandDIDChainId } = useApi()
  const { verifyCommunityTypedMessage, verifyCommunityOmninodeTypedMessage } = useSignUtils()

  const [price, setPrice] = useState<number | BigNumber>(0)
  const [gasFee, setGasFee] = useState<number | BigNumber>(0)
  const [omniNodeState, setOmniNodeState] = useState(false)
  const [getPriceLoading, setGetPriceLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(false)
  const [omniLoading, setOmniLoading] = useState(false)
  const [brandChainIdLoading, setBrandChainIdLoading] = useState(false)
  const [brandChainId, setBrandChainId] = useState(brandInfo?.chainId || 0)

  // const duplicateFrom = decodeURIComponent(searchParam.get('duplicateFrom')?.trim() || '')

  // const { brandInfo: duplFromBrandInfo, brandInfoLoading: duplFromBrandInfoLoading } = useDIDContent({ brandName: duplicateFrom })

  // to do: check is omninode deployed
  const mintNetwork = options.mintNetwork || MAIN_CHAIN_ID
  const crossChainMintSetting = {
    mintTo: options.mintTo || '',
    omninodeMintTo: options.mintTo || '',
    signature: options.invitationCode || ''
  }
  const [advanceMintSetting, setAdvanceMintSetting] = useState<{mintTo: string, signature: string}>({
    mintTo: '',
    signature: ''
  })
  const [omninodeAdvanceMintSetting, setOmninodeAdvanceMintSetting] = useState<{mintTo: string, signature: string}>({
    mintTo: '',
    signature: ''
  })
  // const [crossChainMintSetting, setCrossChainMintSetting] = useState<{mintTo: string, omninodeMintTo: string, signature: string}>({
  //   mintTo: '',
  //   omninodeMintTo: '',
  //   signature: ''
  // })

  const steps = [
    {
      num: 1,
      label: 'Select Network',
    },
    {
      num: 2,
      label: 'Register',
    },
    {
      num: 3,
      label: 'Mint',
    },
  ]

  const mintLabels = [
    {
      label: 'Mint To',
      text: crossChainMintSetting.mintTo
    },
    {
      label: 'Network',
      text: CHAINS_ID_TO_NETWORK[mintNetwork]
    },
    {
      label: 'Duration',
      text: '1 year'
    }
  ]

  const registerLabels = [
    {
      label: 'Action',
      text: 'Deploy Brand DID'
    },
    {
      label: 'Deploy Network',
      text: CHAINS_ID_TO_NETWORK[MAIN_CHAIN_ID]
    },
    {
      label: 'Network',
      text: CHAINS_ID_TO_NETWORK[mintNetwork]
    },
    {
      label: 'Duration',
      text: '1 year'
    },
    {
      label: 'Owner',
      text: crossChainMintSetting.mintTo
    }
  ]

  const isTargetMainnetWork = useMemo(() => {
    console.log('- mintNetwork', mintNetwork, 'MAIN_CHAIN_ID', MAIN_CHAIN_ID)
    return mintNetwork === MAIN_CHAIN_ID
  }, [mintNetwork])

  const coinSymbol = brandInfo?.communityCoinSymbol || DEFAULT_TOKEN_SYMBOL[mintNetwork]

  // community mint signature validator
  const mintSignatureValidator = useMemo(() => {
    if (!brandName || !brandInfo) return { powerful: false, designated: false }
    const { CommunityRegistryInterface } = CONTRACT_MAP[mintNetwork]
    if (!advanceMintSetting.signature || !masterAddress) return { powerful: false, designated: false }
    console.log('---- verify community mint signature ----', advanceMintSetting.signature, masterAddress, brandName, advanceMintSetting.mintTo, CommunityRegistryInterface, { chainId: mintNetwork })
    return verifyCommunityTypedMessage(advanceMintSetting.signature, masterAddress, brandName, advanceMintSetting.mintTo, CommunityRegistryInterface, { chainId: mintNetwork })
  }, [advanceMintSetting.signature, advanceMintSetting.mintTo, brandName, brandInfo, masterAddress, mintNetwork])

  console.log('- mintSignatureValidator', mintSignatureValidator, 'advanceMintSetting.signature', advanceMintSetting.signature, 'mintNetwork', mintNetwork)

  // start validator
  const isCommunityStartValid = useMemo(() => {
    if (!isTargetMainnetWork) return true
    const { powerful, designated } = mintSignatureValidator
    return powerful || designated
  }, [mintSignatureValidator, isTargetMainnetWork])

  // mint validator
  const isCommunityMintValid = useMemo(() => {
    const { powerful, designated } = mintSignatureValidator
    return powerful || designated
  }, [mintSignatureValidator])

  const isSignatureSelf = useMemo(() => {
    if (!account || mintSignatureValidator.powerful) return false
    return mintSignatureValidator.designated && (!advanceMintSetting.mintTo || advanceMintSetting.mintTo.toLowerCase() === account.toLowerCase())
  }, [mintSignatureValidator, account, advanceMintSetting.mintTo])

  const mintToPlaceholder = useMemo(() => {
    if (mintSignatureValidator.powerful || isSignatureSelf) return account
    return undefined
  }, [mintSignatureValidator.powerful, isSignatureSelf, account])

  // community omninode mint signature validator
  const omninodeSignatureValidator = useMemo(() => {
    if (!brandName || isTargetMainnetWork) return { powerful: false, designated: false }
    console.log('omninodeSignatureValidator', omninodeAdvanceMintSetting.signature, '- omninodeAdvanceMintSetting', omninodeAdvanceMintSetting, verifyCommunityOmninodeTypedMessage(omninodeAdvanceMintSetting.signature, masterAddress, brandName, omninodeAdvanceMintSetting.mintTo, { chainId: mintNetwork }))
    if (!omninodeAdvanceMintSetting.signature || !masterAddress) return { powerful: false, designated: false }
    return verifyCommunityOmninodeTypedMessage(omninodeAdvanceMintSetting.signature, masterAddress, brandName, omninodeAdvanceMintSetting.mintTo, { chainId: mintNetwork })
  }, [omninodeAdvanceMintSetting.signature, omninodeAdvanceMintSetting.mintTo, brandName, mintNetwork, isTargetMainnetWork, masterAddress])

  // omninode register validator
  const isOmninodeMintValid = useMemo(() => {
    if (isTargetMainnetWork) return true
    const { powerful, designated } = omninodeSignatureValidator
    return powerful || designated
  }, [omninodeSignatureValidator, isTargetMainnetWork])

  const isMintHandleValid = useMemo(() => {
    if (isTargetMainnetWork) return isCommunityMintValid
    return isOmninodeMintValid && isCommunityMintValid
  }, [isTargetMainnetWork, isOmninodeMintValid, isCommunityMintValid])

  console.log('- isTargetMainnetWork', isTargetMainnetWork)
  console.log('- isCommunityMintValid', isCommunityMintValid)
  console.log('- isOmninodeMintValid', isOmninodeMintValid)

  const handleFirst = async () => {
    console.log('- handleFirst', isTargetMainnetWork)
    if (!isTargetMainnetWork) {
      setStep(1)
    } else {
      setFirstLoading(true)
      setOmniLoading(true)
      await sleep(1500)
      setStep(1)
      setFirstLoading(false)
      await sleep(1500)
      setStep(2)
      setOmniLoading(false)
    }
  }

  const handleOmninodeDeployed = (state: boolean) => {
    setOmniNodeState(state)
  }

  const handleRefreshBrandChainID = async () => {
    if (!brandName) return
    getBrandDIDChainId(brandName).then((chainId) => {
      console.log('---- handleRefreshBrandChainID', chainId)
      setBrandChainId(chainId)
    }).finally(() => {
      setBrandChainIdLoading(false)
    })
  }

  // async: get mint price
  useEffect(() => {
    async function getPrice() {
      try {
        setGetPriceLoading(true)
        const { price } = await getMintCommunityPrice(mintNetwork)
        setPrice(price || 0)
        setGasFee(0)
        setGetPriceLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    getPrice()
  }, [brandName, mintNetwork])

  useEffect(() => {
    handleRefreshBrandChainID()
  }, [brandName])

  useEffect(() => {
    const [s1 = '', s2 = ''] = (crossChainMintSetting.signature.trim()).split('_')
    setAdvanceMintSetting({
      mintTo: crossChainMintSetting.mintTo.trim() || '',
      signature: s1
    })
    setOmninodeAdvanceMintSetting({
      mintTo: crossChainMintSetting.omninodeMintTo.trim() || '',
      signature: s2
    })
  }, [crossChainMintSetting.signature, crossChainMintSetting.mintTo, crossChainMintSetting.omninodeMintTo])


  useEffect(() => {
    const runStep = async () => {
      // omninode state polling
      if (brandChainId && brandChainId !== CHAIN_ID) {
        if (omniNodeState) {
          setFirstLoading(false)
          setOmniLoading(true)
          await sleep(1500)
          setStep(2)
          setOmniLoading(false)
        } else {
          if (step === 0) {
            setFirstLoading(true)
            await sleep(1500)
            setStep(1)
            setFirstLoading(false)
          }
        }
      }
    }
    runStep()
    return () => {
      setOmniNodeState(false)
    }
  }, [brandChainId, omniNodeState])

  return (
    <>
      {
        step === 0 && (
          <CommunityMintStatus
            brandName={brandName || ''}
            loading={firstLoading || brandChainIdLoading}
            disabled={!isMintHandleValid}
            mintNetwork={mintNetwork}
            handleNext={handleFirst}
            step={<Steps className='mt-[30px]' step={0} steps={steps}/>}
          >
            <Fragment>
              <DividerLine className='mt-[30px] mb-4' />
              <ul className='flex flex-col gap-[7px] w-full'>
                {
                  mintLabels.map(({ label, text }, idx) => {
                    return (
                      <li
                        key={idx}
                        className='flex-itmc justify-between py-3 px-[30px] gap-[30px] text-md !font-medium border-s1'
                      >
                        <span>{ label }</span>
                        <span className='flex-1 text-right whitespace-nowrap text-ellipsis overflow-hidden'>{ text }</span>
                      </li>
                    )
                  })
                }
              </ul>
            </Fragment>
          </CommunityMintStatus>
        )
      }
      {
        step === 1 && (
          <CommunityMintStart
            brandName={brandName || ''}
            omninodeAdvanceMintSetting={omninodeAdvanceMintSetting}
            omninodeSignatureValidator={omninodeSignatureValidator}
            price={price}
            gasFee={gasFee}
            loading={omniLoading}
            mintNetwork={mintNetwork}
            brandChainId={brandChainId}
            handleDeployed={handleOmninodeDeployed}
            disabled={!isMintHandleValid}
            handleRefreshBrandChainId={handleRefreshBrandChainID}
            step={<Steps className='mt-[30px] px-[60px] sm:px-3' step={1} steps={steps}/>}
          >
            <Fragment>
              <DividerLine className='my-4' />
              <ul className='flex flex-col gap-[7px] w-full'>
                {
                  registerLabels.map(({ label, text }, idx) => {
                    return (
                      <li
                        key={idx}
                        className='flex-itmc justify-between py-3 px-[30px] gap-[30px] text-md !font-medium border-s1'
                      >
                        <span>{ label }</span>
                        <span className='flex-1 text-right whitespace-nowrap text-ellipsis overflow-hidden'>{ text }</span>
                      </li>
                    )
                  })
                }
              </ul>
            </Fragment>
          </CommunityMintStart>
        )
      }
      {
        step === 2 && (
          <CommunitySuccess
            account={account}
            brandName={brandName || ''}
            price={price}
            gasFee={gasFee}
            mintNetwork={mintNetwork}
            step={<Steps className='mt-[30px] px-[60px] sm:px-3' step={2} steps={steps}/>}
            advanceMintSetting={advanceMintSetting}
            signatureValiditor={mintSignatureValidator}
            disabled={!isMintHandleValid}
            handleReleased={() => {
              location.reload()
            }}
          >
            <Fragment>
              <DividerLine className='my-4' />
              <ul className='flex flex-col gap-[7px] w-full'>
                {
                  mintLabels.map(({ label, text }, idx) => {
                    return (
                      <li
                        key={idx}
                        className='flex-itmc justify-between py-3 px-[30px] gap-[30px] text-md !font-medium border-s1'
                      >
                        <span>{ label }</span>
                        <span className='flex-1 text-right whitespace-nowrap text-ellipsis overflow-hidden'>{ text }</span>
                      </li>
                    )
                  })
                }
              </ul>
            </Fragment>
          </CommunitySuccess>
        )
      }
    </>
  )
}

export default MobileBrandMint

interface CommunityMintInfoProps {
  mintNetwork: number
  price: number | BigNumber
  gasFee: number | BigNumber
  coinSymbol: string
  owner: string
  label?: string
}
const CommunityMintInfo: FC<CommunityMintInfoProps> = ({ mintNetwork, price, gasFee, coinSymbol, owner, label = '1 year registration price' }) => {

  const infoList = [
    {
      label: 'Action',
      text: 'Deploy Brand DID'
    },
    {
      label: 'Network',
      text: CHAINS_ID_TO_NETWORK[mintNetwork]
    },
    {
      label: 'Duration',
      text: '1 year'
    },
    {
      label: 'Owner',
      text: owner
    }
  ]

  const mintPrice = formatPrice(price)

  return (
    <Fragment>
      <div className='mt-[30px] w-full flex flex-col gap-[7px]'>
        {
          infoList.map(({ label, text }, idx) => {
            return (
              <div key={idx} className='flex items-center px-[30px] py-[12px] text-mintProfileLabel border-solid border-[1px] border-info-gray rounded-[6px]'>
                <span className='flex-1 text-mintLabelGray'>{ label }</span>
                <span className='text-secondaryBlack'>{ text }</span>
              </div>
            )
          })
        }
      </div>
      <div className='mt-[30px] w-full flex flex-col gap-[10px] px-[30px] py-[16px] text-mintTipDesc text-mainGray rounded-[6px] bg-tag'>
        <div className='flex items-center'>
          <p className='flex-1'>{ label }</p>
          <p>{ mintPrice } {coinSymbol}</p>
        </div>
      </div>
    </Fragment>
  )
}
