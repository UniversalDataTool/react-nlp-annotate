// @flow

import React, { useState, useLayoutEffect } from "react"
import type { Label as LabelType } from "../../types.js"
import makeStyles from "@material-ui/styles/makeStyles"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import classnames from "classnames"

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

const findRouteFromParents = (labelId, labels) => {
  if (!labelId) return []
  const label = labels.find(l => (l.id || "root") === labelId) || {}
  if (label) {
    return findRouteFromParents(label.parent, labels).concat([labelId])
  }
  return [labelId]
}

const Label = (props: {
  ...$Exact<LabelType>,
  hasChildren?: boolean,
  small?: boolean,
  hotkey?: string,
  onClick: string => any
}) => {
  const { parent, color, displayName, id, small, hasChildren, hotkey } = props
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
  const [parents, changeParents] = useState([])
  const currentParent =
    parents.length > 0 ? parents[parents.length - 1] : undefined

  const hotkeyLabelMap = { r: "root" }
  const labelHotkeyMap = { root: "r" }
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i]
    const letters = (label.displayName || label.id).toLowerCase().split("")
    for (const letter of letters) {
      if (!hotkeyLabelMap[letter]) {
        hotkeyLabelMap[letter] = label.id
        labelHotkeyMap[label.id] = letter
        break
      }
    }
  }

  useLayoutEffect(() => {
    const eventFunc = e => {
      if (hotkeyLabelMap[e.key]) {
        const labelId = hotkeyLabelMap[e.key]
        if (!labels.some(l2 => l2.parent === labelId)) {
          if (labelId === "root") {
            changeParents([])
          } else {
            onSelectLabel(labelId)
          }
        } else {
          changeParents(findRouteFromParents(labelId, labels))
        }
      }
    }

    window.addEventListener("keydown", eventFunc)
    return () => {
      window.removeEventListener("keydown", eventFunc)
    }
  })
  return (
    <div>
      {labels.some(l => l.parent) && (
        <div style={{ alignItems: "center", display: "flex" }}>
          <Label
            small
            color={parents.length > 0 ? "#333" : "#ccc"}
            displayName="Root (r)"
            id=""
            onClick={() => changeParents([])}
          />
          {parents
            .map(p => labels.find(l => l.id === p))
            .filter(Boolean)
            .map(l => ({
              ...l,
              hasChildren: labels.some(l2 => l2.parent === l.id)
            }))
            .map((l, i) => (
              <Label
                small
                key={i}
                {...l}
                hotkey={labelHotkeyMap[l.id]}
                onClick={() => {
                  changeParents(parents.slice(0, parents.indexOf(l.id) + 1))
                }}
              />
            ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        {labels
          .filter(l => l.parent === currentParent)
          .map(l => ({
            ...l,
            hasChildren: labels.some(l2 => l2.parent === l.id)
          }))
          .map((l, i) => (
            <Label
              key={i}
              {...l}
              hotkey={labelHotkeyMap[l.id]}
              onClick={
                !l.hasChildren
                  ? onSelectLabel
                  : () => {
                      changeParents(parents.concat([l.id]))
                    }
              }
            />
          ))}
      </div>
    </div>
  )
}
