import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import { JSBI } from '@pancakeswap-libs/sdk'
import { now } from 'lodash'
import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import lpStaking from 'config/abi/lpStaking.json'
import { Farm, SerializedBigNumber } from '../types'
import { DEFAULT_TOKEN_DECIMAL } from '../../config'
import { getBalanceAmount } from '../../utils/formatBalance'

type PublicFarmData = {
  totalDeposits: SerializedBigNumber
  rewardRate: SerializedBigNumber
  totalRewardRate: SerializedBigNumber
  hasEnded: boolean
  remainingDays: string
  tokenAmountMc: SerializedBigNumber
  quoteTokenAmountMc: SerializedBigNumber
  tokenAmountTotal: SerializedBigNumber
  quoteTokenAmountTotal: SerializedBigNumber
  lpTotalInQuoteToken: SerializedBigNumber
  lpTotalSupply: SerializedBigNumber
  tokenPriceVsQuote: SerializedBigNumber
  poolWeight: SerializedBigNumber
  multiplier: string
}

const fetchFarm = async (farm: Farm): Promise<PublicFarmData> => {
  const { pid, lpAddresses, token, quoteToken, stakingAddresses } = farm
  const lpAddress = getAddress(lpAddresses)
  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
  ]

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls)
  const lpStakingCalls = [
    // Total deposits in staking address
    {
      address: getAddress(stakingAddresses),
      name: 'totalSupply',
    },
    // Total deposits in staking address
    {
      address: getAddress(stakingAddresses),
      name: 'periodFinish',
    },
    {
      address: getAddress(stakingAddresses),
      name: 'rewardRate',
    },
  ]
  const [totalSupply, periodFinish, rewardRate] =
    await multicall(lpStaking, lpStakingCalls)

  // Total Deposits in staking address
  const totalDeposits = new BigNumber(totalSupply)

  // total reward rate
  const totalRewardRate = new BigNumber(rewardRate).times(60 * 60 * 24 * 7)

  // console.log(totalRewardRate)

  const endDate = (new Date(0)).setUTCSeconds(periodFinish);
  const hasEnded = endDate < now();
  const remainingDays = (Math.max(0, Math.ceil(((((endDate - now()) / 1000) / 60) / 60) / 24))).toString();

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint] =
    pid || pid === 0
      ? await multicall(masterchefABI, [
          {
            address: getMasterChefAddress(),
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: getMasterChefAddress(),
            name: 'totalAllocPoint',
          },
        ])
      : [null, null]

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO

  return {
    totalDeposits: totalDeposits.toJSON(),
    'rewardRate': new BigNumber(rewardRate).toJSON(),
    'totalRewardRate': totalRewardRate.toJSON(),
    'hasEnded': hasEnded,
    'remainingDays': remainingDays,
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
  }
}

export default fetchFarm
