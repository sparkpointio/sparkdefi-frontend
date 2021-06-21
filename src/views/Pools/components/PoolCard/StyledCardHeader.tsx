import React from 'react'
import { Heading, Text, Flex, Image } from '@sparkpointio/sparkswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(Flex)<{ isFinished?: boolean; background?: string; isPromotedPool?: boolean }>`
svg {
  margin-right: 4px;
}
`
//  background: ${({ isFinished, background, theme }) =>
// isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
// border-radius: ${({ theme, isPromotedPool }) =>
// isPromotedPool ? '31px 31px 0 0' : `${theme.radii.card} ${theme.radii.card} 0 0`};
const StyledCardHeader: React.FC<{
  earningTokenSymbol: string
  stakingTokenSymbol: string
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
  isPromotedPool?: boolean
}> = ({
  earningTokenSymbol,
  stakingTokenSymbol,
  isFinished = false,
  isAutoVault = false,
  isStaking = false,
  isPromotedPool = false,
}) => {
  const { t } = useTranslation()
  const poolImageSrc = isAutoVault
    ? `cake-cakevault.svg`
    : `${earningTokenSymbol}-${stakingTokenSymbol}.svg`.toLocaleLowerCase()
  const isCakePool = earningTokenSymbol === 'CAKE' && stakingTokenSymbol === 'CAKE'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return `${t('Auto')}`
    }
    if (isCakePool) {
      // manual cake
      return `${t('Manual')}`
    }
    // all other pools
    return `${t('Earn')}`
  }

  const getSubHeading = () => {
    if (isAutoVault) {
      return `${t('Automatic restaking')}`
    }
    if (isCakePool) {
      return `${t('Earn CAKE, stake CAKE')}`
    }
    return `${t('Stake')} ${stakingTokenSymbol}`
  }

  return (
    <Wrapper isPromotedPool={isPromotedPool} isFinished={isFinished} justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="flex-end">
          <Heading size="lg" style={{textAlign: 'left'}}>
            Stake {stakingTokenSymbol} <br /> Earn {earningTokenSymbol}
          </Heading>
          {/* <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text> */}
          </Flex>
        <Image src={`/images/pools/${poolImageSrc}`} alt={earningTokenSymbol} width={64} height={64} />
     
    </Wrapper>
  )
}

export default StyledCardHeader
