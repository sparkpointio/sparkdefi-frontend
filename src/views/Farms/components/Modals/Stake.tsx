import React, { useState, useCallback, useMemo} from 'react'
import { Modal, Text   } from '@sparkpointio/sparkswap-uikit';
import ModalInput from 'components/ModalInput';
import { getFullDisplayBalance } from 'utils/formatBalance'
import Container, {ApproveButton, DepositButton, StyledFlex} from './Styled';

interface StakeModalInterface {
    onDismiss?: () => void
    max: string
    symbol: string
    placeholder?: string
    addLiquidityUrl?: string
    inputTitle?: string
}

const Stake:React.FC<StakeModalInterface>  = ({ 
    onDismiss,
    max,
    symbol,
    addLiquidityUrl,
    inputTitle,
}) => {

const [val, setVal] = useState('')
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )
  const handleSelectMax = useCallback(() => {
    setVal(max)
  }, [max, setVal])

    return (
        <Modal title="" onDismiss={onDismiss}>
            <Container>
            <Text>Stake amount: </Text>
            <ModalInput 
             value={val}
             onSelectMax={handleSelectMax}
             onChange={handleChange}
             max={max}
             symbol={symbol}
             addLiquidityUrl={addLiquidityUrl}
            //  inputTitle={t('Stake')}
            />
            </Container>
            <StyledFlex justifyContent="space-between">
              <Text>Appoved tokens: </Text>
              <Text>00.00</Text>
            </StyledFlex>
            <StyledFlex justifyContent="space-between">
              <ApproveButton>
                Approved
              </ApproveButton>
              <DepositButton>
                Deposit
              </DepositButton>
            </StyledFlex>
        </Modal>
    )
}

export default Stake;
