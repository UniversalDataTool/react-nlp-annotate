// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import colors from "../../colors"

import SequenceAnnotator from "./"

storiesOf("SequenceAnnotator", module)
  .add("Basic", () => (
    <SequenceAnnotator
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
      onChange={action("onChange")}
    />
  ))
  .add("Initial Content", () => (
    <SequenceAnnotator
      type="label-sequence"
      document={`Lorem ipsum dolor.`}
      initialSequence={[
        { label: "noun", text: "Lorem" },
        { text: " ipsum  " },
        { label: "proper-noun", text: "dolor." },
        { text: " this should be broken up into words." }
      ]}
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
      onChange={action("onChange")}
    />
  ))
  .add("Basic Nested Labels", () => (
    <SequenceAnnotator
      type="label-sequence"
      document={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra ipsum tristique ligula venenatis placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce mollis velit nec tellus sollicitudin aliquam. In velit erat, iaculis id consectetur et, tincidunt sit amet mauris. Quisque ultricies, purus eleifend congue malesuada, ipsum erat molestie dolor, in pellentesque lacus purus vel nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sed vestibulum magna. Quisque ut lorem imperdiet, aliquam velit nec, dictum felis.`}
      labels={[
        {
          color: colors[0],
          id: "intent",
          displayName: "Intent"
        },
        {
          color: colors[1],
          id: "subject",
          displayName: "Subject"
        },
        {
          color: colors[6],
          id: "desire",
          displayName: "Desire",
          parent: "intent"
        },
        {
          color: colors[7],
          id: "informative-desire",
          displayName: "Informative Desire",
          parent: "desire"
        },
        {
          color: colors[2],
          id: "wants-information",
          displayName: "Wants More Information",
          parent: "informative-desire"
        },
        {
          color: colors[3],
          id: "cancel",
          displayName: "Wants To Cancel",
          parent: "desire"
        },
        {
          color: colors[4],
          id: "continue",
          displayName: "Wants To Continue",
          parent: "desire"
        },
        {
          color: colors[5],
          id: "person",
          displayName: "Person",
          parent: "subject"
        },
        {
          color: colors[6],
          id: "object",
          displayName: "Object",
          parent: "subject"
        }
      ]}
      onChange={action("onChange")}
    />
  ))
  .add("Accented Characters", () => (
    <SequenceAnnotator
      type="label-sequence"
      document={`This should appear as a single word: aùbûcàdâeçfégèhêiëjïkîlôm (and not multiple letters)`}
      labels={[
        {
          color: colors[0],
          id: "test",
          displayName: "test"
        }
      ]}
      onChange={action("onChange")}
    />
  ))
