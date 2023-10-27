import { FC, useState, FormEvent } from 'react'
import Link from 'next/link'
import classnames from 'classnames'

import LightLogo from '~@/logo/inline-light.svg'
import DarkLogo from '~@/logo/inline-dark.svg'

import TransferSvg from '~@/icons/transfer.svg'

import TelegramSvg from '~@/icons/social/telegram.svg'
import Discordvg from '~@/icons/social/discord.svg'
import MediumSvg from '~@/icons/social/medium.svg'
import TwitterSvg from '~@/icons/social/twitter.svg'

interface Props {
}

const Footer: FC<Props> = () => {

  const [subscribe, setSubscribe] = useState(false)
  const [subscribeLoading, setSubscribeLoading] = useState(false)

  const items: {
    title: string
    links: {
      text: string
      url: string
      type?: string
      label?: string
    }[]
  }[] = [
    {
      title: 'Quick Links',
      links: [
        {
          text: 'Privacy Policy',
          url: 'https://docs.communities.id/documents/privacy-policy'
        },
        {
          text: 'Terms of Service',
          url: 'https://docs.communities.id/documents/terms-of-service'
        },
        {
          text: 'Docs',
          url: 'https://docs.communities.id/'
        },
        {
          text: 'OpenSea',
          url: 'https://testnets.opensea.io/collection/unidentified-contract-19334'
        },
      ]
    },
    {
      title: 'Support',
      links: [
        {
          text: 'Developer Guide',
          url: 'https://docs.communities.id/fundamentals/how-works'
        },
        {
          text: 'Resolver SDK',
          url: 'https://www.npmjs.com/package/@communitiesid/resolver'
        },
        {
          text: 'Media Kit',
          url: 'https://wanderer-labs.notion.site/Communities-ID-Brand-Resources-bf0cb4dda9f548b38416baa27e9e5e5c'
        },
        {
          text: 'Github',
          url: 'https://github.com/communities-id'
        },
      ]
    },
    {
      title: 'Newsletter',
      links: [
        // {
        //   text: 'Company',
        //   url: '/'
        // },
        {
          type: 'form',
          label: 'Subscribe to receive future updates',
          text: 'Email address',
          url: '',
        }
      ]
    }
  ]

  const socials = [
    {
      platform: 'telegram',
      url: 'https://t.me/+lf_YCwr5qgg2YzRh',
      icon: <TelegramSvg width="24" height="24" />
    },
    {
      platform: 'discord',
      url: 'https://discord.com/invite/62dwRxdSGJ',
      icon: <Discordvg width="24" height="24" />
    },
    {
      platform: 'medium',
      url: 'https://medium.com/@communities-id',
      icon: <MediumSvg width="24" height="24" />
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/CommunitiesID',
      icon: <TwitterSvg width="24" height="24" />
    }
  ]

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = String(Object.fromEntries(formData).email.valueOf())

    setSubscribeLoading(true)
    fetch('/api/subscribe', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }).then(() => {
      setSubscribeLoading(false)
      setSubscribe(true)
    })
  }

  return (
    <footer className="bg-white dark:bg-blacksection border-t border-stroke dark:border-strokedark">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {/* <!-- Footer Top --> */}
        <div className="py-20 lg:py-25">
          <div className="flex flex-wrap lg:justify-between gap-8 lg:gap-0">
            <div className={classnames("w-1/2 lg:w-1/4")}>
              <Link href="/">
                <LightLogo className="dark:hidden" width="213"/>
                <DarkLogo className="hidden dark:block" width="213"/>
              </Link>

              <p className="mt-5 mb-10">Decentralized-identity as a Service</p>
              <p className="uppercase tracking-[5px] text-sectiontitle mb-1.5">contact</p>
              <a target='_blank' href="mailto:support@communities.id" className="text-black dark:text-white font-medium text-itemtitle">support@communities.id</a>
            </div>

            <div className="w-full lg:w-2/3 xl:w-7/12 flex flex-col md:flex-row md:justify-between gap-8 md:gap-0">
              {
                items.map(({ title, links }, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-black dark:text-white text-itemtitle2 mb-9">{ title }</h4>
                    <ul>
                      {
                        links.map((link, index) => (
                          <li key={index}>
                            {
                              link.type === 'form' ? (
                                <>
                                  { link.label && (<p className="mb-4 w-[90%]">{ link.label }</p>) }
                                  {
                                    subscribe ? (
                                      <p className='h-[52px] leading-[52px] text-[24px] text-primary'>Successfully!</p>
                                    ) : (
                                      <form action="#" onSubmit={submitForm}>
                                        <div className="relative">
                                          <input
                                            name="email"
                                            type="email"
                                            disabled={subscribeLoading}
                                            placeholder={link.text}
                                            className="w-full dark:bg-black border border-stroke dark:border-strokedark shadow-solid-11 dark:shadow-none rounded-full focus:outline-none focus:border-primary dark:focus:border-primary py-3 px-6"
                                          />
    
                                          <button disabled={subscribeLoading} type="submit" className="absolute right-0 p-4">
                                            <TransferSvg width="20" height="20" className="text-[#757693] dark:text-white hover:text-primary"/>
                                          </button>
                                        </div>
                                      </form>
                                    )
                                  }
                                </>
                              ) : (
                                <Link className='inline-block text-regular hover:text-primary mb-3' href={link.url} target='_blank'>{ link.text }</Link>
                              )
                            }
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                ))
              }

            </div>
          </div>
        </div>
        {/* <!-- Footer Top --> */}

        {/* <!-- Footer Bottom --> */}
        <div className="border-t border-stroke dark:border-strokedark flex flex-wrap flex-col lg:flex-row items-center justify-center lg:justify-between gap-5 lg:gap-0 py-7">
          <div>
            <ul className="flex items-center gap-8">
              <li>Wanderer Labs © All rights reserved</li>
              {/* <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li> */}
              {/* {
                pps.map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} className='hover:text-primary'>{ item.text }</Link>
                  </li>
                ))
              } */}
            </ul>
          </div>

          {/* <div className={classnames({
            "sr-item animate_top": !
          })}>
            <p>&copy; 2025 Solid. All rights reserved</p>
          </div> */}

          <div>
            <ul className="flex items-center gap-5">
              {
                socials.map((item, index) => (
                  <li key={index}>
                    <Link href={item.url} target='_blank'>
                      <div className='hover:text-primary transition-all duration-300'>
                        { item.icon }
                      </div>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        {/* <!-- Footer Bottom --> */}
      </div>
    </footer>
  )
}

export default Footer