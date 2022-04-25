import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { Modal, Text } from '@sparkpointio/sparkswap-uikit'
import ModalInput from 'components/ModalInput'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Container, { CancelButton, DepositButton, StyledFlex } from './Styled'
import useToast from '../../../../hooks/useToast'
import { useTranslation } from '../../../../contexts/Localization'
import { useAppDispatch } from '../../../../state'
import { fetchFarmUserDataAsync } from '../../../../state/farms'

interface StakeModalInterface {
  pid: number
  onDismiss?: () => void
  max: BigNumber
  symbol: string
  placeholder?: string
  addLiquidityUrl?: string
  inputTitle?: string
  onConfirm: (amount: string, contract: Contract) => void
  lpStakingContract?: Contract
}

const Stake: React.FC<StakeModalInterface> = ({
  pid,
  onDismiss,
  max,
  symbol,
  addLiquidityUrl,
  inputTitle,
  onConfirm,
  lpStakingContract,
}) => {
  const [val, setVal] = useState('0')
  const [pendingTx, setPendingTx] = useState(false)
  const valNumber = new BigNumber(val)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const { toastError, toastSuccess } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const onClick = async () => {
    try {
      setPendingTx(true)
      await onConfirm(val, lpStakingContract)
      setPendingTx(false)
      toastSuccess(`${t('Staked')}!`, t('Your %sym% tokens have been staked to the pool!', { sym: symbol }))
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])
  return (
    <Modal title="" onDismiss={!pendingTx && onDismiss}>
      <Container>
        <Text>Stake amount: </Text>
        <ModalInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={symbol}
          addLiquidityUrl={addLiquidityUrl}
        />
      </Container>
      <StyledFlex justifyContent="space-between">
        <Text>{symbol} balance: </Text>
        <Text>{fullBalance}</Text>
      </StyledFlex>
      <StyledFlex justifyContent="space-between">
        <CancelButton onClick={onDismiss}>Close</CancelButton>
        <DepositButton
          onClick={onClick}
          // disable Deposit button if not yet approved
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        >
          Deposit
        </DepositButton>
      </StyledFlex>
    </Modal>
  )
}

export default Stake
