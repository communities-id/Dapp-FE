import { useState } from 'react'
import Link from 'next/link'

import { useDetails } from '@/contexts/details'
import { useRoot } from '@/contexts/root'
import { useWallet } from '@/hooks/wallet'
import { bindTelegramGrouop } from '@/shared/apis'
import { TG_BOT_NAME } from '@/shared/constant'

import Button from "@/components/_common/button"
import Input from "@/components/_common/input"

import TGBotLogo from '~@/_brand/tgbot-logo.svg'

import { CommunityInfo } from '@/types'

interface Props {
  brandInfo: Partial<CommunityInfo>
}

export default function BrandMannageSocialLink({ brandInfo }: Props) {
  const { getSigner } = useWallet()
  const { message } = useRoot()
  
  const [loading, setLoading] = useState(false)
  const [groupId, setGroupId] = useState('')

  const tgBotLink = `https://t.me/${TG_BOT_NAME}?startgroup=1`

  async function bindTGGroup() {
    try {
      setLoading(true)
      const signer = await getSigner()
      if (!signer) {
        message({ type: 'warning', content: 'Cannot get signer' }, { t: 'brand-tg-bind', i: 1 })
        return
      }
      const signature = await signer.signMessage('CommunitiesID')
      const res = await bindTelegramGrouop(signature, brandInfo.node?.node as string, groupId || '')
      if (res.code !== 0) {
        message({ type: 'error', content: `Bind telegram error: ${res.message}` }, { t: 'brand-tg-bind', k: signer._address, i: 2 })
        return
      }
      message({ type: 'success', content: 'Bind success' }, { t: 'brand-tg-bind', k: signer._address })
    } catch(e: any) {
      message({ type: 'error', content: `Bind telegram error: ${e.message}` }, { t: 'brand-tg-bind', i: 3 })
      return
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="modal-content-container modal-content">
      <h1 className='text-main-black text-xl'>Link Telegram Group</h1>
      <div className='w-full mt-[30px] p-[30px] bg-gray-6 rounded-md'>
        <div className="flex flex-col gap-[30px] text-main-black">
          <div>
            <div>
              <b>Step 1:</b>
              <span> Add CommunitiesID Telegram bot to your group and set it as an administrator.</span>
            </div>
            <div className="mt-[14px] flex items-center gap-[14px]">
              <div className="w-20 h-20 bg-black rounded-full overflow-hidden">
                <TGBotLogo width='80' height='80' />
              </div>
              <Link href={tgBotLink} target='_blank'>
                <Button
                  className="w-[292px] var-brand-bgcolor"
                  size="medium"
                >Add</Button>
              </Link>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-3"></div>
          <div>
            <div>
              <b>Step 2:</b>
              <span> Fill the group ID you got from the Telegram bot:</span>
            </div>
            <p className="mt-2 text-xs text-black-tr-40">Note: To change your group, just link the new group ID;</p>
            <div className="mt-[14px] flex items-center gap-[10px]">
              <Input
                inputclassname='!w-[260px]'
                placeholder="Enter Telegram GroupID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
              <Button
                className="w-30 !rounded-xs var-brand-bgcolor"
                size="medium"
                disabled={loading || !groupId}
                loading={loading}
                onClick={bindTGGroup}
              >Link</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}