import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  Slider, BalanceInput, } from '@pancakeswap/uikit';
import { Modal, Text, Flex, Image, Button, AutoRenewIcon, Link, Dropdown  } from '@sparkpointio/sparkswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { ChevronDown, ChevronUp } from 'react-feather';
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
// import StakeTokenModal from './Stake';
import PercentageButton from './PercentageButton'


interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
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
  isRemovingStake = false,
  onDismiss,
}) => {
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId, pool.enableEmergencyWithdraw)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance
  }
  
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())
  const [activeSelect, setActiveSelect] = useState(false)
  
  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
    }
  }, [stakeAmount, stakingLimit, userData, stakingToken, isRemovingStake, setHasReachedStakedLimit])

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingToken.decimals)
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setStakeAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent)
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals)
      setStakeAmount(amountToStake)
    } else {
      setStakeAmount('')
    }
    setPercent(sliderPercent)
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isRemovingStake) {
      // unstaking
      try {
        await onUnstake(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } else {
      try {
        // staking
        await onStake(stakeAmount, stakingToken.decimals)
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the pool!', {
            symbol: stakingToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
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
        <StyledFlex marginTop="21px">
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.stakingToken.symbol} Tokens</Text>
            <Button fullWidth>Add more</Button>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.earningToken.symbol} Tokens</Text>
            <Button fullWidth>Add More</Button>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.stakingToken.symbol} Tokens</Text>
            <Button fullWidth >Stake Tokens</Button>
          </Flex>
        </StyledFlex>
        <StyledFlex >
        <hr style={{marginTop: '30px', border: 'none', borderTop: `2px solid ${theme.colors.primary}` }} />
        </StyledFlex>
        <StyledFlex marginTop="30px" marginBottom="20px">
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle" fontSize="17px">Your Rate {pool.earningToken.symbol}/Week Tokens</Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle" fontSize="17px">{pool.earningToken.symbol} Token Earnings</Text>
          </Flex>
          <Flex flexDirection="column" mb="16px" marginLeft="5px"
          onMouseEnter={() => setActiveSelect(true)}
          onMouseLeave={() => setActiveSelect(false)}>
        
         <Dropdown
            position="top"
            target={
              <Button fullWidth variant="secondary"><Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />}
               {/* <Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />} */}
              </Button>
            }
          >
            {/* <Button fullWidth onClick={"onDismiss"}  disabled={rawEarningsBalance.eq(0) || pendingTx} > */}
              <Button fullWidth>
              <Text>Claim</Text>
            </Button>
            <Button>
              <Text>Claim & Withdraw</Text>
            </Button>
          </Dropdown>
    </Flex>
        </StyledFlex>
      </Flex>
    </Modal>
  )
}

export default StakeModal
