// @flow

import React from "react"
import ReactDOM from "react-dom"
import Theme from "./components/Theme"
import DemoSite from "./components/DemoSite"
import DatasetViewer from "./components/DatasetViewer"

ReactDOM.render(
  <Theme>
    {window.location.search.includes("load_url") ? (
      <DatasetViewer />
    ) : (
      <DemoSite />
    )}
  </Theme>,
  document.getElementById("root")
)
