import { useEffect, useState } from 'react'
import { SPARKSWAP_API } from 'config'
import useWeb3 from 'hooks/useWeb3'

export const usePoolPrice = (stakingTokenAddress: string, rewardTokenAddress: string) => {
    const [stakingPrice, setStakingPrice] = useState(0)
    const [rewardPrice, setRewardPrice] = useState(0)

    const web3 = useWeb3()
    let _stakingTokenAddress
    let _rewardTokenAddress
    try{
        _stakingTokenAddress = web3.utils.toChecksumAddress(stakingTokenAddress)
        _rewardTokenAddress = web3.utils.toChecksumAddress(rewardTokenAddress)
    }
    catch{
        console.error('Invalid staking and reward address')
    }

    useEffect(() => {
        let asset;
        const fetchData = async () => {
        try {
            console.log(SPARKSWAP_API.concat('assets'))
            const response = await fetch(SPARKSWAP_API.concat('assets'))
            const lastPrice = "last_price"
            asset = await response.json();
            
            setStakingPrice(asset[_stakingTokenAddress][lastPrice])
            setRewardPrice(asset[_rewardTokenAddress][lastPrice])
        } catch (error) {
          console.error('Unable to fetch data:', error)
        }
      }
  
      fetchData()
    }, [setStakingPrice, setRewardPrice,_stakingTokenAddress, _rewardTokenAddress])

    return {stakingPrice, rewardPrice}
}

export default usePoolPrice