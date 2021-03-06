import { MenuEntry } from '@sparkpointio/sparkswap-uikit'

const config: MenuEntry[] = [
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://sparkswap.finance/#/swap',
      },
      {
        label: 'Liquidity',
        href: 'https://sparkswap.finance/#/pool',
      },
    ],
  },
  {
    label: 'Stake',
    icon: 'FarmIcon',
    items: [
      {
        label: 'Farms',
        href: '/farms',
      },
      {
        label: 'Pools',
        href: '/pools',
      },
      {
        label: 'Old Farms/Pools',
        href: 'https://app.srk.finance/#/stake',
      },
    ],
  },
  {
    label: 'Bridge',
    icon: 'BridgeIcon',
    href: 'https://bridge.sparkswap.finance/#/',
  },
  {
    label: 'Launch',
    icon: 'LaunchIcon',
    href: 'https://launch.sparkswap.finance/#/',
  },
  {
    label: 'Airdrop',
    icon: 'AirdropIcon',
    href: 'https://app.sparkswap.finance/#/airdrop',
  },
  {
    label: 'NFT',
    icon: 'NftIcon',
    items: [
      {
        label: 'Home',
        href: 'https://nft.sparkswap.finance/#/create',
      },
      {
        label: 'Create',
        href: 'https://nft.sparkswap.finance/#/createNFT',
      },
      {
        label: 'My NFTs',
        href: 'https://nft.sparkswap.finance/#/MyNFT',
      },
      {
        label: 'Marketplace',
        href: 'https://nft.sparkswap.finance/#/marketplace',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Info',
        href: 'https://sparkswap.info/#/home',
      },
      {
        label: 'Teams',
        href: 'https://srk.finance/team',
      },
      {
        label: 'Help',
        href: 'https://medium.com/theecosystem/a-beginners-guide-to-sparkswap-79f92a2f7074',
      },
    ],
  },
]

export default config
