import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@pancakeswap/uikit'
import { Text } from '@sparkpointio/sparkswap-uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { StyledHr } from 'views/Farms/components/Divider'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'


const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  useFetchCakeVault()
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () => finishedPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // This pool is passed explicitly to the cake vault
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

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

  return (
    <>
      {/* <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading scale="md" color="text">
              {t('Active Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Stake LP tokens to earn')}
            </Heading>
          </Flex>
          <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <BountyCard />
          </Flex>
        </Flex>
      </PageHeader> */}
      <Page>
        {/* <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
        /> */}
        <div>
          <Flex justifyContent="space-between" style={{ margin: '20px' }}>
            <Flex flexDirection="column" mr={['8px', 0]}>
              <Text color="text" fontSize="24px" bold>
                {t('Active Pools')}
              </Text>
              <Text color="text" fontSize="16px">
                {t('Stake LP tokens to earn')}
              </Text>
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
        </div>

        <StyledHr />

        {/* ENDED  */}
        <div style={{margin: '25px 0px', padding: '25px 0px'}}>
          <Flex justifyContent="space-between" style={{ margin: '20px' }}>
            <Flex flexDirection="column" mr={['8px', 0]}>
              <Heading scale="md" color="text">
                {t('Inactive Pools')}
              </Heading>
            </Flex>
          </Flex>

          <FlexLayout>
            {/* <Route path={`${path}/history`}> */}
            {/* {stakedOnly
            ? orderBy(stakedOnlyFinishedPools, ['sortOrder'])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />) */}
            {orderBy(finishedPools, ['sortOrder'])
              .slice(0, numberOfPoolsVisible)
              .map((pool) => (
                <PoolCard key={pool.sousId} pool={pool} account={account} />
              ))}
            {/* </Route> */}
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
