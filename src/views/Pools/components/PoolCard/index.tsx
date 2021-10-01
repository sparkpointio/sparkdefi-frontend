import BigNumber from 'bignumber.js'
import React, { useContext, useEffect, useState } from 'react'
import { CardBody, Flex, Text , Link, LinkExternal} from '@sparkpointio/sparkswap-uikit'
import { ThemeContext } from 'styled-components'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { usePoolPrice } from 'hooks/price'
import { getPoolApr } from 'utils/apr'
import { Pool } from 'state/types'
import { getBalanceNumber , formatNumber } from 'utils/formatBalance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { useBlock } from 'state/block/hooks'
import { getBscScanLink } from 'utils'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'


const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData, startBlock, endBlock, isComingSoon } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  const theme = useContext(ThemeContext)

  const totalStaked = pool.totalStaked ? getBalanceNumber(new BigNumber(pool.totalStaked.toString()), stakingToken.decimals) : 0

  const rewardPerBlock = pool?.tokenPerBlock ? getBalanceNumber(new BigNumber(pool.tokenPerBlock.toString()), earningToken.decimals) : 0

  const temp = new BigNumber(pool.tokenPerBlock).times( new BigNumber(userData.stakedBalance).div(pool.totalStaked)  )
  const rewardRate = pool?.tokenPerBlock ? getBalanceNumber(temp) : 0

  const { currentBlock } = useBlock()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
  getPoolBlockInfo(pool, currentBlock)

  const {stakingPrice, rewardPrice} = usePoolPrice(stakingToken.address[56], earningToken.address[56])

  const apr = getPoolApr(stakingPrice, rewardPrice, totalStaked, rewardPerBlock)

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
    >
        <StyledCardHeader
          isStaking={accountHasStakedBalance}
          earningToken={earningToken}
          stakingToken={stakingToken}
          isFinished={isFinished && sousId !== 0}
        />
         <hr style={{width: '100%', border: 'none', backgroundColor: theme.colors.primary, height: '2px'}}/>

          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>Remaining blocks</Text>
            <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
              <Text>{!isComingSoon && `${ formatNumber(blocksRemaining, 0, 0) }`} {isComingSoon && '-'} blocks</Text>
            </Link>
          </Flex>

          {/* <AprRow pool={pool} stakingTokenPrice={stakingTokenPrice} /> */}
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>Total Deposit</Text>
            <Text>{!isComingSoon && `${ formatNumber(totalStaked) }`} {isComingSoon && '-'} {stakingToken.symbol}</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
              <Text>Reward per block</Text>
              <Text>{!isComingSoon && rewardPerBlock} {isComingSoon && '-'}</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>APY</Text>
            <Text>{(apr === 0 || apr === null ? "-- " : apr.toFixed(2))}%</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
        <Text>{t('Your Rate')}</Text>
        <Text>{!isComingSoon && formatNumber(rewardRate,2,10)} {isComingSoon && '-'} {pool.earningToken.symbol}/block</Text>
      </Flex>
          <Flex mt="24px" flexDirection="column" marginTop="10px">
            {account ? (
              <CardActions pool={pool} stakedBalance={stakedBalance} />
            ) : (
              <>
                <UnlockButton />
              </>
            )}
          </Flex>
          {/* <Text color="textSubtle" fontSize="14px">{t('This will only work on Binance Smart Chain')}</Text> */}
        {/* <CardFooter pool={pool} account={account} /> */ }
    </StyledCard>
  )
}

export default PoolCard
