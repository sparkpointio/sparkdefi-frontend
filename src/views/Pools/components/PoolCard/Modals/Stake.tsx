import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Slider, BalanceInput, AutoRenewIcon, Link } from '@pancakeswap/uikit'
import { Modal, Text, Flex, Image, Button} from '@sparkpointio/sparkswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { useSousApprove, useSousApproveWithAmount } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import { getFullDisplayBalance, formatNumber, getDecimalAmount, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import ModalInput from 'components/ModalInput'
import { getAddress } from 'utils/addressHelpers'
import PercentageButton from './PercentageButton'

interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onSelectMax?: () => void
  onDismiss?: () => void
  isApprove?: boolean
}

const StyledLink = styled(Link)`
  width: 100%;
`

const ModalBody = styled(Flex)`
  width: 450px;
  margin-top: -20px;
  padding: 20px;
`
const StakeActionModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
  isApprove = false,
}) => {
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool
  const approveBtn = useRef(null);
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId, pool.enableEmergencyWithdraw)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  // const [approvedTx, setApprovedTx] = useState(false)
  const [isApproved, setIsApproved] = useState(isApprove)
  const [stakeAmount, setStakeAmount] = useState('')
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false)
  const [percent, setPercent] = useState(0)
  const userLimit = stakingLimit.minus(userData.stakedBalance);
  const totalStakedTokens = userData?.stakedBalance ? getBalanceNumber(new BigNumber(userData.stakedBalance), stakingToken.decimals) : BIG_ZERO
  const numTotalStaked = totalStakedTokens
  const totalStakingTokens = userData?.stakingTokenBalance ? getBalanceNumber(new BigNumber(userData.stakingTokenBalance), stakingToken.decimals) : BIG_ZERO
  const remainingStakeTokens = userData?.stakedBalance ? getBalanceNumber(new BigNumber(pool.stakingLimit.minus(userData.stakedBalance)), stakingToken.decimals) : BIG_ZERO
  const { handleApprove, requestedApproval } = useSousApproveWithAmount(stakingTokenContract, sousId, earningToken.symbol, getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals))
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? userLimit : stakingTokenBalance
  }

  
  const usdValueStaked = stakeAmount && formatNumber(new BigNumber(stakeAmount).times(stakingTokenPrice).toNumber())

  useEffect(() => {
    if (pendingTx === false){
      setIsApproved(false)
    }
  }, [pendingTx])

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit))
    }
    setIsApproved(userData.allowance.lt(stakingLimit))
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

  // const handleApproveClick = async () => {
  //   setApprovedTx(true)
  // }

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
        setIsApproved(false)
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
    <Modal title="" onDismiss={onDismiss}>
      <ModalBody flexDirection="column">
        {/* {stakingLimit.gt(0) && !isRemovingStake && (
          <Text color="secondary" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
            {t('Max stake for this pool: %amount% %token%', {
              amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
              token: stakingToken.symbol,
            })}
          </Text>
        )} */}

        <Flex justifyContent="center">
          <Text color="textSubtle" fontSize="14px" mb="38px" mt="-48px" style={{ textAlign: 'center'}}>
            {t('Maximum stakable amount in this pool: %maxstake% %tokensymbol%', {
              maxstake: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
              tokensymbol: pool.stakingToken.symbol
            })}
          </Text>
        </Flex> 

        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text bold>Stake amount</Text>
          {/* <Flex alignItems="center">
            <Image
              src={`/images/tokens/${getAddress(stakingToken.address)}.png`}
              width={24}
              height={24}
              alt={stakingToken.symbol}
            />
            <Text ml="4px" bold>
              {stakingToken.symbol}
            </Text>
          </Flex> */}
        </Flex>
        <ModalInput
          value={stakeAmount}
          onSelectMax={() => {handleChangePercent(100)}}
          onChange={e => handleStakeInputChange(e.currentTarget.value)}
          max={getFullDisplayBalance(new BigNumber(userLimit), stakingToken.decimals, 0)}
          symbol={stakingToken.symbol}
          addLiquidityUrl=''
        />
        
        {/* Fetch and display actual balance */}
        
        <Text color="textSubtle" fontSize="14px" mb="8px" style={{ textAlign: 'left'}}>
          Remaining stakable amount: {remainingStakeTokens} {pool.stakingToken.symbol}
        </Text>
        

        <div>
        <Text ml="auto" color="textSubtle" fontSize="14px" mb="8px" style={{ textAlign: 'left'}}>
          {/* {t('Balance: %balance%', {
            balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
          })} */}
          Balance: {totalStakingTokens.toFixed(4)} {pool.stakingToken.symbol}
        </Text>
        </div>
        
        
        
        {/* {hasReachedStakeLimit && (
          <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
            {t('Maximum total stake: %amount% %token%', {
              amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
              token: stakingToken.symbol,
            })}
          </Text>
        )} */}
        {/* <Flex>
        <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px" mt="-8px" style={{ textAlign: 'left'}}>
          {t('Balance: %balance%', {
            balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
          })}
        </Text>
        </Flex> */}
        {/* <Slider
          min={0}
          max={100}
          value={percent}
          onValueChanged={handleChangePercent}
          name="stake"
          valueLabel={`${percent}%`}
          step={1}
        />
        <Flex alignItems="center" justifyContent="space-between" mt="8px">
          <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
          <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
          <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
          <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
        </Flex> */}

        <Flex justifyContent="space-between"  marginTop="17px" marginBottom="17px">
          <Text bold>Approved Tokens</Text>
          <Text>
            {/* {!approvedTx ? "0.00" : stakeAmount} */}
            {/* {stakeAmount} */}
          </Text>
        </Flex>
        <Flex style={{width: '100%'}}>
        <Button
          isLoading={pendingTx}
          // endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          // onClick={handleApproveClick}
          // disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || approvedTx}
          onClick={handleApprove}
          disabled={!isApproved || !stakeAmount}
          mt="24px"
          fullWidth
          marginRight="20px"
        >
         Approve
        </Button>
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || isApproved}
          // disabled={!approvedTx}
          mt="24px"
          fullWidth
          marginLeft="20px"
        >
          {/* {pendingTx ? t('Depositing') : t('Deposit')} */}
          {t('Deposit')}
        </Button>
        </Flex>
        {/* {!isRemovingStake && (
          <StyledLink external href={BASE_EXCHANGE_URL}>
            <Button fullWidth mt="8px" variant="secondary">
              {t('Get %symbol%', { symbol: stakingToken.symbol })}
            </Button>
          </StyledLink>
        )} */}
      </ModalBody>
    </Modal>
  )
}

export default StakeActionModal
