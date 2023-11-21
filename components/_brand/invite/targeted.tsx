import { FC, useState } from 'react'
import classNames from 'classnames'

import Input from '@/components/_common/input'

import TipsIcon from '~@/_brand/tips.svg'

interface Props {

}

const TargetedInvitationCode: FC<Props> = () => {
  
  const [form, setForm] = useState<Record<string, string>>({
    memberName: '',
    mintTo: '',
  })

  const actions = [
    {
      label: 'Member name',
      value: form.memberName,
      placeholder: 'Enter member name',
      name: 'memberName',
    },
    {
      label: 'Mint to',
      value: form.mintTo,
      placeholder: 'Enter address or ENS name',
      name: 'mintTo',
    },
  ]

  const handleFormChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  return (
    <div className='mt-[10px] flex flex-col gap-5'>
      <div className='flex-itmc py-[3px] gap-1 text-orange-1 text-md bg-orange-tr-10 rounded-xs'>
        <TipsIcon width='14' height='14' className='' />
        <span className='flex-1'>Targeted invitation codes support allocation to specific IDs and are for one-time use only.</span>
      </div>
      <ul className="w-full flex flex-col">
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
                    onChange={(e) => handleFormChange(item.name, e.target.value)}
                  />
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default TargetedInvitationCode