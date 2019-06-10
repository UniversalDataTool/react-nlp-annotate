// @flow

import React from "react"
import ReactDOM from "react-dom"
import Theme from "./components/Theme"
import DemoSite from "./components/DemoSite"

ReactDOM.render(
  <Theme>
    <DemoSite />
  </Theme>,
  document.getElementById("root")
)
