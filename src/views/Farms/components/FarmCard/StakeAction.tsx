import React, { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@sparkpointio/sparkswap-uikit'
import { useLocation } from 'react-router-dom'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useLpTokenPrice } from 'state/hooks'
import useStake from 'hooks/useStake'
import useUnstake, { useExit } from 'hooks/useUnstake'
import { Farm } from 'state/types'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Loading from 'components/Loading'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import { getAddress } from '../../../../utils/addressHelpers'
import { calculateUserRewardRate } from '../../../../utils/farmHelpers'

interface FarmCardActionsProps {
  userDataReady?: boolean
  userRate?:string,
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  addLiquidityUrl?: string
  addTokenUrl?: string
  farm?: Farm
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
  addTokenUrl,
  farm,
  userDataReady
}) => {
  const { t } = useTranslation()
  const { onStake } = useStake(pid)
  const { onUnstake } = useExit(getAddress(farm.stakingAddresses))
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const lpPrice = useLpTokenPrice(tokenName)

  const handleStake = async (amount: string, contract?: Contract) => {
    await onStake(amount, contract)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
      addTokenUrl={addTokenUrl}
      farm={farm}
      handleUnstake={handleUnstake}
      maxStake={stakedBalance}
    />
  )
  const earnings = getBalanceAmount(new BigNumber(farm.userData.earnings)).toFormat(6)
  const formatStakedBalance = getBalanceAmount(new BigNumber(farm.userData.stakedBalance)).toFormat(6)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      farm={farm}
      staked={formatStakedBalance}
      earnings={earnings}
      max={stakedBalance} onConfirm={handleUnstake} tokenName={tokenName} />
  )

  const renderStakingButtons = () => {
    let buttonTxt = 'Deposit'
    if (farm.hasEnded && farm.userData.stakedBalance) {
      buttonTxt = 'Withdraw'
    }
    return (
      <Button
        onClick={farm.hasEnded && farm.userData.stakedBalance? onPresentWithdraw: onPresentDeposit}
        disabled={(farm.hasEnded && !farm.userData.stakedBalance) && ['history', 'archived'].some((item) => location.pathname.includes(item))}
        fullWidth
      >
        {userDataReady?
          buttonTxt
          : <Loading /> }
      </Button>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {/* <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance()}</Heading> */}
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
