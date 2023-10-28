/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_RPC_KEYS: process.env.NEXT_PUBLIC_RPC_KEYS,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    MASTER_ADDR: process.env.MASTER_ADDR,
  },
  images: {
    domains: [
      'wxnmsjzqruduetshthht.supabase.in',
      'yfftkpyyuxzdowwmneks.supabase.in',
      'pbs.twimg.com',
      'abs.twimg.com',
      'iph.href.lu',
      '*'
    ],
    disableStaticImages: false // 决定 next/image-types/global 是否被导入
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack(config) {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  }
}

module.exports = nextConfig
