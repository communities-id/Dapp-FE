import { FC, useEffect, useState } from 'react'

import Dialog from '@/components/common/dialog'
import { useWallet } from '@/hooks/wallet'
import useAccount from '@/shared/useWallet'
import Input from '@/components/common/input'
import { useRoot } from '@/contexts/root'
import { bindTelegramUser, getTelegramUser } from '@/shared/apis'
import { TG_BOT_NAME } from '@/shared/constant'
 
interface Props {
  open: boolean
  handleClose?: () => void
}

const MemberBindTelegram: FC<Props> = ({ open, handleClose }) => {
  const { getSigner } = useWallet()
  const { message } = useRoot()
  const { account } = useAccount()
  
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    async function getTGUserID() {
      const res = await getTelegramUser(account as string)
      if (res.data) {
        setUserId(res.data.userId)
      }
    }

    if (account) {
      getTGUserID()
    }
  }, [account])

  function jumoToTG() {
    window.open(`https://t.me/${TG_BOT_NAME}?start=1`)
  }

  async function bindTGUser() {
    try {
      setLoading(true)
      const signer = await getSigner()
      if (!signer) {
        message({ type: 'warning', content: 'Cannot get signer' }, { t: 'member-tg-bind', i: 1 })
        return
      }
      const signature = await signer.signMessage('CommunitiesID')
      const res = await bindTelegramUser(signature, userId, account as string)
      if (res.code !== 0) {
        message({ type: 'error', content: `Bind telegram error: ${res.message}` }, { t: 'member-tg-bind', k: signer._address, signature, i: 2 })
        return
      }
      message({ type: 'success', content: 'Bind success' }, { t: 'member-tg-bind', k: signer._address, signature })
    } catch(e: any) {
      message({ type: 'error', content: `Bind telegram error: ${e.message}` }, { t: 'member-tg-bind', i: 3 })
      return
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog
      open={open}
      title='Bind Temegram'
      center={false}
      loading={loading}
      disableCloseBtn
      confirmText='Bind Temegram'
      handleClose={handleClose}
      handleConfirm={bindTGUser}
    >
      <p>Step1: Add CommunitiesID Telegram bot to your chat</p>
      <button className="mt-[10px] mb-[30px] py-[6px] min-w-[110px] h-[46px] !shadow-none text-mintBtn rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed w-full text-white bg-mintPurple hover:text-white hover:bg-mintPurpleHover" onClick={jumoToTG}>Add</button>
      <p className='mb-[10px]'>Step2: Fill the user id you got from telegram bot:</p>
      <Input placeholder='User ID' value={userId} onChange={e => setUserId(e.target.value)} />
    </Dialog>
  )
}

export default MemberBindTelegram