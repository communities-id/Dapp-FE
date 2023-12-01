import { FC } from 'react'

import SectionTitle from '@/components/solid/SectionTitle'
import DottedBg from '@/components/common/dottedBg'

interface Props {}

const AboutSection: FC<Props> = () => {
  const about = {
    // metatitleTag: 'MEMBER DOMAIN',
    // metatitle: 'SAFE TRANSFER', // 快捷转账
    // metatitle: 'OMNI-DID',
    title: 'Your identity, Your ',
    bgtitle: 'Wallet',
    appendTitle: ' Address.',
    desc: '',
    list: [
      {
        serial: '01',
        // title: 'Explore the list of dApps that support Communities ID.', // 下载支持我们 DID 功能的钱包
        desc: 'Utilize our user DID as a universal replacement for wallet addresses across ', // 查看支持我们项目的钱包列表 --> 查看更多
        anchor: 'all supported dApps.',
        anchorEl: '#cid-ecosystem'
      },
      {
        serial: '02',
        // title: 'Use DID for transfers.', // 使用 DID 进行转账
        desc: 'Embrace our Omni-DID as your all-in-one identity to effortlessly & safely transact on multiple chains.' // 你可以在钱包中通过 DID 方便的向他人转账.
      }
    ]
  }
  return (
    <section className="pb-20 home-lg:pb-25 home-xl:pb-30 overflow-hidden">
      <div className="relative mx-auto max-w-c-1235 px-4 home-md:px-8 home-xl:px-0">
        <DottedBg/>
        <div className="flex items-center gap-8 home-lg:gap-32.5">
          <div className="sr-item animate_left hidden home-md:block home-md:w-1/2">
            <img src="about/wallet-scene.png" alt="About" className="dark:hidden" />
            <img src="about/wallet-scene.png" alt="About" className="hidden dark:block" />
          </div>
          <div className="sr-item animate_right home-md:w-1/2">
            <SectionTitle
              side
              // title={about.metatitle}
              subTitle={about.title}
              bgTitle={about.bgtitle}
              appendSubTitle={about.appendTitle}
              titlePara={about.desc} />
            {
              about.list.map((item, index) => (
                <div key={index} className="mt-7.5 flex items-center gap-5">
                  <div className="w-15 h-15 rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection flex items-center justify-center">
                    <p className="text-black dark:text-white font-semibold text-metatitle2">{ item.serial }</p>
                  </div>
                  <div className="w-3/4">
                    {/* <h5 className="text-black dark:text-white text-metatitle2 mb-0.5">{ item.title }</h5> */}
                    <p>
                      <span>{ item.desc }</span>
                      {
                        item.anchor ? (
                          <span
                            className='underline underline-offset-2 cursor-pointer transition-all duration-300'
                            onClick={() => {
                            const el = document.querySelector(item.anchorEl) as HTMLDivElement
                            if (!el) return
                            const scrollTop = el.offsetTop
                            window.scrollTo({ top: scrollTop, behavior: 'smooth' })
                          }}>{ item.anchor }</span>
                        ) : null
                      }
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection