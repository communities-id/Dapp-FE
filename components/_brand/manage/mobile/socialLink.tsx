import { CSSProperties, useEffect, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'

import { useDIDContent } from '@/hooks/content'
import { useRoot } from '@/contexts/root'
import { useWallet } from '@/hooks/wallet'
import { bindTelegramGrouop } from '@/shared/apis'
import { TG_BOT_NAME } from '@/shared/constant'

import MobileBrandManageLayout from '@/layouts/brand/mobileManage'
import Button from "@/components/_common/button"
import Input from "@/components/_common/input"

import { CommunityInfo } from '@/types'

import TGBotLogo from '~@/_brand/tgbot-logo.svg'

interface Props {
  account?: string
  brandName?: string
  brandInfo?: Partial<CommunityInfo>
  onClose?: () => void
}
export default function MobileBrandMannageSocialLinkContent({ account, brandName, brandInfo: inputBrandInfo, onClose }: Props) {
  const { brandInfo, brandInfoLoading } = useDIDContent({ brandName, brandInfo: inputBrandInfo  })

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
    <MobileBrandManageLayout
      title='Link Telegram Group'
      brandColor={brandInfo?.tokenUri?.brand_color}
      onClose={onClose}
    >
      <div className='w-full px-5 py-[30px] bg-gray-6 rounded-md'>
        <div className="flex flex-col gap-[30px]">
          <div>
            <div>
              <b>Step 1:</b>
              <span> Add CommunitiesID Telegram bot to your group and set it as an administrator.</span>
            </div>
            <div className="mt-5 flex-center flex-col gap-[18px]">
              <div className="w-20 h-20 bg-black rounded-full overflow-hidden">
                <TGBotLogo width='80' height='80' />
              </div>
              <Link href={tgBotLink} target='_blank'>
                <Button
                  className="w-[210px] var-brand-bgcolor"
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
            <div className="mt-5 flex-center flex-col gap-[10px]">
              <Input
                inputclassname='!w-full'
                placeholder="Enter Telegram GroupID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
              <Button
                wrapClassName="!w-full"
                className="w-full !rounded-xs var-brand-bgcolor"
                size="medium"
                loading={loading}
                onClick={bindTGGroup}
              >Link</Button>
            </div>
          </div>
        </div>
      </div>
    </MobileBrandManageLayout>
  )
}