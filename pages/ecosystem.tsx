import React from 'react'
import Image from 'next/image';
import { DetailsProvider } from '@/contexts/details'
import SearchHeader from "@/components/solid/SearchHeader";

import TwitterIcon from '~@/icons/info/twitter.svg'
import WebsiteIcon from '~@/icons/info/website.svg'

import { EcoSystems } from '@/shared/ecosystem';
import { useRoot } from '@/contexts/root';
import Footer from '@/components/solid/Footer';

export default function Dapp() {

  const { message } = useRoot()

  function testToast() {
    message({
      type: 'success',
      content: 'Test Test'
    })
  }

  return (
    <DetailsProvider mode="community" keywords="">
      <div className="ecosystem-page">
        <SearchHeader />
        <div className="dapp-container main pt-17 mb-12.5 sm:w-[84vw] mx-auto px-10 sm:px-3">
          <h1 className='text-xxl font-Saira font-normal text-main-black'>An Ecosystem to Decentralized Future</h1>
          <p className='font-Saira text-md max-w-[800px] mt-1.5 whitespace-pre-wrap break-all'>Texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext</p>
          <div className='flex gap-4.5 mt-5'>
            <button className='button-lg bg-primary hover:bg-primary-tr-80 text-white min-w-[180px] sm:min-w-[90px]' onClick={testToast}>List My Dapp</button>
          </div>
        </div>
        <div className='border-t border-gray-7 mb-10'>
          <div className="dapp-container pt-7.5 card-grid grid gap-5 px-10 sm:px-3">
            {
             EcoSystems.map(v => (
                <figure key={v.id} className='eco-card group flex flex-col overflow-hidden rounded-[20px] cursor-pointer transition-all duration-300 hover:shadow-member-i'>
                  <div className='w-full bg-primary aspect-square flex flex-col items-center justify-between py-5 relative'>
                    <div className='pt-11 text-center sm:pt-1 flex items-center flex-col'>
                      <img src={v.logo} alt={v.name} className="max-w-[3/4] h-15 sm:w-12.5 sm:h-12.5 object-contain px-[3px] py-[3px]" />
                      <p className='text-white text-lgx sm:text-md-b mt-2.5'>{v.name}</p>
                    </div>
                    <div className='flex gap-2'>
                      {v.field.map((v, i) => <span key={i} className='bg-white px-3 py-[5.5px] sm:px-2 sm:py-1 rounded-full text-primary text-xs'>{v}</span>)}
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-primary pt-5 sm:pt-2 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <p className='text-white text-sm whitespace-pre-wrap break-all px-5 line-clamp-5'>{v.desc}</p>
                      <div className='border-t border-white h-[66px] sm:h-10 px-5 flex items-center justify-around'>
                        {v.twitter && <a href={v.twitter} target='_blank'><TwitterIcon width={20} height={20} className='text-white' /></a> }
                        {v.website && <a href={v.website} target='_blank'><WebsiteIcon width={20} height={20} className='text-white' /></a> }
                      </div>
                    </div>
                  </div>
                </figure>
              ))
            }
          </div>
        </div>
        <Footer />
      </div>
    </DetailsProvider>
  )
}