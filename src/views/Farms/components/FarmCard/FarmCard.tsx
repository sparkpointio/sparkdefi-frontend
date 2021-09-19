import React, { useContext, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes, ThemeContext } from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { BASE_ADD_LIQUIDITY_URL, BASE_EXCHANGE_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import HarvestAction from '../FarmTable/Actions/HarvestAction'
import { getAddress } from '../../../../utils/addressHelpers'
import ExpandableSectionButton from '../../../../components/ExpandableSectionButton'
import DetailsSection from './DetailsSection'
import { getBscScanAddressUrl } from '../../../../utils/bscscan'

export interface FarmWithStakedValue extends Farm {
  totalDeposits?: string
  apr?: number
  liquidity?: BigNumber
}

const AccentGradient = keyframes`
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

const StyledCardAccent = styled.div`
    // background: ${({ theme }) => `linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary})`};
  background-size: 400% 400%;
  animation: ${AccentGradient} 2s linear infinite;
  border-radius: 32px;
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -3px;
  left: -1px;
  z-index: -1;
`

const FCard = styled.div<{ isPromotedFarm: boolean }>`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border: 5px solid ${(props) => props.theme.colors.primary};
    // border-radius: ${({ theme, isPromotedFarm }) => (isPromotedFarm ? '31px' : theme.radii.card)};
  box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBorder};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  userDataReady: boolean
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ userDataReady, farm, removed, cakePrice, account }) => {
  const { t } = useTranslation()
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const formatTotalDeposits = new BigNumber(farm.totalDeposits)
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const earnLabel = farm.quoteToken.symbol
  const farmAPR = farm.apr && farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    mainTokenAddress: farm.token.address,
    pairTokenAddress: farm.pairToken.address,
  })

  const addLiquidityUrl = `${farm.liquidityUrl ?? BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const AddTokenUrl = `${BASE_EXCHANGE_URL}/#/swap/${farm.token.address[56]}`
  const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const isPromotedFarm = farm.token.symbol === 'CAKE'
  const theme = useContext(ThemeContext)
  return (
    <FCard isPromotedFarm={isPromotedFarm}>
      {isPromotedFarm && <StyledCardAccent />}
      <CardHeading
        lpLabel={lpLabel}
        multiplier={farm.multiplier}
        isCommunityFarm={farm.isCommunity}
        farmImage={farmImage}
        farmSymbol={farm.lpSymbol}
        tokenSymbol={farm.token.symbol}
        rewardToken={farm.quoteToken.symbol}
        token={farm.token}
        quoteToken={farm.quoteToken}
      />
      <hr style={{ width: '100%', border: 'none', backgroundColor: theme.colors.primary, height: '2px' }} />
      {/* {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{t('APR')}:</Text>
          <Text bold style={{ display: 'flex', alignItems: 'center' }}>
            {farm.apr ? (
              <>
                <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} cakePrice={cakePrice} apr={farm.apr} />
                {farmAPR}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )} */}


      <Flex justifyContent='space-between' style={{ textAlign: 'left' }}>
        <Text>{t('Total Deposits')}</Text>
        <Text color='textSubtle'>{formatTotalDeposits.toFixed(4)}</Text>
      </Flex>
      <Flex>
        <HarvestAction stakingContract={getAddress(farm.stakingAddresses)}
                       tokenRewardSymbol={earnLabel} userDataReady={userDataReady} userData={farm.userData}
                       pid={farm.pid} />
      </Flex>
      <Flex justifyContent='space-between'>
        <Text>{t('APR')}</Text>
        <Text color='textSubtle'>--</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text>{t('Rate')}</Text>
        <Text color='textSubtle'>-- {earnLabel} / week</Text>
      </Flex>
      <Flex justifyContent='space-between'>
        <Text>{t('Duration')}</Text>
        <Text color='textSubtle'>{farm.remainingDays} Days</Text>
      </Flex>
      <CardActionsContainer userDataReady={userDataReady} farm={farm} account={account}
                            addLiquidityUrl={addLiquidityUrl} addTokenUrl={AddTokenUrl} />
       {/* <Divider />
       <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          bscScanAddress={getBscScanAddressUrl(farm.lpAddresses[process.env.REACT_APP_CHAIN_ID])}
          infoAddress={`https://pancakeswap.info/pool/${lpAddress}`}
          totalValueFormatted={farm.totalDeposits}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper> */}
      <Flex justifyContent='center'>
        {/* {Object.prototype.hasOwnProperty.call(farm.lpAddresses, '56') && (<Text color="textSubtle" fontSize="14px">{t('This will only work on Binance Smart Chain')}</Text>)} */}
        {/* {Object.prototype.hasOwnProperty.call(farm.lpAddresses, '1') && (<Text color="textSubtle" fontSize="14px">{t('This will only work on Ethereum Blockchain')}</Text>)} */}
      </Flex>
    </FCard>
  )
}

export default FarmCard
