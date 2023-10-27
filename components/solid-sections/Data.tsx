import { FC, Fragment } from 'react'
import Image from 'next/image'

import BasicCapital from '@/public/platform/basic-capital.png'
import GateIo from '@/public/platform/gate.io.png'
import Vcathena from '@/public/platform/vcathena.png'
import HiBlock from '@/public/platform/hiblock.png'
import TokenHunter from '@/public/platform/tokenhunter.png'
import DFG from '@/public/platform/dfg.png'
import JSQuareDark from '@/public/platform/jsquare-dark.svg'
import JSQuareLight from '@/public/platform/jsquare-light.svg'


interface Props {}

const DataSection: FC<Props> = () => {
  const datas = [
    null,
    {
      light: BasicCapital,
      dark: BasicCapital,
    },
    {
      light: GateIo,
      dark: GateIo,
    },
    {
      light: Vcathena,
      dark: Vcathena,
    },
    // {
    //   light: HiBlock,
    //   dark: HiBlock,
    // },
    // {
    //   light: TokenHunter,
    //   dark: TokenHunter,
    // },
    {
      light: DFG,
      dark: DFG,
    },
    {
      type: 'svg',
      light: JSQuareLight,
      dark: JSQuareDark,
    },
    null,
    // {
    //   light: BasicCapital,
    //   dark: BasicCapital,
    // },
    // {
    //   light: BasicCapital,
    //   dark: BasicCapital,
    // },
    // {
    //   light: BasicCapital,
    //   dark: BasicCapital,
    // },
    // {
    //   light: BasicCapital,
    //   dark: BasicCapital,
    // }
  ]

  return (
    <section className="bg-alabaster dark:bg-black border border-x-0 border-y-stroke dark:border-y-strokedark">
      {/* max-w-c-1390 */}
      <div className="mx-auto max-w-c-1016 px-4 md:px-8 2xl:px-0 py-6 md:py-0 h-auto md:h-[125px] flex item-center">
      {/* lg:gap-12.5 */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-7.5 lg:gap-16 xl:gap-16 justify-center items-center">
          {
            datas.map((data, index) => {
              return (
                <div key={index} className="sr-item animate_top block">
                  {
                    data ? (
                      data.type === 'svg' ? (
                        <Fragment>
                          <data.light width={100} className='opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden' />
                          <data.dark width={100} className='hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block' />
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Image alt="" src={data.light} width={160} className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" />
                          <Image alt="" src={data.dark} width={160} className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" />
                        </Fragment>
                      )
                    ) : null
                  }
                </div>
              )
            })
          }
          {/* <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-01.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-01.svg" alt="Clients" />
          </a>
          <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-02.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-02.svg" alt="Clients" />
          </a>
          <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-03.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-03.svg" alt="Clients" />
          </a>
          <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-04.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-04.svg" alt="Clients" />
          </a>
          <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-05.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-05.svg" alt="Clients" />
          </a>
          <a href="#" className="sr-item animate_top block">
            <img className="opacity-65 transition-all duration-300 hover:opacity-100 dark:hidden" src="/solid/brand/brand-light-06.svg" alt="Clients" />
            <img className="hidden opacity-50 transition-all duration-300 hover:opacity-100 dark:block" src="/solid/brand/brand-dark-06.svg" alt="Clients" />
          </a> */}
        </div>
      </div>
    </section>
  )
}

export default DataSection