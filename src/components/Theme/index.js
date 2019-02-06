// @flow

import React from "react"
import "./theme.css"

export default ({ children }: any) => (
  <div
    style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 24,
      color: "#666"
    }}
  >
    {children}
  </div>
)
