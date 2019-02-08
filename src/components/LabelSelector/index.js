// @flow

import React from "react"
import type { Label as LabelType } from "../../types.js"
import makeStyles from "@material-ui/styles/makeStyles"

const useStyles = makeStyles({
  label: {
    display: "inline-block",
    cursor: "pointer",
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 4,
    borderRadius: 4,
    fontSize: 18,
    color: "#fff",
    "&:hover": {
      opacity: 0.6
    }
  }
})

const Label = (props: { ...$Exact<LabelType>, onClick: string => any }) => {
  const { parent, color, displayName, id } = props
  const classes = useStyles()
  return (
    <div
      onClick={() => props.onClick(id)}
      className={classes.label}
      style={{ backgroundColor: color }}
    >
      {displayName || id}
    </div>
  )
}

export default ({
  labels,
  onSelectLabel
}: {
  labels: Array<LabelType>,
  onSelectLabel: string => any
}) => {
  return (
    <div>
      {labels.map((l, i) => (
        <Label key={i} {...l} onClick={onSelectLabel} />
      ))}
    </div>
  )
}
