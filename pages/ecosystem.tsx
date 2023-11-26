import React from 'react'
import Image from 'next/image';
import { DetailsProvider } from '@/contexts/details'
import SearchHeader from "@/components/solid/SearchHeader";

import TwitterIcon from '~@/icons/info/twitter.svg'
import WebsiteIcon from '~@/icons/info/website.svg'

import { EcoSystems } from '@/shared/ecosystem';
import { useRoot } from '@/contexts/root';

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
        <div className="dapp-container main pt-[105px] mb-12.5 sm:w-[84vw] mx-auto">
          <h1 className='text-xxl font-Saira font-normal'>An Ecosystem to Decentralized Future</h1>
          <p className='font-Saira text-md max-w-[800px] mt-1.5 whitespace-pre-wrap break-all'>Texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext</p>
          <div className='flex gap-4.5 mt-5'>
            <button className='button-lg btn-primary text-white min-w-[180px] sm:min-w-[90px]' onClick={testToast}>List My Dapp</button>
          </div>
        </div>
        <div className='border-t border-gray-7'>
          <div className="dapp-container pt-7.5 card-grid grid gap-5 px-3">
            {
             EcoSystems.map(v => (
                <figure key={v.id} className='eco-card group flex flex-col overflow-hidden rounded-[8px] cursor-pointer transition-all duration-300 hover:shadow-member-i'>
                  <div className='w-full bg-primary aspect-square flex flex-col items-center justify-between py-5 relative'>
                    <div className='pt-11 text-center sm:pt-1 flex items-center flex-col'>
                      <Image src={v.logo} alt={v.name} width={120} height={120} className="w-15 h-15 sm:w-8 sm:h-8 object-contain rounded-full" />
                      <p className='text-white text-lgx mt-2.5'>{v.name}</p>
                    </div>
                    <div className='flex gap-2'>
                      {v.field.map((v, i) => <span key={i} className='bg-white px-3 py-[5.5px] rounded-full text-primary text-xs'>{v}</span>)}
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-primary pt-5 sm:pt-2 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <p className='text-white text-sm whitespace-pre-wrap break-all px-5 line-clamp-5'>{v.desc}</p>
                      <div className='border-t border-white py-[13px] sm:py-[8px] px-5 flex items-center justify-around'>
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
      </div>
    </DetailsProvider>
  )
}