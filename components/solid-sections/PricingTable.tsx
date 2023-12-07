import { FC } from 'react'

import SectionTitle from '@/components/solid/SectionTitle'
import DottedBg from '@/components/common/dottedBg'

interface Props {}

const PricingTableSection: FC<Props> = () => {
  return (
    <section className="pt-15 home-lg:pt-20 home-xl:pt-25 pb-20 home-lg:pb-25 home-xl:pb-30">
      <div className="mx-auto max-w-c-1315 px-4 home-md:px-8 home-xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div
          className="sr-item animate_top text-center mx-auto"
        >
          <SectionTitle title="PRICING PLANS" subTitle="Simple Pricing" titlePara="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in maximus."/>
        </div>
        {/* <!-- Section Title End --> */}
      </div>

      <div className="mx-auto max-w-[1207px] px-4 home-md:px-8 home-xl:px-0 relative mt-15 home-xl:mt-20">
        <DottedBg/>
        <div className="flex flex-wrap home-lg:flex-nowrap justify-center gap-7.5 home-xl:gap-12.5">
          {/* <!-- Pricing Item --> */}
          <div className="sr-item animate_top home-md:w-[45%] home-lg:w-1/3 group relative bg-white dark:bg-blacksection rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-strokedark p-7.5 home-xl:p-12.5">
            <h3 className="text-black dark:text-white font-bold text-3xl home-xl:text-sectiontitle3 mb-7.5">$10 <span className="text-regular text-waterloo dark:text-manatee">/month</span></h3>
            <h4 className="text-black dark:text-white font-medium text-para2 mb-2.5">Small Pack</h4>
            <p>Lorem ipsum dolor sit amet, consec adipisicing elit.</p>

            <div className="border-t border-stroke dark:border-strokedark mt-9 pt-9 pb-12.5">
              <ul>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">300 GB Storage</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Unlimited Photos and Videos</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0 opacity-40">Exclusive Support</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0 opacity-40">Custom Branding Strategy</li>
              </ul>
            </div>

            <a href="#" className="inline-flex items-center gap-2.5 text-primary dark:text-white dark:hover:text-primary font-medium transition-all duration-300">
              Get the Plan
              <svg className="fill-primary dark:fill-white dark:hover:fill-primary transition-all duration-300" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4767 6.17348L6.00668 1.70348L7.18501 0.525146L13.6667 7.00681L7.18501 13.4885L6.00668 12.3101L10.4767 7.84015H0.333344V6.17348H10.4767Z" fill="" />
              </svg>
            </a>
          </div>

          {/* <!-- Pricing Item --> */}
          <div className="sr-item animate_top home-md:w-[45%] home-lg:w-1/3 group relative bg-white dark:bg-blacksection rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-strokedark p-7.5 home-xl:p-12.5">
            <div className="absolute top-7.5 -right-3.5 -rotate-90 rounded-tl-full rounded-bl-full bg-primary dark:bg-primarydark font-medium text-white text-metatitle uppercase py-1.5 px-4.5">popular</div>

            <h3 className="text-black dark:text-white font-bold text-3xl home-xl:text-sectiontitle3 mb-7.5">$59 <span className="text-regular text-waterloo dark:text-manatee">/month</span></h3>
            <h4 className="text-black dark:text-white font-medium text-para2 mb-2.5">Medium Pack</h4>
            <p>Lorem ipsum dolor sit amet, consec adipisicing elit.</p>

            <div className="border-t border-stroke dark:border-strokedark mt-9 pt-9 pb-12.5">
              <ul>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">300 GB Storage</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Unlimited Photos and Videos</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Exclusive Support</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0 opacity-40">Custom Branding Strategy</li>
              </ul>
            </div>

            <a href="#" className="inline-flex items-center gap-2.5 text-primary dark:text-white dark:hover:text-primary font-medium transition-all duration-300">
              Get the Plan
              <svg className="fill-primary dark:fill-white dark:hover:fill-primary transition-all duration-300" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4767 6.17348L6.00668 1.70348L7.18501 0.525146L13.6667 7.00681L7.18501 13.4885L6.00668 12.3101L10.4767 7.84015H0.333344V6.17348H10.4767Z" fill="" />
              </svg>
            </a>
          </div>

          {/* <!-- Pricing Item --> */}
          <div className="sr-item animate_top home-md:w-[45%] home-lg:w-1/3 group relative bg-white dark:bg-blacksection rounded-lg shadow-solid-10 dark:shadow-none border border-stroke dark:border-strokedark p-7.5 home-xl:p-12.5">
            <h3 className="text-black dark:text-white font-bold text-3xl home-xl:text-sectiontitle3 mb-7.5">$189 <span className="text-regular text-waterloo dark:text-manatee">/month</span></h3>
            <h4 className="text-black dark:text-white font-medium text-para2 mb-2.5">Large Pack</h4>
            <p>Lorem ipsum dolor sit amet, consec adipisicing elit.</p>

            <div className="border-t border-stroke dark:border-strokedark mt-9 pt-9 pb-12.5">
              <ul>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">300 GB Storage</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Unlimited Photos and Videos</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Exclusive Support</li>
                <li className="text-black dark:text-manatee mb-4 last:mb-0">Custom Branding Strategy</li>
              </ul>
            </div>

            <a href="#" className="inline-flex items-center gap-2.5 text-primary dark:text-white dark:hover:text-primary font-medium transition-all duration-300">
              Get the Plan
              <svg className="fill-primary dark:fill-white dark:hover:fill-primary transition-all duration-300" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4767 6.17348L6.00668 1.70348L7.18501 0.525146L13.6667 7.00681L7.18501 13.4885L6.00668 12.3101L10.4767 7.84015H0.333344V6.17348H10.4767Z" fill="" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingTableSection