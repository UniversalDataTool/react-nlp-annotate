// @flow

import React, { useState, useRef, useEffect } from "react"
import type {
  SequenceItem as SequenceItemData,
  Relationship
} from "../../types"
import { styled } from "@mui/styles"
import RelationshipArrows from "../RelationshipArrows"
import colors from "../../colors"
import ArrowToMouse from "../ArrowToMouse"
import { useTimeout, useWindowSize } from "react-use"
import SequenceItem from "../SequenceItem"
import classNames from "classnames"
import stringToSequence from "../../string-to-sequence"
import useEventCallback from "use-event-callback"

const Container = styled("div")(({ relationshipsOn }) => ({
  lineHeight: 1.5,
  marginTop: relationshipsOn ? 64 : 0,
  display: "flex",
  flexWrap: "wrap"
}))

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
  onCreateEmptyRelationship = () => null,
  onSequenceChange = () => null,
  onRelationshipsChange = () => null,
  nothingHighlighted = false,
  createRelationshipsMode = false,
  colorLabelMap = {}
}: Props) {
  const sequenceItemPositionsRef = useRef({})
  const [mouseDown, changeMouseDown] = useState()
  const [timeoutCalled, cancelTimeout, resetTimeout] = useTimeout(30) // Force rerender after mounting
  const windowSize = useWindowSize()
  useEffect(() => {
    resetTimeout()
  }, [windowSize])
  const [
    [firstSelected, lastSelected],
    changeHighlightedRangeState
  ] = useState([null, null])

  const [firstSequenceItem, setFirstSequenceItem] = useState(null)
  const [secondSequenceItem, setSecondSequenceItem] = useState(null)

  useEffect(() => {
    setFirstSequenceItem(null)
    setSecondSequenceItem(null)
    changeHighlightedRangeState([null, null])
    changeMouseDown(false)
  }, [createRelationshipsMode])

  const changeHighlightedRange = ([first, last]) => {
    if (createRelationshipsMode) return
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

  const onRemoveLabel = useEventCallback(sequenceItemIndex => {
    onSequenceChange(
      sequence
        .flatMap((s, i) =>
          i !== sequenceItemIndex ? s : stringToSequence(s.text)
        )
        .filter(s => s.text.length > 0)
    )
  })

  return (
    <Container
      relationshipsOn={Boolean(relationships)}
      onMouseDown={() => changeMouseDown(true)}
      onMouseUp={() => {
        if (createRelationshipsMode && firstSequenceItem) {
          setFirstSequenceItem(null)
          if (secondSequenceItem) {
            setSecondSequenceItem(null)
          }
        }
        changeMouseDown(false)
      }}
    >
      {sequence.map((seq, i) => (
        <SequenceItem
          {...seq}
          sequenceItemIndex={i}
          sequenceItemPositionsRef={sequenceItemPositionsRef}
          relationshipsOn={Boolean(relationships)}
          createRelationshipsMode={createRelationshipsMode}
          onChangeFirstSequenceItem={setFirstSequenceItem}
          onChangeSecondSequenceItem={setSecondSequenceItem}
          onCreateEmptyRelationship={onCreateEmptyRelationship}
          onChangeHighlightedRange={changeHighlightedRange}
          firstSequenceItem={firstSequenceItem}
          secondSequenceItem={secondSequenceItem}
          mouseDown={mouseDown}
          firstSelected={firstSelected}
          lastSelected={lastSelected}
          isHighlighted={highlightedItems.includes(i)}
          onRemoveLabel={onRemoveLabel}
          color={seq.color || colorLabelMap[seq.label]}
          key={i}
        />
      ))}
      {firstSequenceItem && !secondSequenceItem && (
        <ArrowToMouse
          startAt={
            ((sequenceItemPositionsRef.current || {})[firstSequenceItem] || {})
              .offset
          }
        />
      )}
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
