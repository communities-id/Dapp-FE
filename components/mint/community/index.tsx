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

import CommunityMintStatus from '@/components/mint/community/status'
import CommunityMintStart from '@/components/mint/community/register'
import CommunitySuccess from '@/components/mint/community/latest'
import Steps from '@/components/common/steps'
import AdvancedMintSetting from '@/components/common/advanceMintSetting'
import InvitedCodeForm from '@/components/common/invitedCode'
import DividerLine from '@/components/common/dividerLine'

interface Props {
}

const CommunityMint: FC<Props> = () => {
  const { address: account } = useWallet()
  const searchParam = useSearchParams()
  const { keywords, community, communityInfo } = useDetails()
  const { masterAddress } = useConfiguration()
  const [step, setStep] = useState(0)
  const { message } = useRoot()
  const { getMintCommunityPrice } = useApi()
  const { verifyCommunityTypedMessage, verifyCommunityOmninodeTypedMessage } = useSignUtils()

  const [price, setPrice] = useState<number | BigNumber>(0)
  const [gasFee, setGasFee] = useState<number | BigNumber>(0)
  const [mintNetwork, setMintNetwork] = useState(communityInfo?.chainId || MAIN_CHAIN_ID)
  const [omniNodeState, setOmniNodeState] = useState(false)
  const [getPriceLoading, setGetPriceLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(false)
  const [omniLoading, setOmniLoading] = useState(false)

  const [advanceMintSetting, setAdvanceMintSetting] = useState<{mintTo: string, signature: string}>({
    mintTo: '',
    signature: ''
  })
  const [omninodeAdvanceMintSetting, setOmninodeAdvanceMintSetting] = useState<{mintTo: string, signature: string}>({
    mintTo: '',
    signature: ''
  })
  const [crossChainMintSetting, setCrossChainMintSetting] = useState<{mintTo: string, omninodeMintTo: string, signature: string}>({
    mintTo: '',
    omninodeMintTo: '',
    signature: ''
  })

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

  const isTargetMainnetWork = useMemo(() => {
    return mintNetwork === MAIN_CHAIN_ID
  }, [mintNetwork])

  const coinSymbol = communityInfo?.communityCoinSymbol || DEFAULT_TOKEN_SYMBOL[mintNetwork]

  // community mint signature validator
  const mintSignatureValidator = useMemo(() => {
    if (!communityInfo) return { powerful: false, designated: false }
    const { CommunityRegistryInterface } = CONTRACT_MAP[mintNetwork]
    if (!advanceMintSetting.signature || !masterAddress) return { powerful: false, designated: false }
    console.log('---- verify community mint signature ----', advanceMintSetting.signature, masterAddress, community, advanceMintSetting.mintTo, CommunityRegistryInterface, { chainId: mintNetwork })
    return verifyCommunityTypedMessage(advanceMintSetting.signature, masterAddress, community, advanceMintSetting.mintTo, CommunityRegistryInterface, { chainId: mintNetwork })
  }, [advanceMintSetting.signature, advanceMintSetting.mintTo, community, communityInfo, masterAddress, mintNetwork])

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
    if (isTargetMainnetWork) return { powerful: false, designated: false }
    console.log('omninodeSignatureValidator', omninodeAdvanceMintSetting.signature, '- omninodeAdvanceMintSetting', omninodeAdvanceMintSetting, verifyCommunityOmninodeTypedMessage(omninodeAdvanceMintSetting.signature, masterAddress, community, omninodeAdvanceMintSetting.mintTo, { chainId: mintNetwork }))
    if (!omninodeAdvanceMintSetting.signature || !masterAddress) return { powerful: false, designated: false }
    return verifyCommunityOmninodeTypedMessage(omninodeAdvanceMintSetting.signature, masterAddress, community, omninodeAdvanceMintSetting.mintTo, { chainId: mintNetwork })
  }, [omninodeAdvanceMintSetting.signature, omninodeAdvanceMintSetting.mintTo, community, mintNetwork, isTargetMainnetWork, masterAddress])

  // omninode register validator
  const isOmninodeMintValid = useMemo(() => {
    if (isTargetMainnetWork) return true
    const { powerful, designated } = omninodeSignatureValidator
    return powerful || designated
  }, [omninodeSignatureValidator, isTargetMainnetWork])

  const isMintHandleValid = useMemo(() => {
    if (isTargetMainnetWork) return isCommunityMintValid
    return isOmninodeMintValid && isCommunityMintValid
  }, [isTargetMainnetWork, isCommunityStartValid, isOmninodeMintValid, isCommunityMintValid])

  const handleFirst = async () => {
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
  }, [keywords, mintNetwork])

  // testnet mint signature
  useEffect(() => {
    const querySignature = decodeURIComponent(searchParam.get('signature') || '')
    const queryAddress = decodeURIComponent(searchParam.get('address') || '')
    const queryOwner = decodeURIComponent(searchParam.get('owner') || '')
    const chainId = decodeURIComponent(searchParam.get('chainId')?.trim() || '')
    if (querySignature) {
      setCrossChainMintSetting({
        mintTo: queryAddress || '',
        omninodeMintTo: queryOwner || '',
        signature: decodeURIComponent(querySignature).trim() || ''
      })

      setMintNetwork(Number(chainId || CHAIN_ID))

      return
    }

    if (process.env.NEXT_PUBLIC_IS_TESTNET !== 'true' || !account) return
    if (!communityInfo || (account && !isAddress(account))) return

    // advance mint signature
    fetch(`/api/sign/mint?name=${community}&chainId=${mintNetwork}&owner=${account}`)
      .then(res => res.json())
      .then(res => {
        console.log(res, {
          mintTo: account,
          signature: res.data
        })
        const { signature } = res.data
        setCrossChainMintSetting({
          mintTo: '',
          omninodeMintTo: account,
          signature: signature
        })
      })
  }, [community, mintNetwork, communityInfo, account])

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
      if (communityInfo?.chainId && communityInfo?.chainId !== CHAIN_ID) {
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
  }, [communityInfo?.chainId, omniNodeState])

  return (
    <>
      {
        step === 0 && (
          <CommunityMintStatus
            loading={firstLoading}
            disabled={!isMintHandleValid}
            mintNetwork={mintNetwork}
            handleNext={handleFirst}
            handleNetworkChange={(network) => {
              setMintNetwork(network)
            }}
            step={<Steps className='mt-[30px] px-[60px] sm:px-3' step={0} steps={steps}/>}
            extra={
              <InvitedCodeForm
                value={crossChainMintSetting.signature}
                handleChange={(signature) => {
                  setCrossChainMintSetting(prev => ({ ...prev, signature }))
                }}
              />
              // isTargetMainnetWork && (
              //   <InvitedCodeForm
              //     value={advanceMintSetting.signature}
              //     handleChange={(signature) => {
              //       setAdvanceMintSetting(prev => ({ ...prev, signature }))
              //     }}
              //   />
              // )
            }
          >
            <Fragment>
              <DividerLine className='my-4' />
              <AdvancedMintSetting
                className='w-full'
                value={advanceMintSetting}
                mintToPlaceholder={mintToPlaceholder}
                hiddenSignature
                // disabledMintTo={mintSignatureValidator.powerful}
                onChange={v => setAdvanceMintSetting(v)}
              />
            </Fragment>
            {/* {
              isTargetMainnetWork && (
                <Fragment>
                  <DividerLine className='my-4' />
                  <AdvancedMintSetting
                    className='w-full'
                    value={advanceMintSetting}
                    mintToPlaceholder={mintToPlaceholder}
                    hiddenSignature
                    // disabledMintTo={mintSignatureValidator.powerful}
                    onChange={v => setAdvanceMintSetting(v)}
                  />
                </Fragment>
              )
            } */}
          </CommunityMintStatus>
        )
      }
      {
        step === 1 && (
          <CommunityMintStart
            omninodeAdvanceMintSetting={omninodeAdvanceMintSetting}
            omninodeSignatureValidator={omninodeSignatureValidator}
            price={price}
            gasFee={gasFee}
            loading={omniLoading}
            mintNetwork={mintNetwork}
            handleDeployed={handleOmninodeDeployed}
            disabled={!isMintHandleValid}
            step={<Steps className='mt-[30px] px-[60px] sm:px-3' step={1} steps={steps}/>}
            extra={
              <InvitedCodeForm
                value={crossChainMintSetting.signature}
                handleChange={(signature) => {
                  setCrossChainMintSetting(prev => ({ ...prev, signature }))
                }}
              />
              // !isTargetMainnetWork && (
              //   <InvitedCodeForm
              //     value={crossChainMintSetting.signature}
              //     handleChange={(signature) => {
              //       setCrossChainMintSetting(prev => ({ ...prev, signature }))
              //     }}
              //   />
              // )
            }>
            <Fragment>
              <DividerLine className='my-4' />
              {/* don't set mintTo for omninode, so show advanceMintSetting in there too */}
              <AdvancedMintSetting
                className='w-full'
                value={advanceMintSetting}
                mintToPlaceholder={mintToPlaceholder}
                hiddenSignature
                // disabledMintTo={mintSignatureValidator.powerful}
                onChange={v => setAdvanceMintSetting(v)}
              />
            </Fragment>
            <CommunityMintInfo
              mintNetwork={mintNetwork}
              price={price}
              gasFee={gasFee}
              // coinSymbol={DEFAULT_TOKEN_SYMBOL[mintNetwork]}
              coinSymbol={coinSymbol}
              owner={advanceMintSetting.mintTo || account!}
              label='Deploy gas fee'/>
          </CommunityMintStart>
        )
      }
      {
        step === 2 && (
          <CommunitySuccess
            price={price}
            gasFee={gasFee}
            mintNetwork={mintNetwork}
            step={<Steps className='mt-[30px] px-[60px] sm:px-3' step={2} steps={steps}/>}
            extra={
              <InvitedCodeForm
                value={crossChainMintSetting.signature}
                handleChange={(signature) => {
                  setCrossChainMintSetting(prev => ({ ...prev, signature }))
                }}
              />
              // !isTargetMainnetWork && (
              //   <InvitedCodeForm
              //     value={crossChainMintSetting.signature}
              //     handleChange={(signature) => {
              //       setCrossChainMintSetting(prev => ({ ...prev, signature }))
              //     }}
              //   />
              // )
            }
            advanceMintSetting={advanceMintSetting}
            signatureValiditor={mintSignatureValidator}
            disabled={!isMintHandleValid}
            handleReleased={() => {
              location.reload()
            }}
          >
            <Fragment>
              <DividerLine className='my-4' />
              {/* don't set mintTo for omninode, so show advanceMintSetting in there too */}
              <AdvancedMintSetting
                className='w-full'
                value={advanceMintSetting}
                mintToPlaceholder={mintToPlaceholder}
                hiddenSignature
                // disabledMintTo={mintSignatureValidator.powerful}
                onChange={v => setAdvanceMintSetting(v)}
              />
            </Fragment>
            <CommunityMintInfo
              mintNetwork={mintNetwork}
              price={price}
              gasFee={gasFee}
              // coinSymbol={String(communityInfo?.communityCoinSymbol)}
              coinSymbol={coinSymbol}
              owner={advanceMintSetting.mintTo || account!}
            />
            {/* {
              !isTargetMainnetWork &&
                <AdvancedMintSetting
                  className='w-full'
                  value={advanceMintSetting}
                  mintToPlaceholder={mintToPlaceholder}
                  hiddenSignature
                  // disabledMintTo={mintSignatureValidator.powerful}
                  onChange={v => setAdvanceMintSetting(v)}
                />
            } */}
          </CommunitySuccess>
        )
      }
    </>
  )
}

export default CommunityMint

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
