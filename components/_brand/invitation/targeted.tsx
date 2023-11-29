import { FC, use, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import { ZERO_ADDRESS } from '@communitiesid/id'
import { useRoot } from '@/contexts/root'
import { useSignUtils } from '@/hooks/sign'
import { useWallet } from '@/hooks/wallet'
import { execSearch } from '@/shared/helper'

import CopyToClipboard from 'react-copy-to-clipboard'
import Button from '@/components/_common/button'
import Input from '@/components/_common/input'

import TipsIcon from '~@/_brand/tips.svg'


interface Props {
  brand: string
  registry: string
  registryInterface: string
  chainId: number
}

const TargetedInvitationCode: FC<Props> = ({ brand, registry, registryInterface, chainId }) => {
  
  const { message, NetOps } = useRoot()
  const { getSigner } = useWallet()
  const { getMemberSignPayload } = useSignUtils()

  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState('')
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Record<'memberName' | 'mintTo', string>>({
    memberName: '',
    mintTo: '',
  })

  const boxRef = useRef<HTMLDivElement>(null)

  const disabled = !form.memberName || loading
  console.log("- disabled", disabled)

  function validateForm() {
    const rules: Record<string, (value: string) => string | undefined> = {
      memberName: (value: string) => {
        if (!value) {
          return 'Please enter a member name'
        }
      },
    }
    const results: Record<string, string | undefined> = {}
    for(let i in rules) {
      const result = rules[i]?.((form as any)[i])
      if (result) {
        results[i] = result
      }
    }
    return results
  }

  const actions = [
    {
      label: 'Member name',
      value: form.memberName,
      placeholder: 'Enter member name',
      name: 'memberName',
      endAdornment: (
        <div className='flex-itmc'>
          <div className='mx-5 h-4 w-[1px] bg-gray-7'></div>
          <span>.{ brand }</span>
        </div>
      )
    },
    {
      label: 'Mint to',
      value: form.mintTo,
      placeholder: 'Enter address',
      name: 'mintTo',
    },
  ]

  const handleSign = async () => {
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    setCopied(false)
    await NetOps.handleSwitchNetwork(chainId)
    if (!brand) return
    try {
      setLoading(true)
      const signer = await getSigner()
      if (!signer) {
        return
      }
      const { member } = execSearch(form.memberName)
      const name = member || form.memberName // if member name is not found, use the name directly

      // sign member to account, default to zero address (powerful)
      const { domain, types, commitment } = getMemberSignPayload(name, form.mintTo || ZERO_ADDRESS, registry, registryInterface, { chainId })
      const result = await signer._signTypedData(
        domain,
        types,
        commitment
      );
      setResult(result)
      setLoading(false)
    } catch (e: any) {
      console.log(e)
      message({
        type: 'error',
        content: 'Failed to generate signature: ' + e.message,
      }, { t: 'brand-generate-signature', k: form.memberName })
      setLoading(false)
    }
  }

  const handleFormChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const scrollToResultView = (top: number) => {
    console.log('-- scrollToResultView', top, '--dom', boxRef.current?.parentNode?.parentElement)
    boxRef.current?.parentNode?.parentElement?.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (result) {
      scrollToResultView(300)
    }
  }, [result])

  return (
    <div ref={boxRef} className='mt-[10px] px-[30px] pb-[30px] flex flex-col gap-5'>
      <div className='flex-itmc py-[3px] px-[10px] gap-1 text-orange-1 text-md bg-orange-tr-10 rounded-xs'>
        <TipsIcon width='14' height='14' className='' />
        <span className='flex-1'>Targeted invitation codes support allocation to specific IDs and are for one-time use only.</span>
      </div>
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
                    endAdornment={item.endAdornment}
                    onChange={(e) => handleFormChange(item.name, e.target.value)}
                  />
                </div>
              </li>
            )
          })
        }
        <li className='w-full flex-justc'>
          <Button
            className=''
            mode='full'
            theme='primary'
            loading={loading || NetOps.loading}
            disabled={disabled}
            size='medium'
            onClick={() => {
              handleSign()
            }}
          >Generate Invitiation Code</Button>
        </li>
      </ul>
      {
        result && (
          <div className='py-[10px] flex-center flex-col text-md-b !leading-5 border-t-[2px] border-dashed border-gray-7'>
            <p className='mt-[10px] text-black-tr-50'>Targeted Invitation code</p>
            <p className='mt-[10px] text-main-black break-all'>{ result }</p>
            <div className='mt-5 w-full flex-justc'>
              <CopyToClipboard text={result} onCopy={() => {
                setCopied(true)
              }}>
                <Button className='!h-[28px]' theme='black' size='small'>{ copied ? 'Copied' : 'Copy' }</Button>
              </CopyToClipboard>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default TargetedInvitationCode