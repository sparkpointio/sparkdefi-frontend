import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

const StyledFlex = styled(Flex)`
  & > * {
    flex: 1;
    height: 60px;
  }
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice } = pool

  console.log(pool)
  // getBalanceNumber(stakedBalance, stakingToken.decimals)
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const totalStaked = userData?.stakedBalance ? getBalanceNumber(new BigNumber(userData.stakedBalance), stakingToken.decimals) : BIG_ZERO
  const totalEarned = userData?.pendingReward ? getBalanceNumber(new BigNumber(userData.pendingReward)) : BIG_ZERO

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" >
        {harvest && (
          <>
            <Flex justifyContent="space-between">
              <Box display="inline">
                {/* <Text color="text" textTransform="uppercase" bold fontSize="12px"> */}
                <Text color="text" bold fontSize="15px" marginBottom="8px">
                  {`${stakingToken.symbol} Staked`}
                </Text>
              </Box>
              <Box display="inline">
                {/* <Text color="text" textTransform="uppercase" bold fontSize="12px"> */}
                <Text color="text" bold fontSize="15px" marginBottom="8px">
                  {`${earningToken.symbol} Earned`}
                </Text>
              </Box>
            </Flex>
            <Flex justifyContent="space-between" marginBottom="20px">
              <Box display="inline">
                {/* <Text color="text" textTransform="uppercase"  bold fontSize="12px"> */}
                <Text color="text" textTransform="uppercase" fontSize="12px">
                  {`${totalStaked} ${stakingToken.symbol}`}
                </Text>
              </Box>
              <Box display="inline">
                {/* <Text color="text" textTransform="uppercase" bold fontSize="12px"> */}
                <Text color="text" textTransform="uppercase" fontSize="12px">
                  {`${totalEarned} ${earningToken.symbol}`}
                </Text>
              </Box>
            </Flex>
          </>
        )}
        {/* <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box> */}
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StyledFlex justifyContent="space-between" marginTop="10px">
             <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
             <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
            />
          </StyledFlex>
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions