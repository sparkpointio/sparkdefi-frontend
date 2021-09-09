import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useMemo } from 'react'
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
  onConfirm: (amount: string) => void
}

const Stake: React.FC<StakeModalInterface> = ({ onDismiss, max, symbol, addLiquidityUrl, inputTitle, onConfirm, }) => {
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
      <div>
        <Text ml="auto" color="textSubtle" fontSize="14px" mb="8px" style={{ textAlign: 'left'}}>
          Balance: {fullBalance} {symbol} Tokens
        </Text>
        </div>
      <StyledFlex justifyContent="space-between">
        <Text>Appoved tokens: </Text>
        <Text>00.00</Text>
      </StyledFlex>
      <StyledFlex justifyContent="space-between">
        <CancelButton 
        onClick={onDismiss}
        disabled={pendingTx}
        >
         Approve
        </CancelButton>
        <DepositButton
        // disable Deposit button if not yet approved
        disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        onClick={async () => {
          try {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }
          catch (e) {
            setPendingTx(false)
          }
        }}
        >
        Deposit
        </DepositButton>
      </StyledFlex>
    </Modal>
  )
}

export default Stake
