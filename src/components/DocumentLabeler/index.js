// @flow

import React, { useState, useMemo } from "react"

import type { LabelDocumentProps } from "../../types"
import Document from "../Document"
import LabelSelector from "../LabelSelector"
import stringToSequence from "../../string-to-sequence.js"
import LabelButton from "../LabelButton"

export default function DocumentLabeler(props: LabelDocumentProps) {
  const [selectedLabels, changeSelectedLabels] = useState([])
  const sequence = useMemo(() => stringToSequence(props.document), [
    props.document
  ])
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 4 }}>
      <div>
        <LabelSelector
          labels={props.labels}
          onSelectLabel={(labelId: string) => {
            if (props.multipleLabels) {
              changeSelectedLabels(selectedLabels.concat([labelId]))
            } else {
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
                  changeSelectedLabels(
                    selectedLabels.filter(l => l !== labelId)
                  )
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
