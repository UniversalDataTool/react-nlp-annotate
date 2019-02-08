// @flow

import React, { useState } from "react"

import type { Props } from "../../types"
import Document from "../Document"

const getInitialSequence = (doc: string) => {
  doc.match
}

export default function NLPAnnotator(props: Props) {
  const [highlightedItems, changeHighlightedItems] = useState([])
  const [sequence, changeSequence] = useState(
    getInitialSequence(props.document)
  )

  return (
    <div>
      <div />
      <div>
        <Document
          onHighlightedChanged={highlightedItems =>
            changeHighlightedItems(highlightedItems)
          }
          onSequenceChange={sequence => changeSequence(sequence)}
          sequence={props.sequence}
        />
      </div>
    </div>
  )
}
