import styled, { css, keyframes } from 'styled-components'
import { Card } from '@sparkpointio/sparkswap-uikit'

const PromotedGradient = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

export const StyledCard = styled(Card)<{ isPromotedPool?: boolean; isFinished?: boolean }>`
  border: 5px solid ${(props) => props.theme.colors.primary};
  max-width: 352px;
  padding: 24px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  justify-content: space-around;
  background: ${(props) => props.theme.card.background};
  text-align: center;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export const StyledCardInner = styled.div<{ isPromotedPool?: boolean }>`
  background: ${({ theme }) => theme.card.background};

  // border-radius: ${({ isPromotedPool, theme }) => (isPromotedPool ? '31px' : theme.radii.card)};
`

export default StyledCard
