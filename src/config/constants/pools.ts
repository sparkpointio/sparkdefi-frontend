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
      97: '',
      56: '0x1be0843bc76f91387a2a6b941c07b0ca09f0b983',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '49603174603174603',
    sortOrder: 999,
    isFinished: false,
  }
]

export default pools
