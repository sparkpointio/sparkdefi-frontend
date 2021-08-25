import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { setBlock } from '.'
import { State } from '../types'

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
