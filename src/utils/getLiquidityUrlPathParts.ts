// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { getWbnbAddress } from './addressHelpers'

const getLiquidityUrlPathParts = ({ mainTokenAddress, pairTokenAddress }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const wBNBAddressString = getWbnbAddress()
  const mainTokenAddressString: string = mainTokenAddress ? mainTokenAddress[chainId] : null
  const pairTokenAddressString: string = pairTokenAddress ? pairTokenAddress[chainId] : null
  const firstPart =
    !mainTokenAddressString || mainTokenAddressString === wBNBAddressString ? 'ETH' : mainTokenAddressString
  const secondPart = !pairTokenAddressString || pairTokenAddressString === wBNBAddressString ? 'ETH' : pairTokenAddressString
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
