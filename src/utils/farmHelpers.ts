import { ChainId, JSBI, Pair, Token, TokenAmount } from '@pancakeswap-libs/sdk'
import { getAddress } from './addressHelpers'

const ARCHIVED_FARMS_START_PID = 139
const ARCHIVED_FARMS_END_PID = 250

const isArchivedPid = (pid: number) => pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID

export const calculateUserRewardRate = (
  {
    lpAddresses,
    totalDeposits,
    quoteToken,
    token,
    rewardRate,
    userData,
    pairToken
  }: any) => {
  const stakingToken = new Token(
    ChainId.MAINNET,
    getAddress(lpAddresses),
    18,
  )
  const rewardsToken = new Token(
    ChainId.MAINNET, getAddress(quoteToken.address), quoteToken.decimals)
  const rewardRateAmount = new TokenAmount(rewardsToken, rewardRate ?? 0)
  const stakedAmount = new TokenAmount(stakingToken, userData.stakedBalance ?? 0)
  const totalSupply = new TokenAmount(stakingToken, totalDeposits ?? 0)
  const token0 = new Token(ChainId.MAINNET, getAddress(token.address), token.decimals)
  const token1 = new Token(ChainId.MAINNET, getAddress(pairToken.address), pairToken.decimals)

  const dummyPair = new Pair(new TokenAmount(token0, '0'), new TokenAmount(token1, '0'))

  const totalStakedAmount = new TokenAmount(
    dummyPair.liquidityToken, JSBI.BigInt(totalSupply.raw))

  return new TokenAmount(
    rewardsToken,
    JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
      ? JSBI.divide(JSBI.multiply(rewardRateAmount.raw, stakedAmount.raw), totalStakedAmount.raw)
      : JSBI.BigInt(0),
  )?.multiply(`${60 * 60 * 24 * 7}`)
    ?.toSignificant(4)
}

// export const calcuLateApy = () => {
//
// }

export default isArchivedPid
