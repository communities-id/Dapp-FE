import { FC, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

import { fetchStatistics } from "@/shared/apis"
import { formatNumber } from '@/utils/format'

interface Props {}

const FunfactSection: FC<Props> = () => {
  const [communitiesCount, setCommunitiesCount] = useState()
  const [identitiesCount, setIdentitiesCount] = useState()
  const [TVL, setTVL] = useState()

  const funfact = useMemo(() => {
    return {
      title: 'Trusted by Crypto Communities.',
      desc: '',
      stats: [
        {
          title: 'Communities',
          count: communitiesCount ?? '--',
          digits: 0
        },
        {
          title: 'Identities',
          count: identitiesCount ?? '--',
          digits: 0
        },
        {
          title: 'TVL(USDT)',
          count: TVL ?? '--',
          digits: 3
        }
      ]
    }
  }, [communitiesCount, identitiesCount, TVL])

  useEffect(() => {
    async function getCommunitiesCount() {
      const res = await fetchStatistics()
      setCommunitiesCount(res.data.communities)
      setIdentitiesCount(res.data.identities)
      setTVL(res.data.tvl)
    }
    getCommunitiesCount()
  }, [])
  return (
    <section className="pt-20 lg:pt-22.5 px-4 md:px-8 2xl:px-0">
      <div
        className="mx-auto max-w-c-1390 py-22.5 xl:py-27.5 relative z-1 rounded-lg bg-primary shadow-section"
      >
        <Image alt="" src="/funfact/common-bg-left.png" width={260} height={300} className="absolute bottom-0 left-0 pointer-events-none select-none -z-1"/>
        <Image alt="" src="/funfact/common-bg-right.png" width={260} height={300} className="hidden lg:block absolute top-0 right-0 pointer-events-none select-none -z-1"/>
        {/* <img src="/solid/shape/shape-04.svg" alt="Man" className="absolute -top-25 -left-15 lg:left-0 -z-1" />
        <img src="/solid/shape/shape-05.svg" alt="Doodle" className="absolute bottom-0 right-0 -z-1" />
        <img src="/solid/shape/shape-dotted-light-02.svg" alt="Dotted" className="absolute top-0 left-0 -z-1 dark:hidden" />
        <img src="/solid/shape/shape-dotted-dark-02.svg" alt="Dotted" className="absolute top-0 left-0 -z-1 hidden dark:block" /> */}
        <div className="sr-item animate_top mx-auto text-center md:w-4/5 lg:w-2/3 xl:w-6/10 mb-12.5 lg:mb-17.5 px-4 md:px-0">
            <h2 className="font-bold text-white dark:text-white text-3xl xl:text-sectiontitle3 mb-4">{ funfact.title }</h2>
            <p className="lg:w-11/12 mx-auto">{ funfact.desc }</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-42.5">
            {
              funfact.stats.map((item, index) => (
                <div key={index} className="sr-item animate_top text-center">
                  <h3 className="font-bold text-white dark:text-white text-3xl xl:text-sectiontitle3 mb-2.5">{ formatNumber(item.count, item.digits) }</h3>
                  <p className="text-lg text-[rgba(255,255,255,.5)] lg:text-para2">{ item.title }</p>
                </div>
              ))
            }
          </div>
      </div>
    </section>
  )
}

export default FunfactSection