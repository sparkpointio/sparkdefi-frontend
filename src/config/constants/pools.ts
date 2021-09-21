import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 3,
    stakingToken: tokens.srkb,
    earningToken: tokens.srkb,
    contractAddress: {
      97: '0x0dE59a7217deAa24f891797142F6fBf9CE78B698',
      56: '0x0dE59a7217deAa24f891797142F6fBf9CE78B698',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '2893518518518518518',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  {
    sousId: 4,
    stakingToken: tokens.sfuel,
    earningToken: tokens.sfuel,
    contractAddress: {
      97: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
      56: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '135030864197530864',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  {
    sousId: 5,
    stakingToken: tokens.kroot,
    earningToken: tokens.srkb,
    contractAddress: {
      97: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
      56: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '135030864197530864',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  {
    sousId: 6,
    stakingToken: tokens.srkb,
    earningToken: tokens.kroot,
    contractAddress: {
      97: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
      56: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '135030864197530864',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  {
    sousId: 7,
    stakingToken: tokens.bglg,
    earningToken: tokens.sfuel,
    contractAddress: {
      97: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
      56: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '135030864197530864',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  {
    sousId: 8,
    stakingToken: tokens.sfuel,
    earningToken: tokens.bglg,
    contractAddress: {
      97: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
      56: '0x54277Be7F64168E8713B710fbCcC5b2B663BD637',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '135030864197530864',
    sortOrder: 999,
    isFinished: false,
    isComingSoon: false,
  },
  // Dummy Contract #1
  // {
  //   sousId: 4,
  //   stakingToken: tokens.sfuel,
  //   earningToken: tokens.sfuel,
  //   contractAddress: {
  //     97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f1a',
  //     56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca1a',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '49603174603174603',
  //   sortOrder: 999,
  //   isFinished: true,
  //   isComingSoon: true,
  // },
  // Dummy Contract #2
  // {
  //   sousId: 5,
  //   stakingToken: tokens.srkb,
  //   earningToken: tokens.sfuel,
  //   contractAddress: {
  //     97: '0xa4bf8a4abb7fd91971854ac0aade50c61afd9f3a',
  //     56: '0x9c03326543bf9a927a5ff51c407fbc444f19ca3a',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '49603174603174603',
  //   sortOrder: 999,
  //   isFinished: true,
  //   isComingSoon: false,
  // }
]

export default pools
