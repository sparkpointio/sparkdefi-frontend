import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SparkDefi',
  description:
    'Refuel your rocket with SFUEL and travel to the moon with SparkSwap, the prodigious decentralized exchange on Binance Smart Chain.',
  image: 'https://sparkswap.finance//images/192x192_App_Icon.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('SparkDefi')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('SparkDefi')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('SparkDefi')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('SparkDefi')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('SparkDefi')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('SparkDefi')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('SparkDefi')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('SparkDefi')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('SparkDefi')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('SparkDefi')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('SparkDefi')}`,
      }
    default:
      return null
  }
}
