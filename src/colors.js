// @flow

import * as colors from "@mui/material/colors"

export default Object.keys(colors)
  .filter(c => c !== "common")
  .map(c => colors[c][700])
