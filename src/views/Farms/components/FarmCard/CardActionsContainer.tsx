import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import StakeAction from './StakeAction'

const Action = styled.div`
  padding-top: 16px;
`

export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  userDataReady: boolean
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  addTokenUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = (
  {
    userDataReady,
    farm,
    account,
    addLiquidityUrl,
    addTokenUrl,
  }) => {
  const { t } = useTranslation()
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)

  const renderDepositButton = () => {
    return (
      <StakeAction
        userDataReady={userDataReady}
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={farm.lpSymbol}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
        addTokenUrl={addTokenUrl}
        farm={farm}
      />
    )
  }

  return (
    <Action>
      {!account ? <UnlockButton mt='8px' width='100%' /> : renderDepositButton()}
    </Action>
  )
}

export default CardActions
