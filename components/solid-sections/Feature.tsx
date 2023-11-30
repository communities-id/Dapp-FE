import { FC } from 'react'
import Image from 'next/image'
import classnames from 'classnames'

import SectionTitle from '@/components/solid/SectionTitle'
import FeatureHoverBg from '~@/feature/feature-hover-bg.png'
import DottedBg from '@/components/common/dottedBg'

// import DaasSvg from '@/public/feature/Crafted-for-Daas.svg'
// import DynamicSvg from '@/public/feature/Dynamic-NFT.svg'
// import LockSvg from '@/public/feature/Lock-to-Own.svg'
// import MultiSvg from '@/public/feature/DEXMulti-Chain.svg'
// import SocialSvg from '@/public/feature/On-chain-social-graph.svg'
// import TokenSvg from '@/public/feature/Community-Token.svg'

interface Props {}

const FeatureSection: FC<Props> = () => {
  const features = [
    // {
    //   title: 'Straightforward',
    //   descriptions: ['Set up your DID system is simple, even without technical expertise.'],
    //   icon: <Image alt="" src="/feature/Crafted for DaaS.png" width="64" height="64"/>
    // },
    // {
    //   title: 'Scalable',
    //   descriptions: [`Integrate DaaS into your ecosystem in no time + DIY as you wish to facilitate your growth.`],
    //   icon: <Image alt="" src="/feature/DEXMulti-Chain.png" width="64" height="64"/>
    // },
    // {
    //   title: 'Interoperable',
    //   descriptions: ['you are able to use your user DID anywhere, frictionlessly and conveniently. '],
    //   icon: <Image alt="" src="/feature/Community Token.png" width="64" height="64"/>
    // },
    {
      title: 'Streamlined Deployment',
      descriptions: ['Quickly set up a community DID system with our permissionless and fully decentralized domain service.'],
      icon: <Image alt="" src="/feature/Crafted for DaaS.png" width="64" height="64"/>
    },
    {
      title: 'Omnichain',
      descriptions: ['Discover the power of a single, unified DID across multiple chains, ensuring absolute uniqueness with our "One DID for all Chain" solution.'],
      icon: <Image alt="" src="/feature/On chain social graph.png" width="64" height="64"/>
    },
    {
      title: 'Lock 2 Own',
      descriptions: ["Make the most out of your self-issued Token by building a one-of-a-kind domain name system. Stake your community's tokens to mint your member domain, and retrieve them upon burning."],
      icon: <Image alt="" src="/feature/Lock to Own.png" width="64" height="64"/>
    },
    {
      title: 'Flexible Expiry',
      descriptions: ['Tailor your Member Domains to your preferences, offering both Permanent Ownership and Annual Renewal options.'],
      icon: <Image alt="" src="/feature/Community Token.png" width="64" height="64"/>
    },
    {
      title: 'Customized Minting',
      descriptions: ['Leverage our flexible DaaS to define minting periods, total supply, and whitelists in alignment with your specific requirements.'],
      icon: <Image alt="" src="/feature/Dynamic NFT.png" width="64" height="64"/>
    },
    {
      title: 'Dynamic NFT for Brand',
      descriptions: [`Get your hands on a tradable and dynamic NFT that empowers you to personalize your community's brand information and achieve real-time updates across the internet.`],
      icon: <Image alt="" src="/feature/DEXMulti-Chain.png" width="64" height="64"/>
    },
  ]
  
  return (
    <section id="features" className="py-20 home-lg:py-25 home-xl:py-30">
      <div className="relative mx-auto max-w-c-1315 px-4 home-md:px-8 home-xl:px-0">
        <DottedBg/>
        <div className='relative z-1'>
          {/* <!-- Section Title Start --> */}
          <div
            className="sr-item animate_top text-center mx-auto"
          >
            <SectionTitle title="FEATURES" subTitle="DID as a Service" titlePara=""/>
          </div>
          {/* <!-- Section Title End --> */}

          <div className="grid grid-cols-1 home-md:grid-cols-2 home-lg:grid-cols-3 gap-7.5 home-xl:gap-12.5 mt-12.5 home-lg:mt-15 home-xl:mt-20">
            {/* <!-- Features items --> */}
            {
              features.map((feature, index) => (
                <div
                  key={index}
                  className="group sr-item animate_top border border-white shadow-solid-3 rounded-lg p-7.5 home-xl:p-12.5 transition-all hover:shadow-solid-4 dark:hover:bg-hoverdark dark:border-strokedark bg-white dark:bg-blacksection"
                >
                  <div
                    className={
                      // group-hover:bg-[url("/feature/feature-hover-bg.png")]
                      classnames('flex items-center justify-center rounded-full overflow-hidden w-16 h-16 bg-primary bg-cover')
                    }>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl home-xl:text-itemtitle text-black dark:text-white mt-7.5 mb-5">{ feature.title }</h3>
                  {
                    feature.descriptions.map((description, index) => (
                      <p key={index} className="mt-3">{ description }</p>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSection