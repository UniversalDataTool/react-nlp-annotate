// @flow

import React, { useState } from "react"

import type { SequenceAnnotatorProps } from "../../types"
import Document from "../Document"
import LabelSelector from "../LabelSelector"
import stringToSequence from "../../string-to-sequence.js"

export default function SequenceAnnotator(props: SequenceAnnotatorProps) {
  const [highlightedItems, changeHighlightedItems] = useState([])
  const [sequence, changeSequence] = useState(() =>
    stringToSequence(props.document)
  )
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 4 }}>
      <div>
        <LabelSelector
          labels={props.labels}
          onSelectLabel={(label: string) => {
            const { color } = props.labels.find(({ id }) => label === id) || {}
            let buildText = ""
            const newSequence = []
            for (let itemIndex = 0; itemIndex < sequence.length; itemIndex++) {
              const item = sequence[itemIndex]
              if (!highlightedItems.includes(itemIndex) || item.label) {
                if (buildText.length > 0) {
                  newSequence.push({
                    text: buildText,
                    color,
                    label
                  })
                  buildText = ""
                }
                newSequence.push(item)
              } else {
                buildText += item.text
              }
            }
            if (buildText.length > 0) {
              newSequence.push({
                text: buildText,
                color,
                label
              })
            }

            changeSequence(newSequence)
            changeHighlightedItems([])
          }}
        />
      </div>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 4 }}>
        <Document
          nothingHighlighted={highlightedItems.length === 0}
          onHighlightedChanged={highlightedItems =>
            changeHighlightedItems(highlightedItems)
          }
          onSequenceChange={sequence => changeSequence(sequence)}
          sequence={sequence}
        />
      </div>
    </div>
  )
}
