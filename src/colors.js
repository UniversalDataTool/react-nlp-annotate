// @flow

import * as colors from "@material-ui/core/colors"

console.log({ colors, keys: Object.keys(colors) })

export default Object.keys(colors)
  .filter(c => c !== "common")
  .map(c => colors[c][700])
