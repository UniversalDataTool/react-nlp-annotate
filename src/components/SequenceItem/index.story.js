// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import SequenceItem from "./"

storiesOf("SequenceItem", module).add("Basic", () => {
  return (
    <SequenceItem
      textId="textid"
      text="This is a sequence item"
      label="somelabel"
      color="#f00"
      sequenceItemIndex={0}
      sequenceItemPositionsRef={{ current: {} }}
      relationshipsOn={false}
      createRelationshipsMode={false}
      onChangeFirstSequenceItem={action("onChangeFirstSequenceItem")}
      onChangeSecondSequenceItem={action("onChangeSecondSequenceItem")}
      onCreateEmptyRelationship={action("onCreateEmptyRelationship")}
      onChangeHighlightedRange={action("onChangeHighlightedRange")}
      onRemoveLabel={action("onRemoveLabel")}
      firstSequenceItem={null}
      secondSequenceItem={null}
      mouseDown={false}
      firstSelected={null}
      lastSelected={null}
      isHighlighted={false}
    />
  )
})
