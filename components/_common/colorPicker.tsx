import { FC, Fragment, useEffect, useState } from 'react'
import classNames from 'classnames'

import { ChromePicker } from 'react-color'

import PencilIcon from '~@/_brand/pencil.svg'

const colors = [
  '#8840FF', '#3A5CC2', '#61ABD0', '#61B771', '#E4735B', '#ECBD41'
]

interface Props {
  value: string
  mobile?: boolean
  onChange?: (color: string) => void
}

const ColorPicker: FC<Props> = ({ value, mobile, onChange }) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className={classNames({
      'flex items-center gap-[22px]': !mobile,
      'full-size flex-center': mobile
    })}>
      {
        !mobile && (
          <Fragment>
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
          </Fragment>
        )
      }
      <div className={classNames('relative', {
        'full-size': mobile
      })}>
        <button
          className={
            classNames(
              'flex items-center justify-center rounded-full overflow-hidden',
              {
                '!opacity-100': showPicker && !mobile,
                'w-6 h-6 border-[1px] border-solid border-main-black bg-gray-6': !mobile,
                'hover:opacity-100 active:opacity-100': !mobile,
                'full-size var-brand-bgcolor': mobile
              }
            )
          }
          onClick={() => {
            setShowPicker(!showPicker)
          }}
          onBlur={() => {
            // setShowPicker(false)
          }}
        >
          {
            mobile ? null : (
              <PencilIcon width='12' height='12' className='' />
            )
          }
        </button>
        {
          showPicker && (
            <Fragment>
              <div
                className='fixed top-0 bottom-0 left-0 right-0 z-icon bg-transparent'
                onClick={() => {
                  setShowPicker(false)
                }}
              ></div>
              <div className={classNames('absolute top-0 z-picker', {
                'left-[34px]' : !mobile,
                'right-0': mobile
              })}>
                <ChromePicker
                  color={value}
                  onChange={(color) => {
                    onChange?.(color.hex)
                  }}
                />
              </div>
            </Fragment>
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
          '!border-[4px] border-main-black': active,
          // '!border-main-black': color === '#8840FF' && active
        })
      }
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
    </button>
  )
}

export default ColorPicker