import { useEffect, useState } from 'react'
import { SPARKSWAP_API, API_ASSETS, API_SUMMARY, API_LIQUIDITY, API_LASTPRICE } from 'config'
import useWeb3 from 'hooks/useWeb3'
import BigNumber from 'bignumber.js/bignumber'
import { getBalanceNumber } from 'utils/formatBalance'

export const usePoolPrice = (stakingTokenAddress: string, rewardTokenAddress: string) => {
  const [stakingPrice, setStakingPrice] = useState(0)
  const [rewardPrice, setRewardPrice] = useState(0)

  const web3 = useWeb3()
  let _stakingTokenAddress
  let _rewardTokenAddress
  try {
    _stakingTokenAddress = web3.utils.toChecksumAddress(stakingTokenAddress)
    _rewardTokenAddress = web3.utils.toChecksumAddress(rewardTokenAddress)
  } catch {
    console.error('Invalid staking and reward address')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let assets = await fetch(SPARKSWAP_API.concat(API_ASSETS))
        assets = await assets.json()
        const lastPrice = 'last_price'

        setStakingPrice(assets[_stakingTokenAddress][lastPrice])
        setRewardPrice(assets[_rewardTokenAddress][lastPrice])
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setStakingPrice, setRewardPrice, _stakingTokenAddress, _rewardTokenAddress])

  return { stakingPrice, rewardPrice }
}

export const useFarmPrice = (
  lpTotalSupply: number,
  token1Address: string,
  token2Address: string,
  rewardTokenAddress: string,
) => {
  const [LPPrice, setLPPrice] = useState(0)
  const [rewardPrice, setRewardPrice] = useState(0)

  const web3 = useWeb3()
  let _token1Address
  let _token2Address
  let _rewardTokenAddress
  try {
    _token1Address = web3.utils.toChecksumAddress(token1Address)
    _token2Address = web3.utils.toChecksumAddress(token2Address)
    _rewardTokenAddress = web3.utils.toChecksumAddress(rewardTokenAddress)
  } catch {
    console.error('Invalid staking and reward address')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let assets = await fetch(SPARKSWAP_API.concat(API_ASSETS))
        assets = await assets.json()
        let summary = await fetch(SPARKSWAP_API.concat(API_SUMMARY))
        summary = await summary.json()

        let pairLiquidity

        if (Object.prototype.hasOwnProperty.call(summary, _token1Address.concat('_', _token2Address))) {
          pairLiquidity = summary[_token1Address.concat('_', _token2Address)][API_LIQUIDITY]
        } else {
          pairLiquidity = summary[_token2Address.concat('_', _token1Address)][API_LIQUIDITY]
        }

        setLPPrice(pairLiquidity / getBalanceNumber(new BigNumber(lpTotalSupply), 18))
        setRewardPrice(assets[_rewardTokenAddress][API_LASTPRICE])
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setLPPrice, setRewardPrice, lpTotalSupply, _token1Address, _token2Address, _rewardTokenAddress])

  return { LPPrice, rewardPrice }
}

export default usePoolPrice
