import { FC } from 'react'

import SectionTitle from '@/components/solid/SectionTitle'

interface Props {}

const BlogSection: FC<Props> = () => {
  return (
    <section className="py-20 home-lg:py-25 home-xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 home-md:px-8 home-xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div
          className="sr-item animate_top text-center mx-auto"
        >
          <SectionTitle title="NEWS & BLOGS" subTitle="Latest News & Blogs" titlePara="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in maximus." />
        </div>
        {/* <!-- Section Title End --> */}
      </div>

      <div className="mx-auto max-w-c-1280 px-4 home-md:px-8 home-xl:px-0 mt-15 home-xl:mt-20">
        <div className="grid grid-cols-1 home-md:grid-cols-2 home-lg:grid-cols-3 gap-7.5 home-xl:gap-10">
          {/* <!-- Blog Item --> */}
          <div className="sr-item animate_top bg-white dark:bg-blacksection rounded-lg shadow-solid-8 p-4 pb-9">
            <a href="#" className="block">
              <img src="/solid/blog/blog-01.png" alt="Blog" />
            </a>

            <div className="px-4">
              <h4 className="font-medium text-lg home-xl:text-itemtitle2 text-black hover:text-primary dark:text-white mt-7.5 mb-3.5">
                <a href="blog-single.html">Free advertising for your online business</a>
              </h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit convallis tortor.</p>
            </div>
          </div>

          {/* <!-- Blog Item --> */}
          <div className="sr-item animate_top bg-white dark:bg-blacksection rounded-lg shadow-solid-8 p-4 pb-9">
            <a href="#" className="block">
              <img src="/solid/blog/blog-02.png" alt="Blog" />
            </a>

            <div className="px-4">
              <h4 className="font-medium text-lg home-xl:text-itemtitle2 text-black hover:text-primary dark:text-white mt-7.5 mb-3.5">
                <a href="bog-single.html">9 simple ways to improve your design skills</a>
              </h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit convallis tortor.</p>
            </div>
          </div>

          {/* <!-- Blog Item --> */}
          <div className="sr-item animate_top bg-white dark:bg-blacksection rounded-lg shadow-solid-8 p-4 pb-9">
            <a href="#" className="block">
              <img src="/solid/blog/blog-03.png" alt="Blog" />
            </a>

            <div className="px-4">
              <h4 className="font-medium text-lg home-xl:text-itemtitle2 text-black hover:text-primary dark:text-white mt-7.5 mb-3.5">
                <a href="blog-single.html">Tips to quickly improve your coding speed.</a>
              </h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit convallis tortor.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection