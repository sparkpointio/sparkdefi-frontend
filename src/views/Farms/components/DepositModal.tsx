import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, LinkExternal, Text, useModal, Dropdown } from '@sparkpointio/sparkswap-uikit'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { useAppDispatch } from 'state'
import { Farm } from 'state/types'
import { fetchFarmUserDataAsync } from 'state/farms'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getFullDisplayBalance, getBalanceNumber} from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import WithdrawModal from './WithdrawModal'
import Container, { ActionDiv, DetailsCont, ModalFooter } from './Styled'
import { ModalHr } from './Divider'
import StakeModal from './Modals/Stake'
import ClaimModal from './Modals/ClaimModal'



interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  addTokenUrl?: string
  tokenReward?: string
  tokenRewardAddress?: string
  tokenBalance?: string
  stakedBalance?: string
  tokenEarnings?: string
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
  tokenReward,
  tokenBalance,
  stakedBalance,
  tokenEarnings,
  tokenRewardAddress,
  handleUnstake,
  farm,
  maxStake
}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const [activeSelect, setActiveSelect] = useState(false)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const earnings = new BigNumber(tokenBalanceAsString)
  const { account } = useWeb3React()
  const dispatch = useAppDispatch();
  const RewardTokenBalance = useTokenBalance(tokenRewardAddress)
  const formatTokenBalance = getBalanceNumber(RewardTokenBalance.balance)
  const { pid, lpAddresses } = farm
  const lpAddress = getAddress(lpAddresses)
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const lpContract = useERC20(lpAddress)
  const { onApprove } = useApprove(lpContract)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const [onPresentStake] = useModal(
    <StakeModal onConfirm={onConfirm} max={max} symbol={tokenName} addLiquidityUrl={addLiquidityUrl} inputTitle={t('Stake')} />,
  )

  const [onPresentClaim] = useModal (<ClaimModal />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={maxStake} onConfirm={handleUnstake} tokenName={tokenName} />,
  )

  return (
    <Modal title={t('Account Info')} onDismiss={onDismiss}>
      <Text color="textSubtle" fontSize="14px" style={{ paddingBottom: '30px', marginTop: '-50px' }}>
        Staking, balances & earnings
      </Text>
      <Container>
        <DetailsCont>
          <Text bold fontSize="24px">
          {formatTokenBalance === 0? '0.0000': formatTokenBalance}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {tokenReward}
          </Text>
          <ActionDiv>
            <Button fullWidth as="a" href={addTokenUrl}>
              Add More
            </Button>
          </ActionDiv>
        </DetailsCont>
        <DetailsCont>
          <Text bold fontSize="24px">
          {tokenBalance === '0'? '0.0000' : {tokenBalance}}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            {tokenName} Tokens
          </Text>
          <ActionDiv>
            <Button fullWidth as="a" href={addLiquidityUrl}>
              Add Liquidity
            </Button>
          </ActionDiv>
        </DetailsCont>
        <DetailsCont>
          <Text bold fontSize="24px">
          {stakedBalance === '0'? '0.0000' : {stakedBalance}}
          </Text>
          <Text color="textSubtle" fontSize="14px">
            Your {tokenName} Deposits
          </Text>
          <ActionDiv>
            {isApproved?
              (<Button fullWidth onClick={onPresentStake}>
                Stake Tokens
              </Button>):
              (<Button fullWidth onClick={handleApprove} disabled={requestedApproval}>
                Approve
              </Button>)
            }
            
          </ActionDiv>
        </DetailsCont>
      </Container>
      <ModalHr />
      <ModalFooter>
        <DetailsCont>
          <Text bold fontSize="24px">
            0.0000
          </Text>
          <Text color="textSubtle" fontSize="14px">{`Your Rate ${tokenReward}/week`}</Text>
        </DetailsCont>
        <DetailsCont>
          <Text bold fontSize="24px">
            {tokenEarnings === '0'? '0.0000': tokenEarnings}
          </Text>
          <Text color="textSubtle" fontSize="14px">{`${tokenReward} Token Earnings`}</Text>
        </DetailsCont>
        <DetailsCont
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onMouseEnter={() => setActiveSelect(true)}
          onMouseLeave={() => setActiveSelect(false)}
        >
          <Dropdown
            position="top"
            target={
              <Button variant="secondary" onClick={onDismiss}>
                <Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />}
              </Button>
            }
          >
            <Button fullWidth onClick={onPresentClaim}>
              <Text>Claim</Text>
            </Button>
            <Button fullWidth onClick={onDismiss}>
              <Text>Claim & Withdraw</Text>
            </Button>
          </Dropdown>
        </DetailsCont>
      </ModalFooter>
    </Modal>
  )
}

export default DepositModal
