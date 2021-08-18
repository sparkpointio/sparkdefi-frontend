import React from 'react'
import BigNumber from 'bignumber.js'
import { Button, Modal, Text, Flex } from '@sparkpointio/sparkswap-uikit'

interface ClaimModalProps {
  onDismiss?: () => void
}

const ClaimModal: React.FC<ClaimModalProps> = ({ onDismiss}) => {
  
  return (
    <Modal title="" onDismiss={onDismiss}>
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
      <Flex marginTop="-10px" style={{width: '450px'}} alignItems="center" flexDirection="column">
        <Text>You will be claiming the reward amount of </Text>
        <Text fontSize="28px" bold>78.912 SRK Tokens</Text>
      </Flex>
      <Flex justifyContent="center" margin="24px" padding="0px 35px">
        <Button fullWidth>Confirm</Button>
      </Flex>
    </Modal>
  )
}

export default ClaimModal
