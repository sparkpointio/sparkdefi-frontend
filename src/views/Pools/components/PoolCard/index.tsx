import BigNumber from 'bignumber.js'
import React, { useContext } from 'react'
import { CardBody, Flex, Text } from '@sparkpointio/sparkswap-uikit'
import { ThemeContext } from 'styled-components'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'

import AprRow from './AprRow'
import { StyledCard, StyledCardInner } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'


const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const accountHasStakedBalance = stakedBalance.gt(0)
  const theme = useContext(ThemeContext)
  
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
      
          {/* <AprRow pool={pool} stakingTokenPrice={stakingTokenPrice} /> */}
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>Total Deposit</Text>
            <Text>00.00</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>Pool Size</Text>
            <Text>00.00</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
            <Text>APY</Text>
            <Text>0%</Text>
          </Flex>
          <Flex justifyContent="space-between" style={{textAlign: 'left'}}>
        <Text>{t('Your Rate')}</Text>
        <Text>0.00</Text>
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
          <Text color="textSubtle" fontSize="14px">{t('This will only work on Binance Smart Chain')}</Text>
        {/* <CardFooter pool={pool} account={account} /> */ }
    </StyledCard>
  )
}

export default PoolCard
