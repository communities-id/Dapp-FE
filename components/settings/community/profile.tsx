import { FC, useMemo } from 'react'
import classNames from 'classnames'

import Input from '@/components/common/input'
// import Banner from '@/components/search/banner'
// import AvatarCard from '@/components/common/avatar'
import IpfsUploader from '@/components/common/ipfsUploader'

import TwitterIcon from '~@/icons/social/twitter.svg'
import TelegramIcon from '~@/icons/social/telegram.svg'
import DiscordIcon from '~@/icons/social/discord.svg'

export type CommunityProfileLabels = 'image' | 'brandImage' | 'backgroundColor' | 'description' | 'externalUrl' | 'discord' | 'twitter' | 'telegram'

interface CommunityProfileProps {
  form: Record<CommunityProfileLabels, string>
  validation: Record<string, string | undefined>
  loading: boolean
  handleChange?: (name: CommunityProfileLabels, value: string) => void
}

const CommunityProfile: FC<CommunityProfileProps> = ({ form, validation, loading, handleChange }) => {

  const forms: {
    type: 'text' | 'textarea',
    name: CommunityProfileLabels,
    label: string,
    placeholder: string,
    unit: string,
    action?: 'upload',
    size?: 'large' | 'normal',
    layout?: 'normal' | 'inline',
    startIcon?: JSX.Element,
    preview?: (v: any) => any
  }[] = [
    {
      type: 'text',
      name: 'image',
      label: 'Avatar',
      placeholder: 'https://',
      unit: 'Url',
      action: 'upload',
      size: 'large',
      layout: 'inline'
    },
    {
      type: 'text',
      name: 'brandImage',
      label: 'Banner image',
      placeholder: 'https://',
      unit: 'Url',
      action: 'upload'
    },
    {
      type: 'text',
      name: 'backgroundColor',
      label: 'Brand Color',
      placeholder: '#000000 - #FFFFFF',
      unit: 'hex',
      preview: v => <div className="w-6 h-6 mt-2" style={{backgroundColor: v}}></div>
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Bio',
      placeholder: 'bio',
      unit: 'Bio',
    },
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
      label: 'Discord invite link',
      placeholder: 'https://discord.gg/[invite]',
      unit: 'Url',
      startIcon: <DiscordIcon width='24' height='24' />,
    },
    {
      type: 'text',
      name: 'twitter',
      label: 'Twitter link',
      placeholder: 'https://twitter.com/[id]',
      unit: 'Url',
      startIcon: <TwitterIcon width='24' height='24' />,
    },
    {
      type: 'text',
      name: 'telegram',
      label: 'Telegram link',
      placeholder: 'https://t.me/[id]',
      unit: 'Url',
      startIcon: <TelegramIcon width='24' height='24' />,
    },
  ]

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-[10px]">
      <ul className='w-full flex flex-col gap-[24px]'>
        {
          forms.map((item, index) => {
            return (
              <li
                key={index}
                className={
                  classNames(
                    'w-full gap-[10px] flex',
                    {
                      'flex items-end': item.layout === 'inline',
                      'flex-col': item.layout !== 'inline',
                    }
                  )
                }
              >
                <div className='flex-1'>
                  <p className='flex items-center justify-between'>
                    <span className='text-mintTipTitle text-mintLabelGray'>{ item.label }</span>
                    <span className='text-mintUnit text-mainGray'>{ item.unit }</span>
                  </p>
                  <div className='mt-[10px]'>
                    {
                      item.type === 'text' && (
                        <Input
                          inputclassname={classNames({ 'py-[16px]': item.size === 'large' })}
                          value={form[item.name]}
                          placeholder={item.placeholder}
                          disabled={loading}
                          onChange={(e) => {
                            handleChange?.(item.name, e.target.value)
                          }}
                        />
                      )
                    }
                    {
                      item.type === 'textarea' && (
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
                      )
                    }
                  </div>
                </div>
                {
                  item.action && (
                    <div>
                      {
                        item.action === 'upload' && (
                          <div className={
                            classNames(
                              'rounded-[6px]', {
                                'w-[86px] h-[86px]': item.layout === 'inline',
                                'w-full h-[86px]': item.layout !== 'inline',
                              })
                          }>
                            <IpfsUploader
                              key={item.label}
                              defaultUrl={form[item.name]}
                              handleComplete={(url) => {
                                handleChange?.(item.name, url)
                              }}
                            />
                          </div>
                        )
                      }
                    </div>
                  )
                }
                { validation[item.name] && <p className="text-error">{validation[item.name]}</p> }
                { item.preview && form[item.name] && item.preview(form[item.name])}
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default CommunityProfile