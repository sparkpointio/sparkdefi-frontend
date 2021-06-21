import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@sparkpointio/sparkswap-uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  farmSymbol?: string
  tokenSymbol?: string
  rewardToken?:string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  farmImage,
  tokenSymbol,
  farmSymbol,
  rewardToken,
}) => {

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading  mb="4px" style={{textAlign: 'left'}}>Stake {lpLabel.split(' ')[0]} <br /> {farmSymbol} <br /> to earn {rewardToken}</Heading>
      </Flex>
      <Image src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} width={64} height={64} />
    </Wrapper>
  )
}

export default CardHeading
