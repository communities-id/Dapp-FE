import { FC } from 'react'

import SectionTitle from '@/components/solid/SectionTitle'
import DottedBg from '@/components/common/dottedBg'

import MetamaskSvg from '@/public/platform/metamask.svg'
import EtherscanSvg from '@/public/platform/etherscan.svg'
import DeboxSvg from '@/public/platform/debox.svg'
import DiscordSvg from '@/public/platform/discord.svg'
import CyberSvg from '@/public/platform/cyber.svg'
import TwitterSvg from '@/public/platform/twitter.svg'

interface Props {}

const IntegrationSection: FC<Props> = () => {
  const platforms = [
    {
      type: 'platform',
      key: 'metamask',
      icon: <MetamaskSvg width="45" height="45"/>,
    },
    {
      type: 'dot',
      hidden: true,
      className: 'bg-[#FFDB26] w-[11px] h-[11px] rounded-full',
    },
    {
      type: 'platform',
      key: 'etherscan',
      icon: <EtherscanSvg width="44" height="44"/>,
    },
    {
      type: 'dot',
      hidden: false,
      className: 'bg-[#FFDB26] w-[11px] h-[11px] rounded-full',
    },
    {
      type: 'platform',
      key: 'cyber',
      icon: <CyberSvg width="60" height="60"/>,
    },
    {
      type: 'dot',
      hidden: true,
    },
    {
      type: 'dot',
      hidden: false,
      className: 'bg-[#62E888] w-[15px] h-[15px] rounded-full',
    },
    {
      type: 'platform',
      key: 'discord',
      icon: <DiscordSvg width="64" height="64"/>,
    },
    {
      type: 'dot',
      hidden: false,
      className: 'bg-[#EF5C00] w-[23px] h-[23px] rounded-full',
    },
    {
      type: 'platform',
      key: 'debox',
      icon: <DeboxSvg width="42" height="42"/>,
    },
    {
      type: 'dot',
      hidden: false,
      className: 'bg-[#016BFF] w-[15px] h-[15px] rounded-full',
    },
    {
      type: 'platform',
      key: 'twitter',
      icon: <TwitterSvg width="52" height="52"/>,
    }
  ]
  return (
    <section id="cid-ecosystem" className='py-20 home-lg:py-22.5'>
      <div className="mx-auto max-w-c-1390 px-4 home-md:px-8 home-2xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div
          className="sr-item animate_top text-center mx-auto"
        >
          {/* 所有数据存储在链上，属于社区和用户。成为 Web3 世界 B2C 社交图谱重要的拼图。 */}
          <SectionTitle title="ECOSYSTEM" subTitle="On-chain community and identity, For Anywhere, Anytime." titlePara="" />
        </div>
        {/* <!-- Section Title End --> */}
      </div>

      <div className="mx-auto max-w-c-1154 px-4 home-md:px-8 home-xl:px-0 relative z-50 mt-15 home-xl:mt-20">
        <DottedBg/>
        <div className="flex flex-wrap gap-y-10 justify-around">
          {
            platforms.map((platform, index) => {
              if (platform.type === 'platform') {
                return (
                  <div key={index} className="sr-item animate_top w-1/6">
                    <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
                      {platform.icon}
                    </div>
                  </div>
                )
              }
              return (
                <div key={index} className="sr-item animate_top w-1/6">
                  { platform.hidden ? null : (
                      <div className={platform.className}></div>
                  ) }
                </div>
              )
            })
          }
          {/* <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-07.svg" alt="Brand" />
            </div>
          </div>

          <div className="sr-item animate_top w-1/6"></div>

          <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-08.svg" alt="Brand" />
            </div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="bg-[#FFDB26] rounded-full w-[11px] h-[11px]"></div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-09.svg" alt="Brand" />
            </div>
          </div>

          <div className="sr-item animate_top w-1/6"></div>

          <div className="sr-item animate_top w-1/6">
            <div className="bg-[#62E888] rounded-full w-[15px] h-[15px]"></div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-10.svg" alt="Brand" />
            </div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="bg-[#EF5C00] rounded-full w-[23px] h-[23px]"></div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-11.svg" alt="Brand" />
            </div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="bg-[#016BFF] rounded-full w-[15px] h-[15px]"></div>
          </div>

          <div className="sr-item animate_top w-1/6">
            <div className="inline-block rounded-[10px] shadow-solid-7 bg-white dark:bg-btndark p-4.5">
              <img src="/solid/brand/brand-12.svg" alt="Brand" />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default IntegrationSection