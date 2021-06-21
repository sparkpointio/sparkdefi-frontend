import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, LinkExternal, Text, useModal, Dropdown } from '@sparkpointio/sparkswap-uikit'
import { ChevronDown, ChevronUp } from 'react-feather'
import useTokenBalance from 'hooks/useTokenBalance'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import Container, { ActionDiv, DetailsCont, ModalFooter } from './Styled'
import { ModalHr } from './Divider'
import StakeModal from './Modals/Stake'


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
  tokenRewardAddress
}) => {
  // const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const [activeSelect, setActiveSelect] = useState(false)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const RewardTokenBalance = useTokenBalance(tokenRewardAddress)
  const formatTokenBalance = getBalanceNumber(RewardTokenBalance)
  
  
  // const valNumber = new BigNumber(val)
  // const fullBalanceNumber = new BigNumber(fullBalance)

  // const handleSelectMax = useCallback(() => {
  //   setVal(fullBalance)
  // }, [fullBalance, setVal])

  const [onPresentStake] = useModal(
    <StakeModal max={fullBalance} symbol={tokenName} addLiquidityUrl={addLiquidityUrl} inputTitle={t('Stake')} />,
  )

  return (
    <Modal title={t('Account Info')} onDismiss={onDismiss}>
      <Text color="textSubtle" fontSize="14px" style={{ paddingBottom: '30px', marginTop: '-50px' }}>
        Staking, balance, and earnings
      </Text>

      {/* <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
      />

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} fullWidth disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          fullWidth
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
        {t('Get')} {tokenName}
      </LinkExternal> */}

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
            <Button fullWidth onClick={onPresentStake}>
              Stake Tokens
            </Button>
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
            <Button fullWidth onClick={onDismiss}>
              <Text>Claim</Text>
            </Button>
            <Button fullWidth onClick={onDismiss}>
              <Text>Claim and Withdraw</Text>
            </Button>
          </Dropdown>
        </DetailsCont>
      </ModalFooter>
    </Modal>
  )
}

export default DepositModal
