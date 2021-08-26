import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {  Slider, BalanceInput, } from '@pancakeswap/uikit';
import { Modal, Text, Flex, Image, Button, AutoRenewIcon, Link, Dropdown, useModal} from '@sparkpointio/sparkswap-uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_EXCHANGE_URL } from 'config'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { ChevronDown, ChevronUp } from 'react-feather';
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import StakeTokenModal from './Stake';
import PercentageButton from './PercentageButton'


interface StakeModalProps {
  isBnbPool: boolean
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  isRemovingStake?: boolean
  onDismiss?: () => void
  addTokenUrl?: string
}

const StyledLink = styled(Link)`
  width: 100%;
`
const StyledFlex = styled(Flex)`
justify-content: center;
  & > * {
    flex: 1;
    margin: 0px 10px;
  }
`

const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  addTokenUrl,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [activeSelect, setActiveSelect] = useState(false)

  const [ onPresentStakeAction ] = useModal(<StakeTokenModal isBnbPool={isBnbPool} pool={pool} stakingTokenBalance={stakingTokenBalance} stakingTokenPrice={stakingTokenPrice} />)
  return (
    <Modal
      title=""
      onDismiss={onDismiss}
    >
      <Flex flexDirection="column" style={{marginTop: '-50px', width: "550px"}} >
        <Text fontSize="20px" marginBottom="10px" marginLeft="10px">Account Info</Text>
        <Text fontSize="15px" marginLeft="10px">Staking, balances & earnings</Text>
        <StyledFlex marginTop="21px">
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.stakingToken.symbol} Tokens</Text>
            <Button fullWidth as="a" href={`https://sparkswap.finance/#/swap/${pool.stakingToken.address[56]}`}>Add More</Button>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.earningToken.symbol} Tokens</Text>
            <Button fullWidth as="a" href={`https://sparkswap.finance/#/swap/${pool.earningToken.address[56]}`}>Add More</Button>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle">{pool.stakingToken.symbol} Tokens</Text>
            <Button fullWidth onClick={onPresentStakeAction}>Stake Tokens</Button>
          </Flex>
        </StyledFlex>
        <StyledFlex >
        <hr style={{marginTop: '30px', border: 'none', borderTop: `2px solid ${theme.colors.primary}` }} />
        </StyledFlex>
        <StyledFlex marginTop="30px" marginBottom="20px">
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle" fontSize="17px">Your Rate {pool.earningToken.symbol}/Week Tokens</Text>
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize="24px">0.0000</Text>
            <Text color="textSubtle" fontSize="17px">{pool.earningToken.symbol} Token Earnings</Text>
          </Flex>
          <Flex flexDirection="column" mb="16px" marginLeft="5px"
          onMouseEnter={() => setActiveSelect(true)}
          onMouseLeave={() => setActiveSelect(false)}>
        
         <Dropdown
            position="top"
            target={
              <Button fullWidth variant="secondary"><Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />}
        
              </Button>
            }
          >
              <Button fullWidth>
              <Text>Claim</Text>
            </Button>
            <Button>
              <Text>Claim & Withdraw</Text>
            </Button>
          </Dropdown>
    </Flex>
        </StyledFlex>
      </Flex>
    </Modal>
  )
}

export default StakeModal