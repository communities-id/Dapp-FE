import { FC } from 'react'
import Link from 'next/link'
import SectionTitle from '@/components/solid/SectionTitle'

interface Props {}

const About2Section: FC<Props> = () => {
  const about2 = {
    metatitle: 'COMMUNITY & SOCIAL IDENTITIES', // 开始用于社交身份
    title: 'Tickets to Flourishing Ecosystems',
    desc: 'Utilize User DID as entry tickets for participation in dApps and exclusive communities.', // 你可以使用 DID 发送消息、邮件，进入一些私密社区等.
    link: {
      title: 'Know More',
      url: '/'
    }
  }
  return (
    <section className='mb-20 home-lg:mb-22.5'>
      <div className="mx-auto max-w-c-1235 px-4 home-md:px-8 home-2xl:px-0 overflow-hidden">
        <div className="flex items-center gap-8 home-lg:gap-32.5">
          <div className="sr-item animate_left home-md:w-1/2">
          <SectionTitle
            side
            title={about2.metatitle}
            subTitle={about2.title}
            titlePara={about2.desc} />

            {/* <Link href={about2.link.url} className="flex items-center gap-2.5 text-black dark:text-white mt-7.5">
              { about2.link.title }
              <img className="dark:hidden" src="/solid/icon/icon-arrow-light.svg" alt="Arrow" />
              <img className="hidden dark:block" src="/solid/icon/icon-arrow-dark.svg" alt="Arrow" />
            </Link> */}
          </div>
          <div className="sr-item animate_right hidden home-md:block home-md:w-1/2">
            <img src="/about/social-scene.png" alt="About" className="dark:hidden" />
            <img src="/about/social-scene.png" alt="About" className="hidden dark:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About2Section