// @flow

import React from "react"
import { makeStyles } from "@mui/styles"
import { ThemeProvider, createMuiTheme } from "@mui/material/styles"
import "./theme.css"

const useStyles = makeStyles({
  container: {
    fontFamily: '"Inter UI", sans-serif'
  }
})

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Inter UI", "Roboto", sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none"
      }
    }
  }
})

export default ({ children }: any) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>{children}</div>
    </ThemeProvider>
  )
}
