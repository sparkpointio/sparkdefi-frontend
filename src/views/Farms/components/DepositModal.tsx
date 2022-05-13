import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, Skeleton, Text, useModal } from '@sparkpointio/sparkswap-uikit'
import { useApprove } from 'hooks/useApprove'
import { useERC20, useLPStakingContract } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { useAppDispatch } from 'state'
import { Farm } from 'state/types'
import useMedia from 'use-media'
import { useTheme } from '@mui/material/styles'
import { Grid } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { fetchFarmUserDataAsync } from 'state/farms'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import WithdrawModal from './WithdrawModal'
import Container, { ActionDiv, DetailsCont, ModalFooter } from './Styled'
import { ModalHr } from './Divider'
import StakeModal from './Modals/Stake'
import ClaimModal from './Modals/ClaimModal'
import { calculateUserRewardRate } from '../../../utils/farmHelpers'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, contract: Contract) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  addTokenUrl?: string
  farm?: Farm
  handleUnstake?: (amount: string) => void
  maxStake?: BigNumber
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  addLiquidityUrl,
  addTokenUrl,
  handleUnstake,
  farm,
  maxStake,
}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { t } = useTranslation()
  const [activeSelect, setActiveSelect] = useState(false)
  const { allowance, tokenBalance, stakedBalance, earnings } = farm.userData || {}
  const userRate = calculateUserRewardRate(farm)
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { pid, lpAddresses } = farm
  const lpAddress = getAddress(lpAddresses)
  const lpContract = useERC20(lpAddress)
  const RewardTokenBalance = useTokenBalance(getAddress(farm.quoteToken.address))
  const formatTokenBalance = getBalanceAmount(RewardTokenBalance.balance).toFormat(6)
  const formatLPTokenBalance = getBalanceAmount(new BigNumber(tokenBalance)).toFormat(6)
  const formatStakedTokenBalance = getBalanceAmount(new BigNumber(stakedBalance)).toFormat(6)
  const formatTokenEarnings = getBalanceAmount(new BigNumber(earnings)).toFormat(6)
  const muitheme = useTheme()
  const largeScreen = useMediaQuery(muitheme.breakpoints.up('md'))

  const [isApproved, setIsApproved] = useState(
    account && allowance && new BigNumber(allowance).isGreaterThanOrEqualTo(tokenBalance),
  )
  const lpStakingAddress = getAddress(farm.stakingAddresses)
  const lpStakingContract = useLPStakingContract(lpStakingAddress)
  const { onApprove } = useApprove(lpContract, lpStakingContract)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setIsApproved(true)
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])
  const [onPresentStake] = useModal(
    <StakeModal
      pid={pid}
      onConfirm={onConfirm}
      lpStakingContract={lpStakingContract}
      max={max}
      symbol={tokenName}
      addLiquidityUrl={addLiquidityUrl}
      inputTitle={t('Stake')}
    />,
  )

  const [onPresentClaim] = useModal(<ClaimModal />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      farm={farm}
      staked={formatStakedTokenBalance}
      earnings={formatTokenEarnings}
      max={maxStake}
      onConfirm={handleUnstake}
      tokenName={tokenName}
    />,
  )

  return (
    <Modal title={t('Account Info')} onDismiss={onDismiss}>
      <Text color="textSubtle" fontSize="14px" style={{ paddingBottom: '30px', marginTop: '-40px' }}>
        Staking, balances & earnings
      </Text>

      <Container style={largeScreen ? { flexDirection: 'row' } : { flexDirection: 'column', minWidth: 'auto' }}>
        {/* <Container> */}

        <DetailsCont style={largeScreen ? {} : { width: 'auto' }}>
          <Text bold fontSize="24px">
            {formatTokenBalance ?? <Skeleton width={60} display="inline-block" />}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {farm.quoteToken.symbol}
          </Text>
          <ActionDiv style={{ padding: '0px' }}>
            <Button fullWidth as="a" target="_blank" href={addTokenUrl}>
              Get {farm.quoteToken.symbol}
            </Button>
          </ActionDiv>
        </DetailsCont>
        <DetailsCont style={largeScreen ? {} : { width: 'auto' }}>
          <Text bold fontSize="24px">
            {formatLPTokenBalance ?? <Skeleton width={60} display="inline-block" />}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {tokenName} Tokens
          </Text>
          <ActionDiv style={{ padding: '0px' }}>
            <Button fullWidth as="a" target="_blank" href={addLiquidityUrl}>
              Get {tokenName}
            </Button>
          </ActionDiv>
        </DetailsCont>
        <DetailsCont style={largeScreen ? {} : { width: 'auto' }}>
          <Text bold fontSize="24px">
            {formatStakedTokenBalance ?? <Skeleton width={60} display="inline-block" />}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            Your {tokenName} Deposits
          </Text>
          <ActionDiv style={{ padding: '0px' }}>
            {isApproved ? (
              <Button fullWidth onClick={onPresentStake}>
                Stake {tokenName}
              </Button>
            ) : (
              <Button fullWidth onClick={handleApprove} disabled={requestedApproval}>
                Enable Farm
              </Button>
            )}
          </ActionDiv>
        </DetailsCont>
      </Container>
      <ModalHr />
      <Grid>
        <ModalFooter>
          <DetailsCont>
            <Text bold fontSize="24px">
              {userRate}
            </Text>
            <Text color="textSubtle" fontSize="14px">{`Your Rate ${farm.quoteToken.symbol}/week`}</Text>
          </DetailsCont>
          <DetailsCont>
            <Text bold fontSize="24px">
              {formatTokenEarnings ?? <Skeleton width={60} display="inline-block" />}
            </Text>
            <Text color="textSubtle" fontSize="14px">{`${farm.quoteToken.symbol} Token Earnings`}</Text>
          </DetailsCont>

          <DetailsCont
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onMouseEnter={() => setActiveSelect(true)}
            onMouseLeave={() => setActiveSelect(false)}
          >
            <Button fullWidth onClick={onPresentWithdraw}>
              <Text>Claim & Withdraw</Text>
            </Button>
          </DetailsCont>
        </ModalFooter>
      </Grid>
    </Modal>
  )
}

export default DepositModal
