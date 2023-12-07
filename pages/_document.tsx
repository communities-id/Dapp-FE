import { Html, Head, Main, NextScript } from 'next/document'
import { CSSProperties } from 'react'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* default brand color */}
      <body style={{ '--var-brand-color': '#8840FF' } as CSSProperties}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
