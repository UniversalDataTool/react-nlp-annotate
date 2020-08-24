// @flow

import React, { useState, useMemo } from "react"

import type { SequenceAnnotatorProps } from "../../types"
import Document from "../Document"
import LabelSelector from "../LabelSelector"
import stringToSequence from "../../string-to-sequence.js"
import mergeSequence from "../../merge-sequence.js"
import colors from "../../colors"

export default function RelationshipAnnotator(props: SequenceAnnotatorProps) {
  const [highlightedItems, changeHighlightedItems] = useState([])
  const [sequence, changeSequence] = useState(() =>
    props.initialSequence
      ? props.initialSequence.flatMap(entity =>
          entity.label
            ? [entity]
            : stringToSequence(entity.text, props.separatorRegex)
        )
      : stringToSequence(props.document)
  )
  const colorLabelMap = useMemo(
    () =>
      props.labels.reduce(
        (acc, l, i) => ((acc[l.id] = colors[i % colors.length]), acc),
        {}
      ),
    [props.labels]
  )

  return (
    <div>
      <div>
        <LabelSelector
          hotkeysEnabled={props.hotkeysEnabled}
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
            props.onChange(mergeSequence(newSequence))
            changeHighlightedItems([])
          }}
        />
      </div>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 5 }}>
        <Document
          colorLabelMap={colorLabelMap}
          nothingHighlighted={highlightedItems.length === 0}
          onHighlightedChanged={highlightedItems =>
            changeHighlightedItems(highlightedItems)
          }
          onSequenceChange={sequence => {
            changeSequence(sequence)
            props.onChange(mergeSequence(sequence))
          }}
          sequence={sequence}
        />
      </div>
    </div>
  )
}
