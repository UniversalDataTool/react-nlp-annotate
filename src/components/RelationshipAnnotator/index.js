// @flow

import React, { useState, useMemo } from "react"

import type { RelationshipAnnotatorProps } from "../../types"
import Document from "../Document"
import LabelSelector from "../LabelSelector"
import stringToSequence from "../../string-to-sequence.js"
import mergeSequence from "../../merge-sequence.js"
import colors from "../../colors"

const withId = entity =>
  entity.textId
    ? entity
    : {
        ...entity,
        textId: Math.random()
          .toString(36)
          .slice(-8)
      }

export default function RelationshipAnnotator(
  props: RelationshipAnnotatorProps
) {
  const [highlightedItems, changeHighlightedItems] = useState([])
  const [relationships, setRelationships] = useState(props.relationships || [])
  const [activePair, setActivePair] = useState(null)
  const [creatingRelationships, setCreatingRelationships] = useState(true)
  const [sequence, changeSequence] = useState(() =>
    props.initialSequence
      ? props.initialSequence.flatMap(entity =>
          entity.label
            ? [withId(entity)]
            : stringToSequence(entity.text, props.separatorRegex).map(withId)
        )
      : stringToSequence(props.document).map(withId)
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
    <div
      onMouseMove={e => {
        lastMousePosition.current = { x: e.target.clientX, y: e.target.clientX }
      }}
    >
      <div>
        <LabelSelector
          hotkeysEnabled={props.hotkeysEnabled}
          labels={props.labels}
          onSelectLabel={(label: string) => {
            if (!creatingRelationships) {
              const { color } =
                props.labels.find(({ id }) => label === id) || {}
              let buildText = ""
              const newSequence = []
              for (
                let itemIndex = 0;
                itemIndex < sequence.length;
                itemIndex++
              ) {
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
              props.onChange({
                sequence: mergeSequence(newSequence),
                relationships
              })
              changeHighlightedItems([])
            } else {
              setActivePair(null)
              const newRelationships = relationships.concat([
                { ...activePair, label: label, color: colorLabelMap[label] }
              ])
              setRelationships(newRelationships)
              props.onChange({
                sequence,
                relationships: newRelationships
              })
            }
          }}
        />
      </div>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 5 }}>
        <Document
          colorLabelMap={colorLabelMap}
          nothingHighlighted={highlightedItems.length === 0}
          onLastPairClickedChanged={([first, second]) => {
            setActivePair({
              from: sequence[first].textId,
              to: sequence[second].textId,
              label: "???",
              color: "#333"
            })
          }}
          onRelationshipsChange={relationships =>
            setRelationships(relationships)
          }
          onHighlightedChanged={highlightedItems =>
            changeHighlightedItems(highlightedItems)
          }
          onSequenceChange={sequence => {
            changeSequence(sequence)
            props.onChange({ sequence: mergeSequence(sequence) })
          }}
          sequence={sequence}
          relationships={relationships.concat(
            activePair !== null ? [activePair] : []
          )}
          createRelationshipsMode={creatingRelationships}
        />
      </div>
    </div>
  )
}
