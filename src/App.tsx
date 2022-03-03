import React, { lazy } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS, Footer } from '@sparkpointio/sparkswap-uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { useFetchProfile, usePollBlockNumber, usePollCoreFarmData } from 'state/hooks'
import { RedirectToPools } from 'views/Farms/Redirects'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
import Pools from './views/Pools'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
// const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Lottery = lazy(() => import('./views/Lottery'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const Collectibles = lazy(() => import('./views/Collectibles'))
const Teams = lazy(() => import('./views/Teams'))
const Team = lazy(() => import('./views/Teams/Team'))
const Profile = lazy(() => import('./views/Profile'))
const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
const Predictions = lazy(() => import('./views/Predictions'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()

  return (
    <HashRouter>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            {/* <Route path='/' exact>
              <Pools />
            </Route> */}
            <Route path='/farms'>
              <Farms />
            </Route>
            <Route path='/pools'>
              <Pools />
            </Route>
            <Route path='/lottery'>
              <Lottery />
            </Route>
            <Route path='/ifo'>
              <Ifos />
            </Route>
            <Route path='/collectibles'>
              <Collectibles />
            </Route>
            <Route exact path='/teams'>
              <Teams />
            </Route>
            <Route path='/teams/:id'>
              <Team />
            </Route>
            <Route path='/profile'>
              <Profile />
            </Route>
            <Route path='/competition'>
              <TradingCompetition />
            </Route>
            <Route path='/prediction'>
              <Predictions />
            </Route>
            {/* Redirect */}
            <Route path='/staking'>
              <Redirect to='/pools' />
            </Route>
            <Route path='/syrup'>
              <Redirect to='/pools' />
            </Route>
            <Route path='/nft'>
              <Redirect to='/collectibles' />
            </Route>
            <Route path='/' component={RedirectToPools} />
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <div
        style={{
          position: 'relative',
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Footer
          helperLinks={[
            {
              label: 'Terms and Conditions',
              href: 'https://sparkpointio.github.io/terms_and_conditions/sparkdefi-stake/',
            },
            {
              label: 'Privacy',
              href: 'https://sparkpointio.github.io/privacy_policies/sparkdefi-stake/',
            },
            {
              label: 'Sitemap',
              href: 'https://srk.finance/#roadmap',
            },
          ]}
          socLinks={[
            {
              label: 'facebook',
              href: 'https://www.facebook.com/sparkpointio/',
            },
            {
              label: 'twitter',
              href: 'https://twitter.com/sparkpointio',
            },
            {
              label: 'telegram',
              href: 'https://t.me/SparkPointOfficial',
            },
            {
              label: 'email',
              href: 'mailto: support@sparkpoint.io',
            },
            {
              label: 'discord',
              href: 'https://discord.com/invite/Sgc6yDEAAe',
            },
          ]}
          title="SparkDeFi Staking 2022"
        />
      </div>
    </HashRouter>
  )
}

export default React.memo(App)
