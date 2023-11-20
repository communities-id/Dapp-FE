import '@fontsource-variable/saira';
import '@/styles/globals.css'
import '@/styles/site.scss'
import '@rainbow-me/rainbowkit/styles.css';
import React, { useMemo, Fragment } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'

import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '@/config/rainbowKit'
import { Analytics } from '@vercel/analytics/react';
import RainbowKitLayout from '@/layouts/rainbowKit';

import { ToastContextProvider } from '@/shared/useToast'
import { RootProvider } from '@/contexts/root'
import { ConfigurationProvider } from '@/contexts/configuration'
import { TokenPriceProvider } from '@/contexts/tokenPrice';

(BigInt.prototype as any).toJSON = function() {
  return this.toString()
}

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Fragment>
      <Head>
        <title>Communities ID - DID as a Service for community</title>
        <link rel="icon" href="/logo/favicon.svg" />
        <meta name="keywords" content="Web3,NFT,Crypto,DID,Community,Identity"></meta>
        <meta name="description" content="The first DaaS (DID as a Service) system for crypto communities."></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        {/* <meta property="og:url" content="https://communities.id" />
        <meta property="og:title" content="Communities ID - DID as a Service for community" /> */}
        {/* <meta property="og:description" content="In the early days, Twitter grew so quickly that it was almost impossible to add new features because engineers spent their time trying to keep the rocket ship from stalling." /> */}
        {/* <meta name="twitter:site" content="@CommunitiesID" />
        <meta name="twitter:creator" content="@CommunitiesID" />
        <meta property="twitter:title" content="Communities ID - DID as a Service for community" />
        <meta property="twitter:image" content="https://w.wallhaven.cc/full/x6/wallhaven-x6p3y3.jpg" />
        <meta property="og:image" content="https://w.wallhaven.cc/full/x6/wallhaven-x6p3y3.jpg" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitLayout>
          <RootProvider>
            <ToastContextProvider>
              <ConfigurationProvider>
                <TokenPriceProvider>
                  <Component {...pageProps} />
                  <Analytics />
                </TokenPriceProvider>
              </ConfigurationProvider>
            </ToastContextProvider>
          </RootProvider>
        </RainbowKitLayout>
      </WagmiConfig>
    </Fragment>
  )
}
