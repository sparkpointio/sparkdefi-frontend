import React from 'react'
import { Button, useWalletModal } from '@sparkpointio/sparkswap-uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button onClick={onPresentConnectModal} {...props} fullWidth>
      {t('Connect Wallet')}
    </Button>
  )
}

export default UnlockButton
