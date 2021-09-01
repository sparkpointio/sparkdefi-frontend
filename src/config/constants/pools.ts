import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 2,
  //   stakingToken: tokens.srkb,
  //   earningToken: tokens.ttkb,
  //   contractAddress: {
  //     97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f2a',
  //     56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca0a',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '49603174603174603',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  {
    sousId: 3,
    stakingToken: tokens.srkb,
    earningToken: tokens.srkb,
    contractAddress: {
      97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f2a',
      56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca0a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '49603174603174603',
    sortOrder: 999,
    isFinished: true,
  },
  {
    sousId: 4,
    stakingToken: tokens.sfuel,
    earningToken: tokens.sfuel,
    contractAddress: {
      97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f2a',
      56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca0a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '49603174603174603',
    sortOrder: 999,
    isFinished: true,
  }
]

export default pools
