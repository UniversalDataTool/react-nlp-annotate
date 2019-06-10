// @flow

import React from "react"
import type { Label as LabelType } from "../../types.js"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import classnames from "classnames"
import makeStyles from "@material-ui/styles/makeStyles"

const useStyles = makeStyles({
  label: {
    display: "inline-flex",
    cursor: "pointer",
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 4,
    borderRadius: 4,
    fontSize: 18,
    color: "#fff",
    alignItems: "center",
    "&:hover": {
      opacity: 0.6
    },
    "&.small": {
      fontSize: 12,
      fontWeight: "bold"
    }
  }
})

const Label = (props: {
  ...$Exact<LabelType>,
  hasChildren?: boolean,
  small?: boolean,
  hotkey?: string,
  deletable?: boolean,
  onClick: string => any
}) => {
  const {
    parent,
    color,
    displayName,
    description,
    id,
    small,
    hasChildren,
    hotkey,
    deletable
  } = props
  const classes = useStyles()

  return (
    <div
      onClick={() => props.onClick(id)}
      className={classnames(classes.label, small && "small")}
      style={{ backgroundColor: color }}
    >
      {hasChildren && (
        <FolderOpenIcon
          style={{
            width: small ? 12 : 20,
            height: small ? 12 : 20,
            marginRight: small ? 3 : 6
          }}
        />
      )}
      <div>{displayName || id}</div>
      {hotkey && <div style={{ paddingLeft: 4 }}>({hotkey})</div>}
      {deletable && (
        <div
          style={{
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
          }}
        >
          <span>{"\u2716"}</span>
        </div>
      )}
    </div>
  )
}

export default Label
