import { FC, useState } from 'react'
import classnames from 'classnames'

import DottedBg from '@/components/common/dottedBg'

interface Props {}

const FeatureTabsSection: FC<Props> = () => {
  const [featuresTab, setFeaturesTab] = useState('tabOne')

  const tabs = [
    {
      key: 'tabOne',
      serial: '01',
      title: 'Token Locker.', // 一键创建属于你的链上社区
      content: (
        <div className="flex items-center gap-8 home-lg:gap-19">
          <div className="md:w-1/2">
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle2 font-bold mb-7">Refundable & Transferable NFT.</h2>
            {/* 通过我们的 DaaS 协议，你可以创建使用任意 ERC20 代币来让社区成员铸造社区身份 */}
            <p className="mb-5">Leveraging community token to mint a member domain. The tokens are staked in our token locker, which is absolutely isolated and secured.</p>
            {/* 链上的社交身份让你的社区与粉丝之间的关系不会被中心化平台剥夺. 查看更多 */}
            <p className="w-11/12">It&apos;s up to you whether you sell it on the NFT marketplace or burn it to get refunds. Moreover, joining early-stage communities with significant potential can lead to unexpected rewards.</p>
          </div>
          <div className="hidden home-md:block home-md:w-1/2">
            <img src="/tab/tab-1.png" alt="Features" className="dark:hidden" />
            <img src="/tab/tab-1.png" alt="Features" className="hidden dark:block" />
          </div>
        </div>
      )
    },
    {
      key: 'tabTwo',
      serial: '02',
      title: 'Data Resolver.', // 快速加入你喜欢的社区
      content: (
        <div className="flex items-center gap-8 home-lg:gap-19">
          <div className="md:w-1/2">
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle2 font-bold mb-7">One Resolver SDK for omnichain.</h2>
            {/* 你将会获得一个链上的身份凭证(NFT). 持有这个 NFT 你将获得在各个 dapp 中访问社区空间的权限，你可以随时在 NFT 市场出售它，也可以选择退款. */}
            <p className="mb-5">The data of different communities is recorded on different chains and in different contracts. We provide an Omnichain data indexer that facilitate developers to easily query data from different communities.</p>
            {/* 除此之外，在早期加入一些你认为有潜力的社区也能够有一定的可能为你带来意想之外的报酬. 查看更多 */}
            {/* <p className="w-11/12">Maintain a decentralized and autonomous connection with your fans, free from centralized platform control.</p> */}
          </div>
          <div className="hidden home-md:block home-md:w-1/2">
            <img src="/tab/tab-2.png" alt="Features" className="dark:hidden" />
            <img src="/tab/tab-2.png" alt="Features" className="hidden dark:block" />
          </div>
        </div>
      )
    },
    {
      key: 'tabThree',
      serial: '03',
      title: 'MetaSync.', // 链上资金安全公开透明
      content: (
        <div className="flex items-center gap-8 home-lg:gap-19">
          <div className="md:w-1/2">
            {/* 对用户免费 & 社区资金安全托管. */}
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle2 font-bold mb-7">One Brand NFT, For Anywhere, Anytime.</h2>
            {/* 面向社区成员完全免费. */}
            <p className="mb-5">Enjoy the dynamic capabilities of our NFT domains, allowing you to customize Metadata and witness rapid updates of the latest information on supported social platforms.</p>
            {/* 用户可赎回的资金托管在智能合约内，安全透明. 查看更多 */}
            {/* <p className="w-11/12">User funds for redemption are stored securely and transparently within smart contracts.</p> */}
          </div>
          <div className="hidden home-md:block home-md:w-1/2">
            <img src="/tab/tab-3.png" alt="Features" className="dark:hidden" />
            <img src="/tab/tab-3.png" alt="Features" className="hidden dark:block" />
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="pt-18.5 pb-20 home-lg:pb-22.5 relative">
      <div className="mx-auto max-w-c-1390 px-4 home-md:px-8 home-2xl:px-0">
        <DottedBg/>

        {/* <!-- Tab Menues Start --> */}
        <div
          className="sr-item animate_top border border-stroke dark:border-strokedark dark:bg-blacksection shadow-solid-5 dark:shadow-solid-6 bg-white rounded-[10px] flex flex-wrap flex-col home-md:flex-row home-md:flex-nowrap home-md:items-center justify-center home-lg:gap-7.5 home-xl:gap-12.5 mb-15 home-xl:mb-21.5"
        >
          {
            tabs.map((tab, index) => (
              <div
                key={index}
                className={classnames('relative cursor-pointer flex-1 border-b last:border-0 home-md:border-0 border-stroke dark:border-strokedark flex items-center gap-4 py-2 home-xl:py-5 px-6 home-xl:px-13.5', {
                  'active before:w-full before:h-1 before:bg-primary dark:before:bg-primarydark before:absolute before:bottom-0 before:left-0 before:rounded-tl-[4px] before:rounded-tr-[4px]': featuresTab === tab.key
                })}
                onClick={() => setFeaturesTab(tab.key)}
              >
                <div className="min-w-0 w-12.5 h-12.5 rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection flex items-center justify-center">
                  <p className="text-black dark:text-white font-medium text-metatitle3">{ tab.serial }</p>
                </div>
                <div className="flex-1 home-lg:w-auto home-md:w-3/5">
                  <h5 className="text-black dark:text-white text-sm home-xl:text-regular font-medium">{ tab.title }</h5>
                </div>
              </div>
            ))
          }
        </div>
        {/* <!-- Tab Menues End --> */}

        {/* <!-- Tab Content Start --> */}
        <div className="sr-item animate_top mx-auto max-w-c-1154">
          {
            tabs.map((tab, index) => (
              <div key={index} className={classnames({ 'hidden': featuresTab !== tab.key })}>
                { tab.content }
              </div>
            ))
          }
        </div>
        {/* <!-- Tab Content End --> */}
      </div>
    </section>
  )
}

export default FeatureTabsSection