// @flow

import React, { useState, useRef, useEffect } from "react"
import type {
  SequenceItem as SequenceItemData,
  Relationship
} from "../../types"
import { styled } from "@material-ui/styles"
import stringToSequence from "../../string-to-sequence.js"
import Tooltip from "@material-ui/core/Tooltip"
import RelationshipArrows from "../RelationshipArrows"
import colors from "../../colors"
import { useTimeout, useWindowSize } from "react-use"

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
  onRelationshipsChange = () => null,
  nothingHighlighted = false,
  colorLabelMap = {}
}: Props) {
  const sequenceItemPositionsRef = useRef({})
  const [mouseDown, changeMouseDown] = useState()
  const [timeoutCalled, cancelTimeout, resetTimeout] = useTimeout(100) // Force rerender after mounting
  const windowSize = useWindowSize()
  useEffect(() => {
    resetTimeout()
  }, [windowSize])
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

  return (
    <Container
      relationshipsOn={Boolean(relationships)}
      onMouseDown={() => changeMouseDown(true)}
      onMouseUp={() => changeMouseDown(false)}
    >
      {sequence.map((seq, i) => (
        <SequenceItem
          key={seq.textId || i}
          ref={elm => {
            if (!elm) return
            sequenceItemPositionsRef.current[seq.textId] = {
              offset: {
                left: elm.offsetLeft,
                top: elm.offsetTop,
                width: elm.offsetWidth,
                height: elm.offsetHeight
              }
            }
          }}
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
                    .flatMap(s => (s !== seq ? s : stringToSequence(s.text)))
                    .filter(s => s.text.length > 0)
                )
              }}
            >
              <span>{"\u2716"}</span>
            </LabeledText>
          )}
        </SequenceItem>
      ))}
      {relationships && (
        <RelationshipArrows
          onClickArrow={({ label, from, to }) => {
            onRelationshipsChange(
              relationships.filter(
                r => !(r.from === from && r.to === to && r.label === label)
              )
            )
          }}
          positions={sequenceItemPositionsRef.current}
          arrows={relationships.map((a, i) => ({
            ...a,
            color: a.color || colors[i % colors.length]
          }))}
        />
      )}
    </Container>
  )
}
