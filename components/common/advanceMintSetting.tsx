import { FC, useState, useEffect, use } from 'react'
import classNames from 'classnames'

import LabelInput from '@/components/common/labelInput'

interface Props {
  className?: string
  value?: { mintTo: string, signature: string }
  mintToPlaceholder?: string
  hiddenSignature?: boolean
  hiddenMintTo?: boolean
  disabledMintTo?: boolean
  onChange?: (v: { mintTo: string, signature: string }) => void
}

const signatureTip = `If this is a private community, your should enter the signed message provided by your community in the "Generate Invited Code" field to verify your identity.`
const mintToTip = `If you would like to mint the NFT to a different wallet, please enter the address in the "Mint to" field (default is the current address).`

const AdvancedMintSetting: FC<Props> = ({ className, value = { mintTo: '', signature: '' }, mintToPlaceholder = '0x...', hiddenSignature, hiddenMintTo, disabledMintTo, onChange }) => {

  const [mintTo, setMintTo] = useState(value.mintTo || '')
  const [signature, setSignature] = useState(value.signature || '')

  useEffect(() => {
    onChange && onChange({
      mintTo,
      signature
    })
  }, [mintTo, signature])

  useEffect(() => {
    setMintTo(value?.mintTo || '')
    setSignature(value?.signature || '')
  }, [value?.mintTo, value?.signature])

  return (
    <div className={classNames('flex flex-col gap-[30px]', className)}>
      {
        hiddenSignature ? null : (
          <LabelInput
            label='Invited Code:'
            tooltip={signatureTip}
            primary
            value={signature}
            placeholder='input your Invited Code...'
            handleChange={(value) => {
              setSignature(String(value))
            }}
          />
        )
      }
      {
        hiddenMintTo ? null : (
          <div className={
            classNames('flex justify-center')
          }>
            <LabelInput
              label='Mint to:'
              tooltip={mintToTip}
              value={mintTo}
              placeholder={mintToPlaceholder}
              disabled={disabledMintTo}
              handleChange={(value) => {
                setMintTo(String(value))
              }}
            />
          </div>
        )
      }
    </div>
  )
}

export default AdvancedMintSetting