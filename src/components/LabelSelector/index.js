// @flow

import React, { useState, useLayoutEffect, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"
import type { Label as LabelType } from "../../types.js"
import LabelButton from "../LabelButton"
import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles({
  tooltip: {
    whiteSpace: "pre-wrap"
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

  const c = useStyles()

  return (
    <div>
      {labels.some(l => l.parent) && (
        <div
          style={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}
        >
          <LabelButton
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
              <Tooltip
                // open={helpOpen}
                classes={{ tooltip: c.tooltip }}
                key={i}
                title={l.description || "No Description"}
                placement="bottom"
              >
                <LabelButton
                  small
                  {...l}
                  hotkey={labelHotkeyMap[l.id]}
                  onClick={() => {
                    changeParents(parents.slice(0, parents.indexOf(l.id) + 1))
                  }}
                />
              </Tooltip>
            ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {labels
          .filter(l => l.parent === currentParent)
          .map(l => ({
            ...l,
            hasChildren: labels.some(l2 => l2.parent === l.id)
          }))
          .map((l, i) => (
            <Tooltip
              key={i}
              classes={{ tooltip: c.tooltip }}
              title={l.description || "No Description"}
              placement="bottom"
            >
              <div>
                <LabelButton
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
              </div>
            </Tooltip>
          ))}
      </div>
    </div>
  )
}
