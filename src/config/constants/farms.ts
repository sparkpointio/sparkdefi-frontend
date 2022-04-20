import tokens from './tokens'
import { FarmConfig } from './types'
import { CAKE_INFO_URL, PANCAKE_ADD_LIQUIDITY_URL } from '../index'

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

  /**
   * INTERNAL STAKING POOLS
   */
  // OWN - BNB - OWN
  {
    pid: 251,
    lpSymbol: 'SRKb-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD581CdF609DD50fbaa25118583c6EE31b39662F9',
    },
    stakingAddresses: {
      97: '',
      56: '0xCec445174D6f4e87d38d43d4b13E36dd55CC56A1',
    },
    token: tokens.srkb,
    pairToken: tokens.wbnb,
    quoteToken: tokens.srkb,
  },
  {
    pid: 252,
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
    pairToken: tokens.wbnb,
    quoteToken: tokens.own,
  },

  /**
   * EXTERNAL STAKING POOLS
   */
  {
    pid: 253,
    lpSymbol: 'KGO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xAB80cD24f54566FD482ffd928c13b4a618DC6d0c',
    },
    stakingAddresses: {
      97: '',
      56: '0xF5927A81112ED7a5680DfB8D63E230b8c527CEA7',
    },
    token: tokens.kgo,
    pairToken: tokens.wbnb,
    quoteToken: tokens.srkb,
  },
  // KCLP - BUSD - SFUEL
  {
    pid: 254,
    lpSymbol: 'KCLP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xFDD633E7428cAEEc1712Ae9426BE0C29C9A5Cb49',
    },
    stakingAddresses: {
      97: '',
      56: '0x3CE0Dc444298133bD1e16B520Dc1B862c374f281',
    },
    token: tokens.kclp,
    pairToken: tokens.busd,
    quoteToken: tokens.sfuel,
    isPromoted: 1,
  },
  // KCLP - BUSD - KCLP
  {
    pid: 255,
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
    pairToken: tokens.busd,
    quoteToken: tokens.kclp,
    liquidityUrl: PANCAKE_ADD_LIQUIDITY_URL,
    infoURL: CAKE_INFO_URL,
  },
  // TIPSY - BNB - KCLP
  {
    pid: 256,
    lpSymbol: 'TIPSY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xdF306B071D0DcA82580ff0B7834b5Fc962fb30F8',
    },
    stakingAddresses: {
      97: '',
      56: '0xA24a42f5DCbe5AbaEf992818cC05e1Fd00a8A780',
    },
    token: tokens.tipsy,
    pairToken: tokens.wbnb,
    quoteToken: tokens.tipsy,
    isPromoted: 1,
  },
  // GZILA - BUSD - SFUEL
  {
    pid: 257,
    lpSymbol: 'GZILA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8C7F831c673CDf29A9fb996593d8a7c71c028959',
    },
    stakingAddresses: {
      97: '',
      56: '0x43BDf10036Dad8622569677217B40a0EdD2510C8',
    },
    token: tokens.gzila,
    pairToken: tokens.busd,
    quoteToken: tokens.sfuel,
    isPromoted: 1,
  },
  {
    pid: 258,
    lpSymbol: 'FLASH-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x34E5f2A523a4f192Cfa495Ba330EC2eC220c9e60',
    },
    stakingAddresses: {
      97: '',
      56: '0x827a57f1BA89197a916916739fFE9aFBEe0D7670',
    },
    token: tokens.flash,
    pairToken: tokens.busd,
    quoteToken: tokens.flash,
    isPromoted: 1,
  },
  {
    pid: 259,
    lpSymbol: 'BHC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x19e3cd6418d81d69a71b3fc931387a2062c5a815',
    },
    stakingAddresses: {
      97: '',
      56: '0xD314dbD9998401770943EcdBE97f78Ea2f0dEE62',
    },
    token: tokens.bhc,
    pairToken: tokens.busd,
    quoteToken: tokens.bhc,
    isPromoted: 1,
  },
  {
    pid: 260,
    lpSymbol: 'HPS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xaaf827e2eaf72c62e77047458cbd40e7f30f1896',
    },
    stakingAddresses: {
      97: '',
      56: '0x5a870495971ed55bd377fc390f46ab1b96bcd6b4',
    },
    token: tokens.hps,
    pairToken: tokens.busd,
    quoteToken: tokens.hps,
    isPromoted: 1,
  },
  {
    pid: 261,
    lpSymbol: 'SRKb-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd581cdf609dd50fbaa25118583c6ee31b39662f9',
    },
    stakingAddresses: {
      97: '',
      56: '0x13b9294FFC6cf6cE10A115E5B8025316f1893167',
    },
    token: tokens.srkb,
    pairToken: tokens.wbnb,
    quoteToken: tokens.srkb,
    isPromoted: 1,
  },
  {
    pid: 262,
    lpSymbol: 'SFUEL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0f105b57c4aa5e288a9d291de7c37ad511570e3a',
    },
    stakingAddresses: {
      97: '',
      56: '0xB11dDED8a4218e22866338F3a7AD9948457D9740',
    },
    token: tokens.sfuel,
    pairToken: tokens.wbnb,
    quoteToken: tokens.sfuel,
    isPromoted: 1,
  },
  {
    pid: 263,
    lpSymbol: 'TIPSY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xdF306B071D0DcA82580ff0B7834b5Fc962fb30F8',
    },
    stakingAddresses: {
      97: '',
      56: '0x61c5C5b4C937F8407615eF55334a0Af2A709DDD8',
    },
    token: tokens.tipsy,
    pairToken: tokens.wbnb,
    quoteToken: tokens.tipsy,
    isPromoted: 1,
  },
  {
    pid: 264,
    lpSymbol: 'MGG-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xb2F6FE5e9C83ad968fde18306D35caf8555BcD9f',
    },
    stakingAddresses: {
      97: '',
      56: '0x57DE775D524545Fab61978b60312ada906CFE355',
    },
    token: tokens.mgg,
    pairToken: tokens.busd,
    quoteToken: tokens.mgg,
    isPromoted: 1,
  },
]

export default farms
