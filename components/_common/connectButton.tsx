import { FC, ReactNode } from 'react'
import classnames from 'classnames'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button, { Props as ButtonProps } from '@/components/_common/button'

export interface Props extends ButtonProps {
  children?: ReactNode
}

const _ConnectButton: FC<Props> = (props) => {

  return (
    <ConnectButton.Custom>
      {
        ({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted: connectMounted,
        }) => {
          const connected = connectMounted && account && chain
          return (
            <Button
              {...props}
              onClick={() => {
                if (!connected && connectMounted) {
                  openConnectModal()
                  return
                }
                props?.onClick?.()
              }}>

            </Button>
          )
        }
      }
    </ConnectButton.Custom>
  )
}

export default _ConnectButton
