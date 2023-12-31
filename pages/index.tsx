import { FC, Fragment } from 'react'

import HeroSection from '@/components/solid-sections/Hero'
import DataSection from '@/components/solid-sections/Data'
import FeatureSection from '@/components/solid-sections/Feature'
import AboutSection from '@/components/solid-sections/About'
import About2Section from '@/components/solid-sections/About2'
import FeatureTabsSection from '@/components/solid-sections/FeatureTabs'
import CtaSection from '@/components/solid-sections/Cta'
import FAQSection from '@/components/solid-sections/FAQ'
import Lines from "@/components/solid/Lines"
import SearchHeader from '@/components/solid/SearchHeader'
import Footer from '@/components/solid/Footer'
import { DetailsProvider } from '@/contexts/details'

interface Props {

}

const Home: FC<Props> = () => {
  return (
    <Fragment>
      <SearchHeader />
      <main className='mt-[-136px] sm:!mt-safe-offset-[-50px]'>
        {/* <!-- ===== Hero Start ===== --> */}
        <HeroSection />
        {/* <!-- ===== Hero End ===== --> */}

        {/* <!-- ===== Clients Start ===== --> */}
        <DataSection />
        {/* <!-- ===== Clients End ===== --> */}

        {/* <!-- ===== Features Start ===== --> */}
        <FeatureSection />
        {/* <!-- ===== Features End ===== --> */}

        {/* <!-- ===== About Start ===== --> */}
        <AboutSection />
        {/* <!-- ===== About End ===== --> */}

        {/* <!-- ===== About Two Start ===== --> */}
        <About2Section />
        {/* <!-- ===== About Two End ===== --> */}

        {/* <!-- ===== Features Tab Start ===== --> */}
        <FeatureTabsSection />
        {/* <!-- ===== Features Tab End ===== --> */}

        {/* <!-- ===== Integrations Start ===== --> */}
        {/* <IntegrationSection /> */}
        {/* <!-- ===== Integrations End ===== --> */}

        {/* <!-- ===== Funfact Start ===== --> */}
        {/* <FunfactSection /> */}
        {/* <!-- ===== Funfact End ===== --> */}

        {/* <!-- ===== CTA Start ===== --> */}
        <CtaSection />
        {/* <!-- ===== CTA End ===== --> */}

        {/* <!-- ===== FAQ Start ===== --> */}
        <FAQSection />
        {/* <!-- ===== FAQ End ===== --> */}

        {/* <!-- ===== Testimonials Start ===== --> */}
        {/* <TestimonialSection /> */}
        {/* <!-- ===== Testimonials End ===== --> */}

        {/* <!-- ===== Pricing Table Start ===== --> */}
        {/* <PricingTableSection /> */}
        {/* <!-- ===== Pricing Table End ===== --> */}

        {/* <!-- ===== Contact Start ===== --> */}
        {/* <ContactSection /> */}
        {/* <!-- ===== Contact End ===== --> */}

        {/* <!-- ===== Blog Start ===== --> */}
        {/* <BlogSection /> */}
        {/* <!-- ===== Blog End ===== --> */}
        <Lines/>
      </main>
      <Footer/>
    </Fragment>
  )
}


export default function WrappedHome() {
  return (
    <DetailsProvider mode="community" keywords="">
      <Home />
    </DetailsProvider>
  )
}
