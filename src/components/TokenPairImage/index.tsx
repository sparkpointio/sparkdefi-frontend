import React from 'react'
import { TokenPairImageProps as UIKitTokenPairImageProps } from '@pancakeswap/uikit'
import { Flex } from '@sparkpointio/sparkswap-uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const StyledLogo = styled.img`
  width: 50px;
`
const PairLogoImg = styled(Flex)`
  margin-bottom: 30px;
`

const getImageUrlFromToken = (token: Token) => {
  const address = getAddress(token.symbol === 'BNB' ? tokens.wbnb.address : token.address)
  return `/images/tokens/${address}.${token.iconExtension?? 'svg'}`
}

const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken }) => {
  return (
    <PairLogoImg>
      <StyledLogo src={getImageUrlFromToken(primaryToken)} alt='logo-img' />
      <StyledLogo src={getImageUrlFromToken(secondaryToken)} alt='logo-img' />
    </PairLogoImg>
  )
}

export default TokenPairImage
