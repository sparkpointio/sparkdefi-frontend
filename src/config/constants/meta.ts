import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SparkDeFi',
  description:
    'Refuel your rocket with SFUEL and travel to the moon with SparkSwap, the prodigious decentralized exchange on Binance Smart Chain.',
  image: 'https://sparkswap.finance//images/192x192_App_Icon.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('SparkDeFi')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('SparkDeFi')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('SparkDeFi')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('SparkDeFi')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('SparkDeFi')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('SparkDeFi')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('SparkDeFi')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('SparkDeFi')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('SparkDeFi')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('SparkDeFi')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('SparkDeFi')}`,
      }
    default:
      return null
  }
}
