import * as React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', color: '#FFF' }}>
      <CircularProgress color="inherit" />
    </Box>
  )
}
