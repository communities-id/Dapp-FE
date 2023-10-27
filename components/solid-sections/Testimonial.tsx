import { FC } from 'react'

import SectionTitle from '@/components/solid/SectionTitle'

interface Props {}

const TestimonialSection: FC<Props> = () => {
  return (
    <section>
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div
          className="sr-item animate_top text-center mx-auto"
        >
          <SectionTitle title="TESTIMONIALS" subTitle="Client’s Testimonials" titlePara="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in maximus."/>
        </div>
        {/* <!-- Section Title End --> */}
      </div>

      <div className="sr-item animate_top mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 mt-15 xl:mt-20">
        {/* <!-- Slider main container --> */}
        <div className="swiper testimonial-01 pb-22.5">
          {/* <!-- Additional required wrapper --> */}
          <div className="swiper-wrapper">
            {/* <!-- Slides --> */}
            <div className="swiper-slide">
              <div className="bg-white rounded-lg shadow-solid-9 dark:shadow-none dark:bg-blacksection dark:border dark:border-strokedark p-9 pt-7.5">
                <div className="flex justify-between border-b border-stroke dark:border-strokedark pb-6 mb-7.5">
                  <div>
                    <h4 className="text-black dark:text-white text-metatitle3 mb-1.5">Devid Smith</h4>
                    <p>Founter @democompany</p>
                  </div>
                  <img className="" src="/solid/user/user-01.svg" alt="User" />
                </div>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, ligula sit amet cursus tincidunt, lorem sem elementum nisi, convallis fringilla ante nibh non urna.</p>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="bg-white rounded-lg shadow-solid-9 dark:shadow-none dark:bg-blacksection dark:border dark:border-strokedark p-9 pt-7.5">
                <div className="flex justify-between border-b border-stroke dark:border-strokedark pb-6 mb-7.5">
                  <div>
                    <h4 className="text-black dark:text-white text-metatitle3 mb-1.5">Jhon Abraham</h4>
                    <p>Founter @democompany</p>
                  </div>
                  <img className="" src="/solid/user/user-02.svg" alt="User" />
                </div>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit, ligula sit amet cursus tincidunt, lorem sem elementum nisi, convallis fringilla ante nibh non urna.</p>
              </div>
            </div>
          </div>
          {/* <!-- If we need pagination --> */}
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection