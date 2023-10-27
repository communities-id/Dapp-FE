import React, { useMemo, Fragment, useEffect  } from 'react'
import { InferGetServerSidePropsType, GetServerSideProps  } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

interface PageProps {
  query: {
    mode: string
    keywords: string
    image: string
  }
}

export const getServerSideProps: GetServerSideProps <PageProps> = async (context) => {
  const { query } = context
  return { props: { query: { mode: String(query.mode ?? 'community'), keywords: String(query.keywords ?? ''), image: String(query.image ?? '') } } }
}

export default function TwitterSharePage({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { mode, keywords, image } = query

  const shareInfo = useMemo(() => {
    return {
      metas: [
        {
          name: 'twitter:site',
          content: '@CommunitiesID'
        },
        {
          name: 'twitter:creator',
          content: '@CommunitiesID'
        },
        {
          name: 'twitter:title',
          content: keywords
        },
        {
          name: 'twitter:description',
          content: 'Communities ID - DID as a Service for community'
        },
        {
          name: 'twitter:image',
          // not support: svg、base64
          content: image || 'https://ipfs.io/ipfs/QmSYEgebBb8PWfsJkdtYQJsXWDTvTAXwjNN5VPYteJZhrw/'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  }, [keywords, image])

  useEffect(() => {
    router?.replace(`/${mode}/${keywords}`)
  }, [router, mode, keywords])

  return (
    <Fragment>
      <Head>
        <title>Communities ID - DID as a Service for community</title>
        <link rel="icon" href="/logo/favicon.svg" />
        <meta name="keywords" content="Web3,NFT,Crypto,DID,Community,Identity"></meta>
        <meta name="description" content="The first DaaS (DID as a Service) system for crypto communities."></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        {
          shareInfo.metas.map((meta, index) => {
            return <meta key={index} {...meta} />
          })
        }
        {/* <meta property="og:url" content="https://communities.id" />
        <meta property="og:title" content="Communities ID - DID as a Service for community" /> */}
        {/* <meta property="og:description" content="In the early days, Twitter grew so quickly that it was almost impossible to add new features because engineers spent their time trying to keep the rocket ship from stalling." /> */}
        {/* <meta property="og:url" content="https://communities.id" />
        <meta property="og:title" content="Communities ID - DID as a Service for community" /> */}
        {/* <meta name="twitter:site" content="@CommunitiesID" />
        <meta name="twitter:creator" content="@CommunitiesID" />
        <meta name="twitter:title" content="Communities ID - DID as a Service for community" />
        <meta name="twitter:image" content="https://w.wallhaven.cc/full/x6/wallhaven-x6p3y3.jpg" />
        <meta property="og:image" content="https://w.wallhaven.cc/full/x6/wallhaven-x6p3y3.jpg" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <main></main>
    </Fragment>
  )
}
