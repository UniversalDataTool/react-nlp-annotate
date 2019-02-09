// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import colors from "../../colors"

import NLPAnnotator from "./"

storiesOf("NLPAnnotator", module).add("Basic", () => (
  <NLPAnnotator
    type="label-sequence"
    document={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra ipsum tristique ligula venenatis placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce mollis velit nec tellus sollicitudin aliquam. In velit erat, iaculis id consectetur et, tincidunt sit amet mauris. Quisque ultricies, purus eleifend congue malesuada, ipsum erat molestie dolor, in pellentesque lacus purus vel nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sed vestibulum magna. Quisque ut lorem imperdiet, aliquam velit nec, dictum felis.`}
    labels={[
      {
        color: colors[0],
        id: "noun",
        displayName: "Noun"
      },
      {
        color: colors[1],
        id: "proper-noun",
        displayName: "Proper Noun"
      }
    ]}
  />
))
