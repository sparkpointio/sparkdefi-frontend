import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'SparkDefi',
  description:
    'Refuel your rocket with SFUEL and travel to the moon with SparkSwap, the prodigious decentralized exchange on Binance Smart Chain.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home | SparkDefi',
  },
  '/competition': {
    title: 'Trading Battle | SparkDefi',
  },
  '/prediction': {
    title: 'Prediction | SparkDefi',
  },
  '/farms': {
    title: 'Farms | SparkDefi',
  },
  '/pools': {
    title: 'Pools | SparkDefi',
  },
  '/lottery': {
    title: 'Lottery | SparkDefi',
  },
  '/collectibles': {
    title: 'Collectibles | SparkDefi',
  },
  '/ifo': {
    title: 'Initial Farm Offering | SparkDefi',
  },
  '/teams': {
    title: 'Leaderboard | SparkDefi',
  },
  '/profile/tasks': {
    title: 'Task Center | SparkDefi',
  },
  '/profile': {
    title: 'Your Profile | SparkDefi',
  },
}
