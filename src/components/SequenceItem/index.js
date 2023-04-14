import React, { memo } from "react"
import classNames from "classnames"
import { styled, Tooltip } from "@mui/material"
import stringToSequence from "../../string-to-sequence.js"

const SequenceItemContainer = styled("span")(({ color, relationshipsOn }) => ({
  display: "inline-flex",
  cursor: "pointer",
  backgroundColor: color,
  color: "#fff",
  padding: 4,
  margin: 4,
  marginBottom: relationshipsOn ? 64 : 4,
  paddingLeft: 10,
  paddingRight: 10,
  borderRadius: 4,
  userSelect: "none",
  boxSizing: "border-box",
  "&.unlabeled": {
    color: "#333",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
    ".notSpace:hover": {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 0,
      paddingRight: 0,
      border: `2px dashed #ccc`
    }
  }
}))

const XContainer = styled("div")({
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

export const SequenceItem = ({
  textId,
  text,
  label,
  color,
  sequenceItemIndex,
  sequenceItemPositionsRef,
  relationshipsOn,
  createRelationshipsMode,
  onChangeFirstSequenceItem,
  onChangeSecondSequenceItem,
  onCreateEmptyRelationship,
  onChangeHighlightedRange,
  firstSequenceItem,
  secondSequenceItem,
  mouseDown,
  firstSelected,
  lastSelected,
  colorLabelMap,
  isHighlighted,
  onRemoveLabel
}) => {
  return (
    <SequenceItemContainer
      key={textId || sequenceItemIndex}
      ref={elm => {
        if (!elm) return
        sequenceItemPositionsRef.current[textId] = {
          offset: {
            left: elm.offsetLeft,
            top: elm.offsetTop,
            width: elm.offsetWidth,
            height: elm.offsetHeight
          }
        }
      }}
      relationshipsOn={relationshipsOn}
      onMouseUp={e => {
        if (!createRelationshipsMode) return
        if (!secondSequenceItem) {
          onChangeFirstSequenceItem(null)
          onChangeSecondSequenceItem(null)
          onCreateEmptyRelationship([firstSequenceItem, textId])
        } else {
          onChangeFirstSequenceItem(null)
          onChangeSecondSequenceItem(null)
        }
      }}
      onMouseDown={() => {
        if (createRelationshipsMode) {
          if (!firstSequenceItem) {
            onChangeFirstSequenceItem(textId)
          }
        } else {
          if (label) return
          onChangeHighlightedRange([sequenceItemIndex, sequenceItemIndex])
        }
      }}
      onMouseMove={() => {
        if (!mouseDown) return
        if (!createRelationshipsMode) {
          if (label) return
          if (sequenceItemIndex !== lastSelected) {
            onChangeHighlightedRange([
              firstSelected === null ? sequenceItemIndex : firstSelected,
              sequenceItemIndex
            ])
          }
        }
      }}
      className={classNames(
        label ? "label" : "unlabeled",
        text.trim().length > 0 && "notSpace"
      )}
      color={
        label
          ? color || "#333"
          : !createRelationshipsMode && text !== " " && isHighlighted
          ? "#ccc"
          : "inherit"
      }
    >
      {label ? (
        <Tooltip title={label} placement="bottom">
          <div>{text}</div>
        </Tooltip>
      ) : (
        <div>{text}</div>
      )}
      {label && !createRelationshipsMode && (
        <XContainer
          onClick={e => {
            e.stopPropagation()
            onRemoveLabel(sequenceItemIndex)
          }}
        >
          <span>✖</span>
        </XContainer>
      )}
    </SequenceItemContainer>
  )
}

export default memo(SequenceItem)
