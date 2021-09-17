import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  /* {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  */
  {
    pid: 251,
    lpSymbol: 'OWN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB31F2F7939108D9a518f6152689Dc1463091Ee7b',
    },
    stakingAddresses: {
      97: '',
      56: '0x0Fe376032276Ad5fc55e782D6AB1f85Ce0669BFB',
    },
    token: tokens.own,
    quoteToken: tokens.own,
  },
  {
    pid: 252,
    lpSymbol: 'KCLP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xFDD633E7428cAEEc1712Ae9426BE0C29C9A5Cb49',
    },
    stakingAddresses: {
      97: '',
      56: '0x3CE0Dc444298133bD1e16B520Dc1B862c374f281',
    },
    token: tokens.sfuel,
    quoteToken: tokens.sfuel,
  },
  {
    pid: 253,
    lpSymbol: 'KCLP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x9f6b80e3867ab402081574e9e0a3be6fdf4ae95b',
    },
    stakingAddresses: {
      97: '',
      56: '0x64f30722ce788c31dc28f09A6Ce3eA33f742B1D2',
    },
    token: tokens.kclp,
    quoteToken: tokens.kclp,
  },

]

export default farms
