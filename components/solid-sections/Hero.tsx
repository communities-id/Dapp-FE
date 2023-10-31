import { FC, useState, FormEvent, useEffect, useRef } from 'react'
// import Link from 'next/link'

import { useSearch } from '@/hooks/search'
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
  const { handleSearch } = useSearch()
  const [searchValue, setSearchValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [actionLabel, setActionLabel] = useState(actions[actions.length - 1])

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault()
    track('search', { keyword: searchValue, from: 'home' })
    handleSearch(searchValue)
  }

  // placeholder frame animation
  useEffect(() => {
    if (typeof window === 'undefined') return
    let text = randomPlaceholder('')
    const writer = new TypeWriter({
      delay: 10,
      durations: [text.length * 200, 0],
      // iterationLimit: 1,
      // iterationDelay: 3000,
      step(delta, iteration) {
        if (iteration === 1) {
          // 正向
          setPlaceholder(`${text.substring(0, Math.floor(text.length * delta))} |`)
        } else {
          // 逆向
          setPlaceholder(`${text.substring(text.length - Math.floor(text.length * delta), -1)} |`)
        }
      },
      finish() {
        // 光标闪烁
        blinkFrame({
          delay: 1000,
          times: 1,
          // delay: 500,
          // times: 6,
          // step: (current) => {
          //   if (current % 2 === 0) {
          //     setPlaceholder(`${text}`)
          //   } else {
          //     setPlaceholder(`${text} |`)
          //   }
          // },
          finish: () => {
            // 闪烁结束，切换 placeholder
            text = randomPlaceholder(text)
            writer.update({
              durations: [text.length * 200, 0]
            })
            writer.run()
          }
        })
      }
    })
    sleep(3000).then(() => {
      writer.run()
    })
    return () => {
      writer.destory()
    }
  }, [])

  // action label frame animation
  useEffect(() => {
    if (typeof window === 'undefined') return
    let text = randomAction('')
    const writer = new TypeWriter({
      delay: 10,
      durations: [text.length * 100, 300],
      iterationLimit: 2,
      iterationDelay: 2000,
      step(delta, iteration) {
        if (iteration === 1) {
          // 正向
          setActionLabel(`${text.substring(0, Math.floor(text.length * delta))} |`)
        } else {
          // 逆向
          setActionLabel(`${text.substring(text.length - Math.floor(text.length * delta), -1)} |`)
        }
      },
      finish() {
        // 光标闪烁
        blinkFrame({
          delay: 0,
          times: 1,
          // delay: 500,
          // times: 6,
          // step: (current) => {
          //   if (current % 2 === 0) {
          //     setPlaceholder(`${text}`)
          //   } else {
          //     setPlaceholder(`${text} |`)
          //   }
          // },
          finish: () => {
            // console.log('- finish -')
            // 闪烁结束，切换 placeholder
            text = randomAction(text)
            writer.update({
              durations: [text.length * 100, 300]
            })
            writer.run()
          }
        })
      }
    })
    writer.run()
    return () => {
      writer.destory()
    }
  }, [])
  
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
            {/* <h1 className="text-black dark:text-white text-3xl xl:text-hero font-bold mb-5">
              The First&nbsp;
              <span className="inline-block relative before:absolute before:bottom-2.5 before:left-0 before:w-full before:h-3 before:bg-titlebg dark:before:bg-titlebgdark before:-z-1">DaaS</span>
              &nbsp;Protocol <br/>
              For Crypto Communities
            </h1> */}
            <p>Mint a &quot;username.brandname&quot; - like DID. Unlock endless possibilities.</p>

            <div className="mt-10 min-h-[94px]">
              <form action="" onSubmit={handleSearchSubmit}>
                <div className="flex flex-wrap gap-5">
                  <input
                    type="text"
                    placeholder={`${placeholder}`}
                    className="py-2.5 px-6 dark:bg-black border-home-search dark:border-strokedark shadow-solid-2 dark:shadow-none rounded-full focus:outline-none focus:border-primary dark:focus:border-primary"
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                    }}
                  />
                  <Button type="submit" theme='primary' className='px-12 ease-in-out duration-300'>Search</Button>
                </div>
              </form>
              <p className="mt-5">Search brand name, user name or address.</p>
              {/* {
                !isConnected ? (
                  !canConnect ? (
                    <Button theme='primary' className='px-10 ease-in-out duration-300' onClick={connectWallet}>Connected</Button>
                  ) : (
                    <Button theme='primary' className='px-10 ease-in-out duration-300'>
                      <Link className='flex items-center' href="https://metamask.io/" target="_blank">
                        <MetaMaskSvg width="24" height="24"/>
                        <span className="ml-[6px]">Download Metamask</span>
                      </Link>
                    </Button>
                  )
                ) : (
                  <>
                    <form action="" onSubmit={handleSearch}>
                      <div className="flex flex-wrap gap-5">
                        <input
                          type="text"
                          placeholder="dingaling.ikz"
                          className="dark:bg-black border border-stroke dark:border-strokedark shadow-solid-2 dark:shadow-none rounded-full focus:outline-none focus:border-primary dark:focus:border-primary py-2.5 px-6"
                          onChange={(e) => {
                            setSearchValue(e.target.value)
                          }}
                        />
                        <Button type="submit" theme='primary' className='px-12 ease-in-out duration-300'>Search</Button>
                      </div>
                    </form>
                    <p className="mt-5">Search community, identity or address.</p>
                  </>
                )
              } */}
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