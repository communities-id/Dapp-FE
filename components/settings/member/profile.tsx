import { FC } from 'react'

import Input from '@/components/common/input'

import TwitterIcon from '~@/icons/social/twitter.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'

export type MemberProfileLabels = 'externalUrl' | 'discord' | 'twitter' | 'telegram'

interface MemberProfileProps {
  form: Record<MemberProfileLabels, string>
  loading: boolean
  handleChange?: (name: MemberProfileLabels, value: string) => void
}

const MemberProfile: FC<MemberProfileProps> = ({ form, loading, handleChange }) => {

  const forms: {
    type: 'text' | 'textarea',
    name: MemberProfileLabels,
    label: string,
    placeholder: string,
    unit: string,
    startIcon?: JSX.Element,
    preview?: (v: any) => any
  }[] = [
    {
      type: 'text',
      name: 'externalUrl',
      label: 'Website',
      placeholder: 'https://',
      unit: 'Url',
    },
    {
      type: 'text',
      name: 'discord',
      label: 'Discord',
      placeholder: 'Discord userID',
      unit: 'ID',
      startIcon: <DiscordIcon width='24' height='24' />,
    },
    {
      type: 'text',
      name: 'twitter',
      label: 'Twitter',
      placeholder: 'Twitter userID',
      unit: 'ID',
      startIcon: <TwitterIcon width='24' height='24' />,
    },
    {
      type: 'text',
      name: 'telegram',
      label: 'Telegram',
      placeholder: 'Telegram link',
      unit: 'ID',
      startIcon: <TelegramIcon width='24' height='24' />,
    },
  ]

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-[10px]">
      <ul className='w-full flex flex-col gap-[24px]'>
        {
          forms.map((item, index) => {
            return (
              <li key={index} className='w-full'>
                <p className='flex items-center justify-between'>
                  <span className='text-mintTipTitle text-mintLabelGray'>{ item.label }</span>
                  <span className='text-mintUnit text-mainGray'>{ item.unit }</span>
                </p>
                <div className='mt-[10px] w-full'>
                  {
                    item.type === 'textarea' ? (
                      <Input
                        multiline
                        rows={4}
                        placeholder={item.placeholder}
                        value={form[item.name]}
                        disabled={loading}
                        onChange={(e) => {
                          handleChange?.(item.name, e.target.value)
                        }}
                      />
                    ) : (
                      <Input
                        value={form[item.name]}
                        placeholder={item.placeholder}
                        disabled={loading}
                        onChange={(e) => {
                          handleChange?.(item.name, e.target.value)
                        }}
                      />
                    )
                  }
                  { item.preview && form[item.name] && item.preview(form[item.name])}
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default MemberProfile