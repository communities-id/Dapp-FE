import { FC } from 'react'
import Link from 'next/link'

interface Props {}

const CtaSection: FC<Props> = () => {
  const ctaInfo = {
    title: 'Join Communities ID (beta.)',
    desc: 'Participate in our private launch  and secure Early Adoption Incentives!'
  }

  return (
    <section className="py-20 home-lg:py-25 home-xl:py-30 px-4 home-md:px-8 home-2xl:px-0 overflow-hidden">
      <div
        className="mx-auto max-w-c-1390 px-7.5 home-md:px-12.5 home-xl:px-17.5 py-12.5 home-xl:py-19 rounded-lg shadow-section dark:bg-blacksection dark:stroke-strokedark"
      >
        <div className="flex flex-wrap home-md:flex-nowrap home-md:items-center home-md:justify-between gap-8 home-md:gap-0">
          <div className="sr-item animate_left home-md:w-[70%] home-lg:w-1/2">
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle4 font-bold mb-4 w-11/12">{ ctaInfo.title }</h2>
            <p>{ ctaInfo.desc }</p>
          </div>
          <div className="sr-item animate_right home-lg:w-[45%]">
            <div className="flex flex-col gap-[36px] items-end text-center">
              {/* <Link href='/community/cid' className="inline-flex items-center gap-2.5 font-medium text-white dark:text-black bg-primary dark:bg-white rounded-full py-3 px-6">
                Mint Now
                <img src="/solid/icon/icon-arrow-dark.svg" alt="Arrow" className="dark:hidden" />
                <img src="/solid/icon/icon-arrow-light.svg" alt="Arrow" className="hidden dark:block" />
              </Link> */}
              <Link href='https://docs.communities.id/how-to-start/for-project-owners' target='_blank' className="w-[270px] px-[16px] inline-block text-[16px] leading-[34px] rounded-[32px] font-bold text-white dark:text-black bg-primary dark:bg-white">
                Guide for Community Owner
              </Link>
              <Link href='https://docs.communities.id/how-to-start/for-regular-users' target='_blank' className="w-[270px] px-[16px] inline-block text-[16px] leading-[34px] rounded-[32px] font-bold text-white dark:text-black bg-primary dark:bg-white">
                Guide for regular users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection