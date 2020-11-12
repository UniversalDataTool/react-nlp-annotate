// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Document from "./"

storiesOf("Document", module)
  .add("Basic", () => (
    <Document
      onSequenceChange={action("onSequenceChange")}
      onHighlightedChanged={action("onHighlightedChanged")}
      sequence={`Barack Hussein Obama II (born August 4, 1961) is an American attorney and politician who served as the 44th President of the United States from January 20, 2009, to January 20, 2017. A member of the Democratic Party, he was the first African American to serve as president. He was previously a United States Senator from Illinois and a member of the Illinois State Senate.`
        .split(" ")
        .map(text =>
          Math.random() < 0.9
            ? { text: text + " " }
            : {
              text: text + " ",
              label:
                "somelabel" +
                Math.random()
                  .toString()
                  .slice(-4),
              color: "#9638F9"
            }
        )}
    />
  ))
  .add("Relationships", () => (
    <Document
      createRelationshipsMode
      onSequenceChange={action("onSequenceChange")}
      onRelationshipsChange={action("onRelationshipsChange")}
      onHighlightedChanged={action("onHighlightedChanged")}
      sequence={`Barack Hussein Obama II (born August 4, 1961) is an American attorney and politician`
        .split(" ")
        .map((text, i) =>
          Math.random() < 0.9
            ? { text: text + " ", textId: `l${i}` }
            : {
              text: text + " ",
              textId: `l${i}`,
              label:
                "somelabel" +
                Math.random()
                  .toString()
                  .slice(-4),
              color: "#9638F9"
            }
        )}
      relationships={[
        {
          from: "l0",
          to: "l4",
          label: "was eaten by"
        }
      ]}
    />
  ))
  .add("Character Sequence", () => (
    <Document
      onSequenceChange={action("onSequenceChange")}
      onHighlightedChanged={action("onHighlightedChanged")}
      sequence={`Barack Hussein Obama II (born August 4, 1961) is an American attorney and politician who served as the 44th President of the United States from January 20, 2009, to January 20, 2017. A member of the Democratic Party, he was the first African American to serve as president. He was previously a United States Senator from Illinois and a member of the Illinois State Senate.`
        .split("")
        .map(c => ({
          text: c
        }))
      }
    />
  ))