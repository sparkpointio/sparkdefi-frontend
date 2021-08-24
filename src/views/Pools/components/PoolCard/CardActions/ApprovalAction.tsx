import React from 'react'
import { AutoRenewIcon, Skeleton, Flex } from '@pancakeswap/uikit'
import { Button, Text, Dropdown } from '@sparkpointio/sparkswap-uikit'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useSousApprove } from 'hooks/useApprove'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import { ActionDiv } from 'views/Farms/components/Styled'

interface ApprovalActionProps {
  pool: Pool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useSousApprove(stakingTokenContract, sousId, earningToken.symbol)
  // const [activeSelect, setActiveSelect] = useState(false)
  
  return (
    <>
    <Flex flexDirection="row" alignItems='flex-start'>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <ActionDiv>
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          // width="100%"
        >
          {t('Stake')}
        </Button>
        </ActionDiv>
      )}
      <ActionDiv style={{width: '100%'}}>
      <Dropdown
            position="top"
            target={
              <Button fullWidth variant="secondary">Withdraw <ChevronDown />
               {/* <Text>Withdraw</Text> {activeSelect ? <ChevronDown /> : <ChevronUp />} */}
              </Button>
            }
          >
            {/* <Button fullWidth onClick={"onDismiss"}  disabled={rawEarningsBalance.eq(0) || pendingTx} > */}
              <Button fullWidth>
              <Text>Claim</Text>
            </Button>
            <Button>
              <Text>Claim & Withdraw</Text>
            </Button>
          </Dropdown>
        </ActionDiv>
    </Flex>

    </>
  )
}

export default ApprovalAction
