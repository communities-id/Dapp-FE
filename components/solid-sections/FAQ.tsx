import { FC, useState } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

import SectionTitle from '@/components/solid/SectionTitle'
import DottedBg from '@/components/common/dottedBg'

interface Props {}

const FAQSection: FC<Props> = () => {
  const [selected, setSelected] = useState<number | null>(0)

  const faq = {
    metatitle: 'OUR FAQS',
    title: 'Frequently Asked ',
    bgtitle: 'Questions',
    link: {
      text: 'Know More',
      url: '/'
    },
    collapses: [
      {
        title: 'How can I register a Brand DID?',
        desc: [
          'Communities ID is currently in its Private Launch phase, and only invited or verified users can mint a Brand DID. If you wish to deploy a DID system for your community, please contact our MODs on Discord or reach out to the administrators in our official Telegram channel to obtain a Signature.',
        ]
      },
      {
        title: `​I want to mint a User DID, but the parent Brand DID hasn't been registered yet. What should I do?`,
        desc: ['The best approach is to contact the owner or administrator of your community. Convey your requirements to the community owner and ask them to get in touch with us. We will promptly deploy the Brand DID for you.'],
      },
      {
        title: 'More Questiosn?',
        desc: [<span key="mq-1">Check our <Link href='https://docs.communities.id/' target='_blank' className='text-inherit underline underline-offset-2 cursor-pointer transition-all duration-300'>Docs</Link> for more info!</span>],
      }
    ]
  }

  return (
    <section className="pb-20 lg:pb-25 xl:pb-30 overflow-hidden">
      <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 relative">
        <DottedBg/>
        <div className="flex flex-wrap md:flex-nowrap md:items-center gap-8 xl:gap-32.5">
          <div className="sr-item animate_left md:w-2/5 lg:w-1/2">
            <SectionTitle side title={faq.metatitle} subTitle={faq.title} bgTitle={faq.bgtitle} />
            {/* <p>The only service you need to integrate all Web3 name services, including .eth, .bnb, and .arb.</p> */}

            {/* <Link href={faq.link.url} className="flex items-center gap-2.5 text-black dark:text-white mt-25">
              { faq.link.text }
              <img className="dark:hidden" src="/solid/icon/icon-arrow-light.svg" alt="Arrow" />
              <img className="hidden dark:block" src="/solid/icon/icon-arrow-dark.svg" alt="Arrow" />
            </Link> */}
          </div>

          <div className="sr-item animate_right md:w-3/5 lg:w-1/2">
            <div className="bg-white dark:bg-blacksection dark:border dark:border-strokedark shadow-solid-8 rounded-lg">
              {
                faq.collapses.map((collapse, index) => (
                  <div key={index} className="flex flex-col border-b border-stroke dark:border-strokedark">
                    <h4
                      className="cursor-pointer flex justify-between items-center font-bold text-metatitle3 text-black dark:text-white py-5 lg:py-7.5 px-6 lg:px-9"
                      onClick={() => {
                        setSelected(selected !== index ? index : null)
                      }}
                    >
                      { collapse.title }
                      <img src="/solid/icon/icon-plus-light.svg" alt="plus" className={classnames('dark:hidden', `${selected === index ? 'hidden' : 'block'}`)} />
                      <img src="/solid/icon/icon-minus-light.svg" alt="minus" className={classnames('dark:hidden', `${selected === index ? 'block' : 'hidden'}`)} />
                      <img src="/solid/icon/icon-plus-dark.svg" alt="plus" className={classnames('hidden dark:block', `${selected === index ? 'dark:hidden' : 'dark:block'}`)} />
                      <img src="/solid/icon/icon-minus-dark.svg" alt="minus" className={classnames('hidden dark:block', `${selected === index ? 'dark:block' : 'dark:hidden'}`)} />
                    </h4>
                    <div className={classnames('flex flex-col gap-[12px] py-5 lg:py-7.5 px-6 lg:px-9 border-t border-stroke dark:border-strokedark', {
                      'hidden': selected !== index
                    })}>
                      {
                        collapse.desc.map((desc, index) => (
                          <p key={index} className="">
                            { desc }
                          </p>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection