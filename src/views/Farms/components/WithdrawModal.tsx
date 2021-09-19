import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Flex, Modal, Text } from '@sparkpointio/sparkswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from '../../../hooks/useToast'

interface WithdrawModalProps {
  farm?: any,
  staked?: any,
  earnings?: any,
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = (
  {
    farm,
    staked,
    earnings,
    onConfirm,
    onDismiss,
    max, tokenName = '',
  }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)
  const { toastError, toastSuccess } = useToast()

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
    <Modal title='' onDismiss={onDismiss}>
      {/* <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions> */}
      <Flex marginTop='-10px' style={{ width: '450px' }} alignItems='center' flexDirection='column'>
        <Text>You will be claiming the reward amount of </Text>
        <Text fontSize='28px' bold>{earnings} {farm.quoteToken.symbol}</Text>
        <Text>and withdrawing the staked amount of</Text>
        <Text fontSize='28px' bold>{staked} {farm.lpSymbol}</Text>
      </Flex>
      <Flex justifyContent='center' margin='24px' padding='0px 35px'>
        <Button
          disabled={pendingTx}
          fullWidth onClick={async () => {
          setPendingTx(true)
          try {
            await onConfirm(val)
            toastSuccess(t('Unstaked!'), t('Your LPs and earnings have been transferred to your wallet'))
            onDismiss()
          } catch (e) {
            toastError(
              t('Error'),
              t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
            )
            console.error(e)
          } finally {
            setPendingTx(false)
          }
        }}>Confirm</Button>
      </Flex>
    </Modal>
  )
}

export default WithdrawModal
