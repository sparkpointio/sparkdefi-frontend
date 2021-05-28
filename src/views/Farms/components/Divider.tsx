import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

export default styled.div`
  background-color: ${({ theme }) => theme.colors.textSubtle};
  height: 1px;
  margin: 0 auto 32px;
  width: 100%;
`

export function StyledHr() {
  const theme = useContext(ThemeContext);

  return (
    <hr style={{border: `2px solid ${theme.colors.primary}` ,width: '100%',}} />
  )
}