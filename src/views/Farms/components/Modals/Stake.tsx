import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useMemo } from 'react'
import { Contract } from 'web3-eth-contract'
import { Modal, Text } from '@sparkpointio/sparkswap-uikit'
import ModalInput from 'components/ModalInput'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Container, { CancelButton, DepositButton, StyledFlex } from './Styled'

interface StakeModalInterface {
  onDismiss?: () => void
  max: BigNumber
  symbol: string
  placeholder?: string
  addLiquidityUrl?: string
  inputTitle?: string
  onConfirm: (amount: string, contract: Contract) => void
  lpStakingContract?: Contract
}

const Stake: React.FC<StakeModalInterface> = ({ onDismiss, max, symbol, addLiquidityUrl, inputTitle, onConfirm, lpStakingContract}) => {
  const [val, setVal] = useState('0')
  const [pendingTx, setPendingTx] = useState(false)
  const valNumber = new BigNumber(val)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

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
      onDismiss()
    }
    catch (e) {
      setPendingTx(false)
    }
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
          //  inputTitle={t('Stake')}
        />
      </Container>
      <StyledFlex justifyContent="space-between">
        <Text>{ symbol } balance: </Text>
        <Text>{ fullBalance }</Text>
      </StyledFlex>
      <StyledFlex justifyContent="space-between">
        <CancelButton
        onClick={onDismiss}
        >
         Close
        </CancelButton>
        <DepositButton
        // disable Deposit button if not yet approved
        onClick={onClick}
        disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        >
        Deposit
        </DepositButton>
      </StyledFlex>
    </Modal>
  )
}

export default Stake
