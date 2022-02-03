import React from 'react'
import styled from 'styled-components'
import { Flex, Button } from '@sparkpointio/sparkswap-uikit' 
import { Menu } from '@mui/material'
import { styled as MStyled } from '@mui/styles'

// const Container = styled.div`
//     margin-top: -30px;
//     display: flex;
//     flex-direction: column;
//     min-width: 500px;
// `

const Container = styled.div`
    min-width: 720px;
    display: flex;
    justify-content: space-between;
    height: auto;
`

const StyledFlex = styled(Flex)`
    padding: 10px 0px;
`
const CancelButton = styled(Button)`
    flex: 1;
    margin-right: 10px;
`
const DepositButton = styled(Button)`
    flex: 1;
    margin-left: 10px;
`

const ActionDiv = styled.div`
    margin: 15px 0px;
    padding: 10px;
`

const DetailsCont = styled.div`
    width: 30%;
    height: auto;
    overflow: visible;
`

const ModalFooter = styled.div`
    min-width: 720px;
    display: flex;
    justify-content: space-between;
`

const ActionContent = styled(Flex)`
    flex-direction: column;
`


export {StyledFlex, CancelButton, DepositButton, ActionDiv, DetailsCont, ModalFooter, ActionContent}
export default Container;

export const StyledDropdown = MStyled(Menu)({
    '& .MuiMenu-list': {
        padding: '0px',
        flexDirection: 'column',
        display: 'flex',
        borderRadius: '0px',
        '& > *': {
            width: '163px'
        }
      },
})
