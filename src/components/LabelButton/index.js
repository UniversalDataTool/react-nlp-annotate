// @flow

import React, { useMemo } from "react"
import type { Label as LabelType } from "../../types.js"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import classnames from "classnames"
import { makeStyles } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"

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
  },
  deleteableIcon: {
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
  },
  hotkeyText: {
    paddingLeft: 4
  },
  tooltip: {
    whiteSpace: "pre-wrap"
  }
})

const Label = (props: {
  ...$Exact<LabelType>,
  hasChildren?: boolean,
  small?: boolean,
  hotkey?: ?string,
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
  const tooltipClasses = useMemo(() => ({ tooltip: classes.tooltip }), [
    classes
  ])

  const button = (
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
      {hotkey && <div className={classes.hotkeyText}>({hotkey})</div>}
      {deletable && (
        <div className={classes.deleteableIcon}>
          <span>{"\u2716"}</span>
        </div>
      )}
    </div>
  )

  if (description) {
    return (
      <Tooltip title={description} arrow classes={tooltipClasses}>
        {button}
      </Tooltip>
    )
  } else {
    return button
  }
}

export default Label
