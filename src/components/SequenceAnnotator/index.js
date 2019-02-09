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
    <div>
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
            props.onChange(newSequence)
            changeHighlightedItems([])
          }}
        />
      </div>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 5 }}>
        <Document
          nothingHighlighted={highlightedItems.length === 0}
          onHighlightedChanged={highlightedItems =>
            changeHighlightedItems(highlightedItems)
          }
          onSequenceChange={sequence => {
            changeSequence(sequence)
            props.onChange(sequence)
          }}
          sequence={sequence}
        />
      </div>
    </div>
  )
}
