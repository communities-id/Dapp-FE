import { FC, useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter } from "next/router"

import { TypeWriter, blinkFrame } from '@/utils/writer'
import { sleep } from '@/utils/tools'

import Button from '@/components/solid/Button'
import DottedBg from '@/components/common/dottedBg'
import { track } from '@/shared/track'

// import MetaMaskSvg from '~@/platform/metamask.svg'

const placeholders = [
  '.community',
  'community',
  'id.community',
  '0x......'
]

const randomPlaceholder = (prev: string) => {
  const prevIdx = placeholders.findIndex((item) => item === prev)
  let nextIdx = prevIdx + 1
  if (nextIdx >= placeholders.length) {
    nextIdx = 0
  }
  return placeholders[nextIdx]
}

const actions = [
  'Crypto Communities',
  'dApps',
  'Web2 Platforms',
  'Everyone'
]

const randomAction = (prev: string) => {
  const prevIdx = actions.findIndex((item) => item === prev)
  let nextIdx = prevIdx + 1
  if (nextIdx >= actions.length) {
    nextIdx = 0
  }
  return actions[nextIdx]
}

interface Props {}

const HeroSection: FC<Props> = () => {
  const router = useRouter()
  const [actionLabel, setActionLabel] = useState(actions[actions.length - 1])

  const handleLaunch = async (e: FormEvent) => {
    e.preventDefault()
    track('launch', {})
    router.push(`/dapp`)
  }

  const handleEcosystem = async (e: FormEvent) => {
    e.preventDefault()
    track('launch', {})
    router.push(`/ecosystem`)
  }
  
  return (
    <section className="pt-35 md:pt-40 xl:pt-46 pb-20 xl:pb-25 overflow-hidden">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
          <div className="sr-item animate_left relative md:w-1/2 overflow-hidden">
            <DottedBg/>
            {/* <h4 className="text-black dark:text-white text-lg font-medium mb-4.5">🔥 One-click deployment of a customized DID system!</h4> */}
            <h4 className="text-black dark:text-white text-lg font-medium mb-4.5">Decentralized-identity as a Service came out!</h4>
            <h1 className="text-black dark:text-white text-3xl xl:text-hero font-bold mb-5">
              <span>
                The First&nbsp;&nbsp; 
                <span className="inline-block relative before:absolute before:bottom-2.5 before:left-0 before:w-full before:h-3 before:bg-titlebg dark:before:bg-titlebgdark before:-z-1">DaaS</span>
                &nbsp;&nbsp;Protocol</span>
              <br/>
              <span className="bg-action-text-gradient dark:bg-action-text-gradient-dark bg-clip-text text-transparent">for <span>{ actionLabel }</span></span>
            </h1>
            <p>We aim to build stronger consensus within communities and provide use cases for community native tokens.</p>
            <div className="mt-10 min-h-[94px] flex gap-3">
              <Button onClick={handleLaunch} theme='primary' className='px-12 ease-in-out duration-300'>Launch</Button>
              <Button onClick={handleEcosystem} theme='primary' className='px-12 ease-in-out duration-300 border border-primary bg-white !text-primary hover:!bg-primary-tr-10'>Ecosystem</Button>
            </div>
          </div>
          <div className="sr-item animate_right md:w-1/2 hidden lg:block">
            <div className="relative 2xl:-mr-7.5">
              {/* <img src="/solid/shape/shape-01.png" alt="shape" className="absolute -left-11.5 top-0" />
              <img src="/solid/shape/shape-02.svg" alt="shape" className="absolute right-0 bottom-0" />
              <img src="/solid/shape/shape-03.svg" alt="shape" className="absolute -right-6.5 bottom-0" /> */}
              <div>
                <img className="dark:hidden" src="/hero/hero-light.png" alt="Hero" />
                <img className="hidden dark:block" src="/hero/hero-dark.png" alt="Hero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection