// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import colors from "../../colors"

import RelationshipAnnotator from "./"

storiesOf("RelationshipAnnotator", module)
  .add("Basic", () => (
    <RelationshipAnnotator
      type="label-relationships"
      document={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra ipsum tristique ligula venenatis placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce mollis velit nec tellus sollicitudin aliquam. In velit erat, iaculis id consectetur et, tincidunt sit amet mauris. Quisque ultricies, purus eleifend congue malesuada, ipsum erat molestie dolor, in pellentesque lacus purus vel nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sed vestibulum magna. Quisque ut lorem imperdiet, aliquam velit nec, dictum felis.`}
      entityLabels={[
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
      relationshipLabels={[
        {
          color: colors[2],
          id: "eaten-by",
          displayName: "Eaten By"
        },
        {
          color: colors[3],
          id: "not-friends",
          displayName: "Not Friends"
        }
      ]}
      onChange={action("onChange")}
    />
  ))
  .add("Initial Content", () => (
    <RelationshipAnnotator
      type="label-relationships"
      document={`Lorem ipsum dolor.`}
      initialSequence={[
        { label: "noun", text: "Lorem", textId: "lorem" },
        { text: " ipsum  ", textId: "ipsum" },
        { label: "proper-noun", text: "dolor.", textId: "dolor" },
        { text: " this should be broken up into words.", textId: "therest" }
      ]}
      initialRelationships={[{ from: "lorem", to: "ipsum", label: "eaten-by" }]}
      entityLabels={[
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
      relationshipLabels={[
        {
          color: colors[2],
          id: "eaten-by",
          displayName: "Eaten By"
        },
        {
          color: colors[3],
          id: "not-friends",
          displayName: "Not Friends"
        }
      ]}
      onChange={action("onChange")}
    />
  ))
