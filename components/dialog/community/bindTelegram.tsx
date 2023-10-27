import { FC, useEffect, useState } from 'react'

import Dialog from '@/components/common/dialog'
import { useWallet } from '@/hooks/wallet'
import Input from '@/components/common/input'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'
import { bindTelegramGrouop } from '@/shared/apis'
import { TG_BOT_NAME } from '@/shared/constant'
 
interface Props {
  open: boolean
  handleClose?: () => void
}

const CommunityBindTelegram: FC<Props> = ({ open, handleClose }) => {
  const { getSigner } = useWallet()
  const { message } = useRoot()
  const { communityInfo } = useDetails()
  
  const [loading, setLoading] = useState(false)
  const [groupId, setGroupId] = useState(communityInfo.tgGroupId)


  function jumoToTG() {
    window.open(`https://t.me/${TG_BOT_NAME}?startgroup=1`)
  }

  async function bindTGGroup() {
    try {
      setLoading(true)
      const signer = await getSigner()
      if (!signer) {
        message({ type: 'warning', content: 'Cannot get signer'})
        return
      }
      const signature = await signer.signMessage('CommunitiesID')
      const res = await bindTelegramGrouop(signature, communityInfo.node?.node as string, groupId || '')
      if (res.code !== 0) {
        message({ type: 'error', content: `Bind telegram error: ${res.message}`})
        return
      }
      message({ type: 'success', content: 'Bind success' })
    } catch(e: any) {
      message({ type: 'error', content: `Bind telegram error: ${e.message}`})
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
      handleConfirm={bindTGGroup}
    >
      <p>Step1: Add CommunitiesID Telegram bot to your group and set as an administator</p>
      <button className="mt-[10px] mb-[30px] py-[6px] min-w-[110px] h-[46px] !shadow-none text-mintBtn rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed w-full text-white bg-mintPurple hover:text-white hover:bg-mintPurpleHover" onClick={jumoToTG}>Add</button>
      <p className='mb-[10px]'>Step2: Fill the group id you got from telegram bot:</p>
      <Input placeholder='Group ID' value={groupId} onChange={e => setGroupId(e.target.value)} />
    </Dialog>
  )
}

export default CommunityBindTelegram