import { FC } from 'react'

import DottedBg from '@/components/common/dottedBg'

interface Props {}

const ContactSection: FC<Props> = () => {
  return (
    <section id="support" className="px-4 home-md:px-8 home-2xl:px-0">
      <div className="mx-auto max-w-c-1390 relative pt-10 home-lg:pt-15 home-xl:pt-20 px-7.5 home-lg:px-15 home-xl:px-20 overflow-hidden">
        <div className="absolute -z-1 rounded-lg left-0 top-0 w-full h-2/3 bg-gradient-to-t from-[#F8F9FF] to-[#DEE7FF] dark:bg-gradient-to-t dark:from-[#24283E] dark:to-[#252A42]"></div>
        <DottedBg/>

        <div className="flex flex-wrap home-md:flex-nowrap flex-col-reverse home-md:flex-row gap-8 home-xl:gap-20 home-md:justify-between">
          <div className="sr-item animate_top w-full home-md:w-3/5 home-lg:w-3/4 shadow-solid-8 rounded-lg bg-white dark:bg-black dark:border dark:border-strokedark p-7.5 home-xl:p-15">
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle2 font-semibold mb-15">Send a message</h2>

            <form action="https://formbold.com/s/unique_form_id" method="POST">
              <div className="flex flex-col home-lg:flex-row home-lg:justify-between gap-7.5 home-lg:gap-14 mb-7.5">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full home-lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                />

                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full home-lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                />
              </div>

              <div className="flex flex-col home-lg:flex-row home-lg:justify-between gap-7.5 home-lg:gap-14 mb-12.5">
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full home-lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                />

                <input
                  type="text"
                  placeholder="Phone number"
                  className="w-full home-lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                />
              </div>

              <div className="flex mb-11.5">
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white"
                ></textarea>
              </div>

              <div className="flex flex-wrap home-xl:justify-between gap-10 home-xl:gap-15">
                <div>
                  <label htmlFor="supportCheckbox" className="max-w-[425px] flex cursor-pointer select-none hover:text-primary">
                    <div className="relative">
                      <input type="checkbox" id="supportCheckbox" className="sr-only" />
                      <div className="box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                        <span className="opacity-0">
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none" className="stroke-current">
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              strokeWidth={0.4}
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    By clicking Checkbox, you agree to use our “Form” terms And consent cookie usage in browser.
                  </label>
                </div>

                <button className="inline-flex items-center gap-2.5 bg-black hover:bg-blackho ease-in-out duration-300 dark:bg-btndark font-medium text-white rounded-full px-6 py-3">
                  Send Message
                  <svg className="fill-white" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" fill="" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="sr-item animate_top w-full home-md:w-2/5 home-lg:w-[26%] home-md:p-7.5 home-xl:pt-15">
            <h2 className="text-black dark:text-white text-3xl home-xl:text-sectiontitle2 font-semibold mb-12.5">Find us</h2>

            <div className="mb-7 5">
              <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">Our Loaction</h4>
              <p>290 Maryam Springs 260, Courbevoie, Paris, France</p>
            </div>
            <div className="mb-7 5">
              <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">Email Address</h4>
              <p><a href="#">yourmail@domainname.com</a></p>
            </div>
            <div>
              <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">Phone Number</h4>
              <p><a href="#">+009 42334 6343 843</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection