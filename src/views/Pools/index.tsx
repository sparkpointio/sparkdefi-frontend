import React, { useEffect, useMemo, useRef, useState, useContext} from 'react'
import { useLocation, Route, useRouteMatch } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@pancakeswap/uikit'
import { Text } from '@sparkpointio/sparkswap-uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { SvgIcon } from '@material-ui/core';
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault, useFetchPublicPoolsData, usePollFarmsData, useCakeVault } from 'state/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { StyledHr } from 'views/Farms/components/Divider'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import useMedia from 'use-media';
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'
import { ReactComponent as PoolsDarkLogo } from './components/assets/pool-dark.svg';
import { ReactComponent as PoolsLightLogo} from './components/assets/pool-light.svg';

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`


const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const theme = useContext(ThemeContext);
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'pancake_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const isMobile = useMedia({maxWidth: 500})
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    const cakeAutoVault = { ...cakePool, isAutoVault: true }
    return [...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const [upcomingPools, notUpcomingPools] = useMemo(() => partition(pools, (pool) => pool.isComingSoon), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, accountHasVaultShares],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, accountHasVaultShares],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchCakeVault()
  useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) =>
        pool.isAutoVault ? (
          <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} />
  const { path, url, isExact } = useRouteMatch()


  return (
    <>
      <PageHeader>
        <Flex alignItems="center" justifyContent="space-between" flexDirection={['column', null, 'row']} style={isMobile? { flexDirection: 'column-reverse'} : {minHeight: '20vh'}} padding="24px"> 
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Text color="text" fontSize="60px" bold marginBottom="10px">
              <span style={{borderBottom: `2px solid ${theme.colors.primary}`}}>Pools</span>
            </Text>
            <Text color="text" style={isMobile? { fontSize: "17px" } : { fontSize: "27px" }}>
                Earn SRK, SFUEL and other tokens by just staking!
            </Text>
          </Flex>
          <Flex style={isMobile? {fontSize: '150px', margin: 'auto', marginTop: '20px', marginBottom: '20px' } : {fontSize: '240px', marginRight: '-112px', position: 'relative'}}>
              <SvgIcon component={theme.isDark? PoolsDarkLogo : PoolsLightLogo} viewBox="0  0 384 512" style={isMobile? {width: '200px'} : {width: '500px'}} fontSize="inherit"/>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Flex alignItems="center" justifyContent="space-between" style={isMobile? { flexDirection: 'column'} : { flexDirection: 'row' }}>
          <Flex>
          <PoolTabButtons
              stakedOnly={stakedOnly}
              setStakedOnly={setStakedOnly}
              hasStakeInFinishedPools={hasStakeInFinishedPools}
              viewMode={viewMode}
              setViewMode={setViewMode}
          />
         </Flex>
         <Flex alignItems="center" justifyContent="space-between" marginTop="16px">
        <SearchSortContainer>
            {/* <PoolControls>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </PoolControls> */}
            <PoolControls>
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" marginRight="12px" marginTop="12px">
                {t('Search')}
              </Text>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
            </PoolControls>
          </SearchSortContainer>
          </Flex>
          </Flex>
        {/* 
        <div>
          <Flex justifyContent="space-between" style={{ margin: '20px' }}>
            <Flex flexDirection="column" mr={['8px', 0]}>
              <Text color="text" fontSize="24px" bold>
                
              </Text>
              <Text color="text" fontSize="16px">
                {t(' Stake Liquidity Pool tokens to earn')}
              </Text>
            </Flex>
          </Flex>
        */}

        { stakedOnlyOpenPools.length !== 0 && (<div>
          {/* <Text bold fontSize="20px" marginLeft="24px" paddingBottom="24px">
            {' '}
            Stake tokens to earn{' '}
          </Text> */}
          <Heading scale="md" color="text" marginLeft="20px" paddingBottom="24px">
              {t('Stake tokens to earn')}
          </Heading>
          
          {/* Header title for Active Pools   */}
          <Flex justifyContent="space-between" style={{ margin: '20px' }}>
              <Flex flexDirection="column" mr={['8px', 0]}>
                  <Heading scale="md" color="text">
                    {t('Active Pools')}
                  </Heading>
              </Flex>
          </Flex>

          <FlexLayout>
            {/* <Route exact path={`${path}`}> */}
            <>
              {/* <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} /> */}

              {/* {stakedOnly
                ? orderBy(stakedOnlyOpenPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />) */}
              {orderBy(openPools, ['sortOrder'])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => (
                  <PoolCard key={pool.sousId} pool={pool} account={account} />
                ))}
            </>
            {/* </Route> */}
          </FlexLayout>
        </div>)}

        {/* UPCOMING  */}
        {upcomingPools.length !== 0 && (
          <>
            <StyledHr style={{ marginTop: '35px'}}/>
            <div style={{ margin: '25px 0px', padding: '25px 0px' }}>
              {/* <Flex justifyContent="space-between" style={{ margin: '20px' }}>
                <Flex flexDirection="column" mr={['8px', 0]}>
                  <Heading scale="md" color="text">
                    {t('Coming Soon')}
                  </Heading>
                </Flex>
              </Flex> */}

              <FlexLayout>
                <Route path={`${path}/upcoming`}> 
            
                {orderBy(upcomingPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))}
                 </Route> 
              </FlexLayout>
            </div>
          </>
        )}
        

        {/* ENDED  */}
        {finishedPools.length !== 0 && (
          <>
            {/* <StyledHr style={{ marginTop: '35px'}}/> */}
            <div style={{ margin: '25px 0px', padding: '25px 0px' }}>
              {/* <Flex justifyContent="space-between" style={{ margin: '20px' }}>
                <Flex flexDirection="column" mr={['8px', 0]}>
                  <Heading scale="md" color="text">
                    {t('Upcoming Pools')}
                  </Heading>
                </Flex>
              </Flex> */}

              <FlexLayout>
                <Route path={`${path}/history`}> 
                {/* {stakedOnly
            ? orderBy(stakedOnlyFinishedPools, ['sortOrder'])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />) */}
                {orderBy(finishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))}
                 </Route> 
              </FlexLayout>
            </div>
          </>
        )}
        {/* <Flex justifyContent="space-between" style={{ margin: '20px' }}>
                <Flex flexDirection="column" mt={['8px', -10]}>
                  <Heading scale="md" color="text">
                    {t('Active Pools')}
                  </Heading>
                </Flex>
              </Flex> */}
              <div style={{ margin: '25px 0px', padding: '25px 0px' }}>
              <FlexLayout>
            <Route exact path={`${path}`}>
            <>
              {/* <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} /> */}

              {/* {stakedOnly
                ? orderBy(stakedOnlyOpenPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />) */}
              {orderBy(openPools, ['sortOrder'])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => (
                  <PoolCard key={pool.sousId} pool={pool} account={account} />
                ))}
            </>
            </Route>
          </FlexLayout>
          </div>
        <div ref={loadMoreRef} />
        {/* <Image
          mx="auto"
          mt="12px"
          src="/images/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        /> */}
      </Page>
    </>
  )
}

export default Pools
