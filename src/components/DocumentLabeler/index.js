// @flow

import React, { useState, useMemo } from "react"

import type { LabelDocumentProps } from "../../types"
import Document from "../Document"
import LabelSelector from "../LabelSelector"
import stringToSequence from "../../string-to-sequence.js"
import LabelButton from "../LabelButton"

export default function DocumentLabeler(props: LabelDocumentProps) {
  const [selectedLabels, changeSelectedLabels] = useState(
    props.initialLabels || []
  )
  const sequence = useMemo(() => stringToSequence(props.document), [
    props.document
  ])
  return (
    <div>
      <div>
        <LabelSelector
          labels={props.labels}
          onSelectLabel={(labelId: string) => {
            if (props.multipleLabels) {
              changeSelectedLabels(selectedLabels.concat([labelId]))
              props.onChange(selectedLabels.concat([labelId]))
            } else {
              props.onChange(labelId)
              changeSelectedLabels([labelId])
            }
          }}
        />
      </div>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 5 }}>
        <div>
          {selectedLabels.map(labelId => {
            const label = props.labels.find(l => l.id === labelId)
            if (!label) return
            return (
              <LabelButton
                {...label}
                small
                deletable
                onClick={(labelId: string) => {
                  const newSelectedLabels = selectedLabels.filter(
                    l => l !== labelId
                  )
                  changeSelectedLabels(newSelectedLabels)
                  if (props.multipleLabels) {
                    props.onChange(newSelectedLabels)
                  } else {
                    props.onChange(null)
                  }
                }}
              />
            )
          })}
        </div>
        <Document nothingHighlighted sequence={sequence} />
      </div>
    </div>
  )
}
