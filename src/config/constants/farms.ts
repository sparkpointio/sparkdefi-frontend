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
    isPromoted: 1
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
    isPromoted: 1
  },

]

export default farms
