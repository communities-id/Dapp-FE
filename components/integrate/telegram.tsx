import { FC, useEffect, useState } from 'react'
import Link from 'next/link'

import { useWallet } from '@/hooks/wallet'
import useAccount from '@/shared/useWallet'
import { useRoot } from '@/contexts/root'
import { bindTelegramUser, getTelegramUser } from '@/shared/apis'
import { TG_BOT_NAME } from '@/shared/constant'

import LabelInput from '@/components/common/labelInput'
import StepLite from '@/components/common/stepLite'
import ConnectButton from '@/components/common/connectButton'
import DividerLine from '@/components/common/dividerLine'

import BotIcon from '~@/icons/bot.svg'

interface Props {

}

const TelegramIntegrate: FC<Props> = () => {
  const { message } = useRoot()
  const { account } = useAccount()
  const { getSigner } = useWallet()

  const totalStep = 2
  const [step, setStep] = useState(1)
  const [telegramUserId, setTelegramUserId] = useState('')
  const [bindLoading, setBindLoading] = useState(false)

  const botLink = `https://t.me/${TG_BOT_NAME}?start=1`

  async function bindTGUser() {
    try {
      setBindLoading(true)
      const signer = await getSigner()
      if (!signer) {
        message({ type: 'warning', content: 'Cannot get signer' }, { t: 'member-tg-bind', i: 1 })
        return
      }
      const signature = await signer.signMessage('CommunitiesID')
      const res = await bindTelegramUser(signature, telegramUserId, account as string)
      if (res.code !== 0) {
        message({ type: 'error', content: `Bind telegram error: ${res.message}` }, { t: 'member-tg-bind', k: signer._address, i: 2 })
        return
      }
      message({ type: 'success', content: 'Bind success' }, { t: 'member-tg-bind', k: signer._address })
    } catch(e: any) {
      message({ type: 'error', content: `Bind telegram error: ${e.message}` }, { t: 'member-tg-bind', i: 3 })
      return
    } finally {
      setBindLoading(false)
    }
  }

  useEffect(() => {
    async function getTGUserID() {
      const res = await getTelegramUser(account as string)
      if (res.data) {
        setTelegramUserId(res.data.userId)
      }
    }

    if (account) {
      getTGUserID()
    }
  }, [account])
  
  return (
    <div className='rounded-[10px] bg-white p-6'>
      <h2 className='text-integrate-tit text-secondaryBlack'>Telegrame Connect</h2>
      <div className='mt-[32px] flex flex-col'>
        <div className='min-h-[82px]'>
          {
            step === 1 && (
              <div>
                <p>1. Add CommunitiesID Telegram bot to your chat:</p>
                <div className='mt-4 flex items-end gap-2 text-secondaryBlack'>
                  <BotIcon width='28' height='28' />
                  <Link
                    href={botLink}
                    target='_blank'
                    className='underline underline-offset-2'>CommunitiesID</Link>
                </div>
              </div>
            )
          }
          {
            step === 2 && (
              <LabelInput
                label='2. Fill the user id you got from telegram bot:'
                value={telegramUserId}
                placeholder='input your telegram userID here...'
                handleChange={(value) => {
                  console.log(value)
                  setTelegramUserId(value as string)
                }}
              />
            )
          }
        </div>
        <DividerLine wrapClassName='my-4' />
        <div className='pl-2 flex items-center justify-between'>
          <StepLite
            label={`Step ${step} of ${totalStep}`}
            step={step}
            totalStep={totalStep}
            handleChangeStep={setStep}
          />
          <ConnectButton
            size='auto'
            theme='purple'
            className='px-[34px]'
            disabled={step === 2 && !telegramUserId}
            loading={bindLoading}
            onClick={() => {
              if (step === 1) {
                setStep(2)
                return
              }
              bindTGUser()
            }}
          >
            { step === 1 ? 'Next' : 'Connect' }
          </ConnectButton>
        </div>
      </div>
    </div>
  )
}

export default TelegramIntegrate