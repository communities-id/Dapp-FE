import { FC } from 'react'

import Input from '@/components/common/input'

export type CommunitySignatureLabels = 'address' | 'name'

interface CommunitySignatureProps {
  community: string
  form: Record<CommunitySignatureLabels, string>
  loading: boolean
  validation: Record<string, string | undefined>
  handleChange?: (name: CommunitySignatureLabels, value: string) => void
}

const CommunitySignature: FC<CommunitySignatureProps> = ({ community, form, loading, validation, handleChange }) => {

  const forms: {
    type: 'text' | 'textarea',
    name: CommunitySignatureLabels,
    label: string,
    placeholder: string,
    unit: string,
    community?: string
    startIcon?: JSX.Element,
  }[] = [
    {
      type: 'text',
      name: 'name',
      label: 'Member name',
      placeholder: 'Member name',
      unit: '',
      community: `.${community}`,
    },
    {
      type: 'text',
      name: 'address',
      label: 'Mint to',
      placeholder: '0x...',
      unit: 'address',
    }
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
                        endAdornment={item.community}
                        onChange={(e) => {
                          handleChange?.(item.name, e.target.value)
                        }}
                      />
                    )
                  }
                </div>
                { validation[item.name] && <p className="text-error">{validation[item.name]}</p> }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default CommunitySignature