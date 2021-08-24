import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.cake,
    earningToken: tokens.cake,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 183,
    stakingToken: tokens.srkb,
    earningToken: tokens.ttkb,
    contractAddress: {
      97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f2a',
      56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca0a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '49603174603174603',
    sortOrder: 999,
    isFinished: false,
  }
]

export default pools
