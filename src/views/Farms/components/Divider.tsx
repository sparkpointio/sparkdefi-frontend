import React from 'react'
import styled from 'styled-components'

export default styled.div`
  background-color: ${({ theme }) => theme.colors.textSubtle};
  height: 1px;
  margin: 0 auto 32px;
  width: 100%;
`

export const StyledHr = styled.div`
  border-style: solid none none none;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
  width: 95%;
`

export const ModalHr = styled.hr`
  border-style: solid none none none;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`
