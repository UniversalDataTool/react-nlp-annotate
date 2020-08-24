// @flow

import React, { useState, useRef } from "react"
import type {
  SequenceItem as SequenceItemData,
  Relationship
} from "../../types"
import { styled } from "@material-ui/styles"
import stringToSequence from "../../string-to-sequence.js"
import Tooltip from "@material-ui/core/Tooltip"
import Measure from "react-measure"

const Container = styled("div")(({ relationshipsOn }) => ({
  lineHeight: 1.5,
  marginTop: 64,
  display: "flex",
  flexWrap: "wrap"
}))

const SequenceItem = styled("span")(({ color, relationshipsOn }) => ({
  display: "inline-flex",
  backgroundColor: color,
  color: "#fff",
  padding: 4,
  margin: 4,
  marginBottom: relationshipsOn ? 64 : 4,
  paddingLeft: 10,
  paddingRight: 10,
  borderRadius: 4,
  userSelect: "none",
  "&.unlabeled": {
    color: "#333",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2
  }
}))

const LabeledText = styled("div")({
  display: "inline-flex",
  cursor: "pointer",
  alignSelf: "center",
  fontSize: 11,
  width: 18,
  height: 18,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 4,
  borderRadius: 9,
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.2)"
})

type Props = {
  sequence: Array<SequenceItemData>,
  relationships: Array<Relationship>,
  canModifySequence?: boolean,
  onSequenceChange?: (Array<SequenceItem>) => any,
  onHighlightedChanged?: (Array<number>) => any,
  nothingHighlighted?: boolean,
  colorLabelMap?: Object
}

export default function Document({
  sequence,
  relationships,
  onHighlightedChanged = () => null,
  onSequenceChange = () => null,
  nothingHighlighted = false,
  colorLabelMap = {}
}: Props) {
  const sequenceItemPositionsRef = useRef({})
  const [mouseDown, changeMouseDown] = useState()
  const [
    [firstSelected, lastSelected],
    changeHighlightedRangeState
  ] = useState([null, null])
  const changeHighlightedRange = ([first, last]) => {
    changeHighlightedRangeState([first, last])
    const highlightedItems = []
    for (let i = Math.min(first, last); i <= Math.max(first, last); i++)
      highlightedItems.push(i)
    onHighlightedChanged(highlightedItems)
  }
  let highlightedItems = []
  if (!nothingHighlighted && firstSelected !== null && lastSelected !== null) {
    for (
      let i = Math.min(firstSelected, lastSelected);
      i <= Math.max(firstSelected, lastSelected);
      i++
    )
      highlightedItems.push(i)
  }

  console.log(sequenceItemPositionsRef.current)

  return (
    <Container
      relationshipsOn={Boolean(relationships)}
      onMouseDown={() => changeMouseDown(true)}
      onMouseUp={() => changeMouseDown(false)}
    >
      {sequence.map((seq, i) => (
        <Measure
          offset
          key={seq.textId || i}
          onResize={contentRect => {
            if (!sequenceItemPositionsRef.current) return
            sequenceItemPositionsRef.current[seq.textId] = contentRect
          }}
        >
          {({ measureRef }) => (
            <SequenceItem
              ref={measureRef}
              relationshipsOn={Boolean(relationships)}
              onMouseDown={() => {
                if (seq.label) return
                changeHighlightedRange([i, i])
              }}
              onMouseMove={() => {
                if (seq.label) return
                if (mouseDown && i !== lastSelected) {
                  changeHighlightedRange([
                    firstSelected === null ? i : firstSelected,
                    i
                  ])
                }
              }}
              className={seq.label ? "label" : "unlabeled"}
              color={
                seq.label
                  ? seq.color || colorLabelMap[seq.label] || "#333"
                  : seq.text !== " " && highlightedItems.includes(i)
                  ? "#ccc"
                  : "inherit"
              }
              key={i}
            >
              {seq.label ? (
                <Tooltip title={seq.label} placement="bottom">
                  <div>{seq.text}</div>
                </Tooltip>
              ) : (
                <div>{seq.text}</div>
              )}
              {seq.label && (
                <LabeledText
                  onClick={() => {
                    onSequenceChange(
                      sequence
                        .flatMap(s =>
                          s !== seq ? s : stringToSequence(s.text)
                        )
                        .filter(s => s.text.length > 0)
                    )
                  }}
                >
                  <span>{"\u2716"}</span>
                </LabeledText>
              )}
            </SequenceItem>
          )}
        </Measure>
      ))}
    </Container>
  )
}
