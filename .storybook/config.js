import React from "react"
import { configure, addDecorator } from "@storybook/react"
import Theme from "../src/components/Theme"

export const themeDecorator = (storyFn: any) => {
  return <Theme>{storyFn()}</Theme>
}

function loadStories() {
  addDecorator(themeDecorator)
  const importAll = r => r.keys().map(r)
  importAll(require.context("../src/components", true, /\.story\.js$/))
}

configure(loadStories, module)
