import React from 'react'
import { useRouteMatch, Link, useLocation } from 'react-router-dom'
import {
  ButtonMenu,
  ButtonMenuItem,
  Toggle,
  Text,
  Flex,
  useMatchBreakpoints,
} from '@sparkpointio/sparkswap-uikit'
import {   NotificationDot, } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ToggleView, { ViewMode } from './ToggleView/ToggleView'

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools, viewMode, setViewMode }) => {
  const { url, isExact } = useRouteMatch()
  const location = useLocation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  const viewModeToggle = <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />

  let activeIndex
  switch (location.pathname) {
    case '/pools':
      activeIndex = 0
      break
    case '/pools/history':
      activeIndex = 1
      break
    case '/pools/upcoming':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }


  const liveOrFinishedSwitch = (
    <ButtonMenu activeIndex={activeIndex} size="sm" variant="subtle">
      <ButtonMenuItem as={Link} to={`${url}`}>
        {t('Active')}
      </ButtonMenuItem>
      <NotificationDot show={hasStakeInFinishedPools}>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {t('Ended')}
        </ButtonMenuItem>
      </NotificationDot>
      {/* <ButtonMenuItem as={Link} to={`${url}/upcoming`}>
        {t('Upcoming')}
      </ButtonMenuItem> */}
    </ButtonMenu>
  )

   const stakedOnlySwitch = (
     <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
      <Text ml={['4px', '4px', '8px']}>{t('Staked only')}</Text>
     </Flex>
   )

  if (isXs || isSm) {
    return (
      <Flex flexDirection="column" alignItems="flex-start" mb="24px">
        <Flex style={{width: '100%' }}justifyContent="space-between">
          {/* {viewModeToggle} */}
          {liveOrFinishedSwitch}
        </Flex>
        {/* {stakedOnlySwitch}  */}
      </Flex>
    )
  }

  return (
    <Flex
      alignItems="center"
      justifyContent={['space-around', 'space-around', 'flex-start']}
      mb={['24px', '24px', '24px', '0px']}
    >
      {/* {viewModeToggle} */}
      {liveOrFinishedSwitch}
      {/* {stakedOnlySwitch} */}
    </Flex>
  )
}

export default PoolTabButtons
