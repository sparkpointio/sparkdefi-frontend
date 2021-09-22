import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  Slider, BalanceInput, } from '@pancakeswap/uikit';
import { Modal, Text, Flex, Image, Button, AutoRenewIcon, Link, Dropdown, useModal} from '@sparkpointio/sparkswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { ChevronDown, ChevronUp } from 'react-feather';
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useSousHarvest } from 'hooks/useHarvest'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useTokenBalance from 'hooks/useTokenBalance'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'

import StakeTokenModal from './Stake';
import PercentageButton from './PercentageButton'

interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
  addTokenUrl?: string
}

const StyledLink = styled(Link)`
  width: 100%;
`
const StyledFlex = styled(Flex)`
justify-content: center;
  & > * {
    flex: 1;
    margin: 0px 10px;
  }
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  addTokenUrl,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId, false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [activeSelect, setActiveSelect] = useState(false)
  const { balance: earnedTokenBalance } = useTokenBalance(pool.earningToken.address[56])
  const { toastSuccess, toastError } = useToast()
  const totalStakingTokens = userData?.stakingTokenBalance ? getBalanceNumber(new BigNumber(userData.stakingTokenBalance), stakingToken.decimals) : 0
  const totalStakedTokens = userData?.stakedBalance ? getBalanceNumber(new BigNumber(userData.stakedBalance), stakingToken.decimals) : 0
  const totalEarningTokens = earnedTokenBalance ? getBalanceNumber(new BigNumber(earnedTokenBalance)) : 0
  const totalEarnedTokens = userData?.pendingReward ? getBalanceNumber(new BigNumber(userData.pendingReward)) : 0
  const [pendingTx, setPendingTx] = useState(false)
  const temp = new BigNumber(pool.tokenPerBlock).times( new BigNumber(userData.stakedBalance).div(pool.totalStaked)  ) 

  const rewardRate = pool?.tokenPerBlock ? getBalanceNumber(temp) : 0
  const [ onPresentStakeAction ] = useModal(<StakeTokenModal isBnbPool={isBnbPool} pool={pool} stakingTokenBalance={stakingTokenBalance} stakingTokenPrice={stakingTokenPrice} />)
  
  const handleHarvestConfirm = async () => {
    setPendingTx(true)
      // harvesting
      try {
        await onReward()
        toastSuccess(
          `${t('Claimed')}!`,
          t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        console.error(e)
        setPendingTx(false)
      }
  }

  const handleUnstake = async () => {
    setPendingTx(true)
      // unstaking
      try {
        await onUnstake(getFullDisplayBalance(new BigNumber(userData.stakedBalance), stakingToken.decimals, 18) , stakingToken.decimals)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been claimed to your wallet!', {
            symbol: earningToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } 
  

  return (
    <Modal
    title=""
    onDismiss={onDismiss}
  >
    <Flex flexDirection="column" style={{marginTop: '-50px', width: "550px"}} >
      <Text fontSize="20px" marginBottom="10px" marginLeft="10px">Account Info</Text>
      <Text fontSize="15px" marginLeft="10px">Staking, balances & earnings</Text>

      {/* Remove extra add liquidity button component when staking token symbol is equal to earning token symbol */}
      {pool.stakingToken.symbol === pool.earningToken.symbol ? 
        <StyledFlex marginTop="21px">
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalStakingTokens,2,5)}</Text>
          <Text color="textSubtle" marginBottom="24px">{pool.stakingToken.symbol} Tokens</Text>
          <Button fullWidth as="a" href={`https://sparkswap.finance/#/swap/${pool.stakingToken.address[56]}`}>Add More</Button>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalStakedTokens,2,5)}</Text>
          <Text color="textSubtle" marginBottom="24px">{pool.stakingToken.symbol} Staked</Text>
          <Button fullWidth onClick={onPresentStakeAction}>Stake Tokens</Button>
        </Flex>
        </StyledFlex> :
        
        // Render two 'Add More' button components when staking token symbol is not equal to earning token symbol
        <StyledFlex marginTop="21px">
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalStakingTokens,2,5)}</Text>
          <Text color="textSubtle" marginBottom="24px">{pool.stakingToken.symbol} Tokens</Text>
          <Button fullWidth as="a" href={`https://sparkswap.finance/#/swap/${pool.stakingToken.address[56]}`}>Add More</Button>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalEarningTokens,2,5)}</Text>
          <Text color="textSubtle" marginBottom="24px">{pool.earningToken.symbol} Tokens</Text>
          <Button fullWidth as="a" href={`https://sparkswap.finance/#/swap/${pool.earningToken.address[56]}`}>Add More</Button>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalStakedTokens,2,5)}</Text>
          <Text color="textSubtle" marginBottom="24px">{pool.stakingToken.symbol} Staked</Text>
          <Button fullWidth onClick={onPresentStakeAction}>Stake Tokens</Button>
        </Flex>
        </StyledFlex>
      }
      
      <StyledFlex >
      <hr style={{marginTop: '30px', border: 'none', borderTop: `2px solid ${theme.colors.primary}` }} />
      </StyledFlex>
      <StyledFlex marginTop="30px" marginBottom="20px">
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(rewardRate,2,10)}</Text>
          <Text color="textSubtle" fontSize="17px">Your Rate {pool.earningToken.symbol}/block</Text>
        </Flex>
        <Flex flexDirection="column">
          <Text fontSize="24px">{formatNumber(totalEarnedTokens,2,5)}</Text>
          <Text color="textSubtle" fontSize="17px">{pool.earningToken.symbol} Token Earnings</Text>
        </Flex>
        <Flex flexDirection="column" mb="16px" marginLeft="5px"
        onMouseEnter={() => setActiveSelect(true)}
        onMouseLeave={() => setActiveSelect(false)}>
      
       {userData.stakedBalance.eq(0) ? <Button disabled fullWidth> Withdraw </Button> : <Dropdown
          position="top"
          target={
            // Disable component if total staked tokens is empty
            <Button fullWidth variant="secondary">
              <Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />}
            </Button>
          }
        >
            {/* Disable Claim & Withdraw if no staked tokens */}
            <Button fullWidth>
              <Text onClick={handleHarvestConfirm}>Claim</Text>
            </Button>
            <Button>
              <Text onClick={handleUnstake}>Claim & Withdraw</Text>
            </Button>
        </Dropdown>

       }
       

       
  </Flex>
      </StyledFlex>
    </Flex>
  </Modal>
  )
}

export default StakeModal