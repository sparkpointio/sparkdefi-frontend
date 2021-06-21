import React from 'react'
import styled from 'styled-components'
import { Flex, Button } from '@sparkpointio/sparkswap-uikit' 

const Container = styled.div`
    margin-top: -30px;
    display: flex;
    flex-direction: column;
    min-width: 500px;
`
const StyledFlex = styled(Flex)`
    padding: 10px 0px;
`
const ApproveButton = styled(Button)`
    flex: 1;
    margin-right: 10px;
`
const DepositButton = styled(Button)`
    flex: 1;
    margin-left: 10px;
`

export {StyledFlex, ApproveButton, DepositButton}
export default Container;

