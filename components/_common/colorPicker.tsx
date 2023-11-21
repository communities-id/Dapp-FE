import { FC, useEffect, useState } from 'react'
import classNames from 'classnames'

import { ChromePicker } from 'react-color'

import PencilIcon from '~@/_brand/pencil.svg'

const colors = [
  '#ffffff', '#3A5CC2', '#61ABD0', '#61B771', '#E4735B', '#ECBD41'
]

interface Props {
  value: string
  onChange?: (color: string) => void
}

const ColorPicker: FC<Props> = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className='flex items-center gap-[22px]'>
      <ul className='flex gap-[18px]'>
        {
          colors.map((color, idx) => {
            return (
              <li key={idx} className='leading-zero'>
                <ColorItem
                  active={value === color}
                  color={color}
                  onClick={() => {
                    onChange?.(color)
                  }}
                />
              </li>
            )
          })
        }
      </ul>
      <div className='w-[1px] h-4 bg-main-black'></div>
      <div className='relative'>
        <button
          className={
            classNames(
              'flex items-center justify-center w-6 h-6 border-[1px] border-solid border-main-black bg-gray-6 rounded-full',
              'opacity-20 hover:opacity-100 active:opacity-100',
              {
                '!opacity-100': showPicker
              }
            )
          }
          onClick={() => {
            setShowPicker(!showPicker)
          }}
          onBlur={() => {
            setShowPicker(false)
          }}
        >
          <PencilIcon width='12' height='12'/>
        </button>
        {
          showPicker && (
            <div className='absolute top-0 left-[34px] z-picker'>
              <ChromePicker
                color={value}
                onChange={(color) => {
                  onChange?.(color.hex)
                }}
              />
            </div>
          )
        }
      </div>
    </div>
  )
}

interface ColorItemProps {
  color: string
  active: boolean
  onClick?: () => void
}
const ColorItem: FC<ColorItemProps> = ({ color, active, onClick }) => {
  return (
    <button
      className={
        classNames('w-6 h-6 border-solid rounded-full', {
          'border-0': !active,
          '!border-[4px] border-primary': active,
          '!border border-solid border-gray-3 rounded-ful': color === '#ffffff' && !active
        })
      }
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
    </button>
  )
}

export default ColorPicker