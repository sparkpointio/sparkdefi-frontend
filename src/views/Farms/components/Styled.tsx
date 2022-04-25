import React from 'react'
import styled, { ThemeContext } from 'styled-components'

const Container = styled.div`
  min-width: 720px;
  display: flex;
  justify-content: space-between;
  height: auto;
`

const DetailsCont = styled.div`
  width: 30%;
  height: auto;
  overflow: visible;
`

const ActionDiv = styled.div`
  margin: 15px 0px;
  padding: 10px;
`
const ModalFooter = styled.div`
  max-width: 720px;
  display: flex;
  justify-content: space-between;
`

export { DetailsCont, ActionDiv, ModalFooter }
export default Container
