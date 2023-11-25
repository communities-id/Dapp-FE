// export const EcoSystems = [
//   {
//     id: 1,
//     name: 'Uniswap',
//     logo: 'https://www.communities.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbasic-capital.e57afaf4.png&w=256&q=75',
//     desc: 'Texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttextttext',
//     field: ['Infrastructure', 'Defi'],
//     twitter: 'https://twitter.com',
//     telegram: 'https://xxx.com',
//     discord: 'https://xxx.com',
//     website: 'https://xxx.com',
//   }
// ]


export const EcoSystems = new Array(100).fill(0).map(v => ({
  id: v + 1,
  name: 'Uniswap',
  logo: 'https://www.communities.id/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbasic-capital.e57afaf4.png&w=256&q=75',
  desc: 'Texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttextttext',
  field: ['Infrastructure', 'Defi'],
  twitter: 'https://twitter.com',
  telegram: 'https://xxx.com',
  discord: 'https://xxx.com',
  website: 'https://xxx.com',
}))