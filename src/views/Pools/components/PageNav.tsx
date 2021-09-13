  
import React, { useContext } from 'react'
import styled, {ThemeContext} from 'styled-components'
import { Link} from 'react-router-dom'
import { Button, ButtonMenu, ButtonMenuItem, useModal, Flex, Text} from '@sparkpointio/sparkswap-uikit'



const StyledNav = styled.div`
  display: flex;
  height: 7vh;
`

const StyledButtonMenu = styled(ButtonMenu)`
  & {
    width: 100%;
    flex: 2;
    background-color: ${({theme}) => theme.colors.background};
  }
`
const StyledButton = styled(Button)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.textSubtle};
  height: 7vh;
`
const StyledFLex = styled(Flex)`
background-color: ${({theme}) => theme.colors.background};
border-bottom: 3px solid ${({theme}) => theme.colors.primary};
width: 100%;
  & > * {
    color: ${({theme}) => theme.isDark && theme.colors.textSubtle};
    flex: 1;
    width: 100%;
    text-align: center;
    padding: 10px;
  }
`

const Nav = ({ activeIndex = 0, setActiveIndex}: { activeIndex: number; setActiveIndex: (value: number) => void; }) => {
  const theme = useContext(ThemeContext)

  return (
  <StyledNav>
    <StyledFLex>
      <Button id="pool-nav-link" onClick={() => setActiveIndex(0)} style={{backgroundColor: activeIndex === 0 ? theme.colors.primary: 'transparent'}}>
        <Text>Farms</Text>
      </Button>
      <Button  id="pool-nav-link" onClick={() => setActiveIndex(1)} style={{backgroundColor: activeIndex === 1 ? theme.colors.primary: 'transparent'}}>
        <Text>Pools</Text>
      </Button>
    </StyledFLex>
  </StyledNav>
)}

export default Nav