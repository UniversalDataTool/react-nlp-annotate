// @flow

/*

This file turned really ugly. It turns out routing arrows is pretty tricky.

I would advise a rewrite to anyone trying to work with this file. At first I
thought I needed to use a constraint solver, but it turns out that a system of
rules is fine. A lot of the formulas were built by checking numbers against examples
interactively.

Conceptually, we place arrows in places where we know they'll overlap, then we
look at each overlapping group and place them next to eachother in an order
prioritized by how far the arrow has traveled.

*/

import React from "react"
import { styled } from "@mui/material/styles"

const X_SEP_DIST = 5
const Y_SEP_DIST = 16

const ArrowLabel = styled("div")({
  position: "absolute",
  transform: "translate(-50%,0%)",
  padding: 1,
  paddingLeft: 4,
  paddingRight: 4,
  fontSize: 11,
  color: "#fff",
  border: "1px solid rgba(0,0,0,0.2)",
  // transition: "transform 120ms",
  borderRadius: 4,
  fontWeight: "bold",
  "&:hover": {
    zIndex: 999,
    cursor: "pointer",
    transform: "translate(-50%, 0%) scale(1.05,1.05)"
  }
})

export const RelationshipArrows = ({
  positions,
  showBoxBg = false,
  arrows,
  rowHeight = 100,
  onClickArrow
}) => {
  const totalWidth = Math.max(
    ...Object.values(positions).map(o => o.offset.left + o.offset.width)
  )
  const totalHeight = Math.max(
    ...Object.values(positions).map(o => o.offset.top + o.offset.height)
  )
  const constraintGroups: Array<
    Array<{
      type: "vertical" | "horizontal",
      x?: number,
      y?: number
    }>
  > = []
  for (const arrow of arrows) {
    const { from, to, label } = arrow

    if (!positions[from] || !positions[to]) return null

    const p1 = positions[from].offset
    const p2 = positions[to].offset

    const sameRow = p1.top === p2.top

    const xDist = p1.left - p2.left

    const rowDelta = Math.round(Math.abs(p1.top - p2.top) / rowHeight)

    if (sameRow) {
      const y = p1.top - Y_SEP_DIST * 1.5
      constraintGroups.push([
        {
          type: "vertical",
          direction: -Math.sign(xDist),
          weight: Math.abs(xDist),
          x: p1.left + p1.width / 2 - X_SEP_DIST * Math.sign(xDist),
          y: p1.top,
          height: rowHeight / 2,
          centerY: (p1.top + y) / 2
        },
        {
          type: "horizontal",
          direction: -1,
          weight: Math.abs(xDist),
          width: Math.abs(p1.left + p1.width / 2 - p2.left - p2.width / 2),
          centerX: (p1.left + p2.left + p1.width / 2 + p2.width / 2) / 2,
          y,
          hasLabel: true
        },
        {
          type: "vertical",
          direction: Math.sign(xDist),
          weight: Math.abs(xDist),
          x: p2.left + p2.width / 2 + X_SEP_DIST * Math.sign(xDist),
          y: p2.top,
          height: rowHeight / 2,
          centerY: (p1.top + y) / 2
        }
      ])
    } else if (rowDelta === 1) {
      const yDist = p1.top - p2.top
      if (yDist < 0) {
        const y = p1.top + p1.height + Y_SEP_DIST
        constraintGroups.push([
          {
            type: "vertical",
            direction: -Math.sign(xDist),
            weight: Math.abs(xDist),
            x: p1.left + p1.width / 2 - X_SEP_DIST * Math.sign(xDist),
            y: p1.top + p1.height,
            height: rowHeight / 2,
            centerY: (y + p1.top + p1.height) / 2
          },
          {
            type: "horizontal",
            direction: 1,
            weight: Math.abs(xDist),
            width: Math.abs(p1.left + p1.width / 2 - p2.left - p2.width / 2),
            centerX: (p1.left + p2.left + p1.width / 2 + p2.width / 2) / 2,
            y,
            hasLabel: true
          },
          {
            type: "vertical",
            direction: Math.sign(xDist),
            weight: Math.abs(xDist),
            x: p2.left + p2.width / 2 + X_SEP_DIST * Math.sign(xDist),
            y: p2.top,
            height: rowHeight / 2,
            centerY: (y + p2.top) / 2
          }
        ])
      } else {
        const y = p1.top - Y_SEP_DIST * 1.5
        // this arrow is going up (to the above row)
        constraintGroups.push([
          {
            type: "vertical",
            direction: -Math.sign(xDist),
            weight: Math.abs(xDist),
            x: p1.left + p1.width / 2 - X_SEP_DIST * Math.sign(xDist),
            y: p1.top,
            height: rowHeight / 2,
            centerY: (y + p1.top + p1.height) / 2
          },
          {
            type: "horizontal",
            direction: -1,
            weight: Math.abs(xDist),
            width: Math.abs(p1.left + p1.width / 2 - p2.left - p2.width / 2),
            centerX: (p1.left + p2.left + p1.width / 2 + p2.width / 2) / 2,
            y,
            hasLabel: true
          },
          {
            type: "vertical",
            direction: Math.sign(xDist),
            weight: Math.abs(xDist),
            x: p2.left + p2.width / 2 + X_SEP_DIST * Math.sign(xDist),
            y: p2.top + p2.height,
            height: rowHeight / 2,
            centerY: (y + p2.top + p2.height) / 2
          }
        ])
      }
    } else {
      const y1 = p1.top + p1.height + Y_SEP_DIST
      const y2 = p2.top - Y_SEP_DIST * 1.5
      const x1 = -10
      const xDist1 = p1.left + p1.width / 2 - x1
      const xDist2 = x1 - p2.left + p2.width / 2
      const yDist1 = p1.top + p1.height - p2.top
      const dsign = Math.sign(p2.top - p1.top)
      constraintGroups.push([
        {
          type: "vertical",
          direction: -1,
          weight: Math.abs(xDist1),
          x: p1.left + p1.width / 2 - X_SEP_DIST,
          y: p1.top + p1.height,
          height: rowHeight / 2,
          centerY: y1
        },
        {
          type: "horizontal",
          direction: 1,
          weight: Math.abs(xDist),
          width: Math.abs(p1.left + p1.width / 2 - p2.left - p2.width / 2),
          centerX: (p1.left + x1 + p1.width / 2) / 2,
          y: y1,
          hasLabel: true
        },
        {
          type: "vertical",
          direction: -1,
          weight: Math.abs(xDist),
          x: x1,
          height: Math.abs(y1 - y2),
          centerY: (p1.top + p2.top) / 2
        },
        {
          type: "horizontal",
          direction: -1,
          weight: Math.abs(xDist2),
          width: Math.abs(x1 - p2.left - p2.width / 2),
          centerX: (p2.left + x1 + p2.width / 2) / 2,
          y: y2
        },
        {
          type: "vertical",
          direction: -1,
          weight: Math.abs(xDist2),
          x: p2.left + p2.width / 2 - X_SEP_DIST,
          y: p2.top,
          height: Math.abs(y1 - y2),
          centerY: (p1.top + p2.top) / 2
        }
      ])
    }
  }
  for (const cg of constraintGroups) {
    for (const constraint of cg) {
      constraint.originalX = constraint.x
      constraint.originalY = constraint.y
    }
  }

  const verticalConstraintLocations = new Set()
  for (const verticalConstraint of constraintGroups.flatMap(cg =>
    cg.filter(c => c.type === "vertical")
  )) {
    verticalConstraintLocations.add(verticalConstraint.x)
  }

  for (const location of verticalConstraintLocations) {
    const constraints = constraintGroups.flatMap(cg =>
      cg.filter(c => c.type === "vertical" && c.x === location)
    )
    // In order of weight, each constraint is placed.
    constraints.sort((a, b) => b.weight - a.weight)
    const placedConstraints = []

    for (const c1 of constraints) {
      const conflicting = []
      for (const c2 of placedConstraints) {
        if (
          Math.abs(c1.centerY - c2.centerY) < c1.height / 2 + c2.height / 2 &&
          c1.x === c2.originalX
        ) {
          conflicting.push(c2)
        }
      }
      if (conflicting.length === 0) {
        placedConstraints.push(c1)
        continue
      } else {
        // Find highest/lowest y of conflicting constraint
        const highestVal = Math[c1.direction === 1 ? "max" : "min"](
          ...conflicting.map(c => c.x)
        )
        c1.x = highestVal + X_SEP_DIST * c1.direction
        placedConstraints.push(c1)
      }
    }
  }

  const horzConstraintLocations = new Set()
  for (const horzConstraint of constraintGroups.flatMap(cg =>
    cg.filter(c => c.type === "horizontal")
  )) {
    horzConstraintLocations.add(horzConstraint.x)
  }

  for (const location of horzConstraintLocations) {
    const constraints = constraintGroups.flatMap(cg =>
      cg.filter(c => c.type === "horizontal" && c.x === location)
    )
    // In order of weight, each constraint is placed.
    constraints.sort((a, b) => a.weight - b.weight)
    const placedConstraints = []

    for (const c1 of constraints) {
      const conflicting = []
      for (const c2 of placedConstraints) {
        if (
          Math.abs(c1.centerX - c2.centerX) < c1.width / 2 + c2.width / 2 &&
          c1.y === c2.originalY
        ) {
          conflicting.push(c2)
        }
      }
      if (conflicting.length === 0) {
        placedConstraints.push(c1)
        continue
      } else {
        // Find highest/lowest y of conflicting constraint
        const highestVal = Math[c1.direction === 1 ? "max" : "min"](
          ...conflicting.map(c => c.y)
        )
        c1.y = highestVal + Y_SEP_DIST * c1.direction
        placedConstraints.push(c1)
      }
    }
  }

  // Convert lines to points
  const linePoints: Array<Array<[number, number]>> = []
  for (const constraints of constraintGroups) {
    let lastPoint: [number, number] = [
      constraints[0].x || 0,
      constraints[0].y || 0
    ]
    const points = [lastPoint]
    for (const constraint of constraints.slice(1, -1)) {
      lastPoint = [
        constraint.x === undefined ? lastPoint[0] : constraint.x,
        constraint.y === undefined ? lastPoint[1] : constraint.y
      ]
      points.push(lastPoint)
    }
    const lastConstraint = constraints[constraints.length - 1]
    if (lastConstraint.type === "vertical") {
      points.push(
        [lastConstraint.x, lastPoint[1]],
        [lastConstraint.x, lastConstraint.y]
      )
    } else {
      throw new Error("Didn't build support for horizontal final (not needed)")
    }
    linePoints.push(points)
  }

  const labelPositions = constraintGroups.map((group, i) => {
    const labelConstraintIndex = group.findIndex(c => c.hasLabel)
    const p1 = linePoints[i][labelConstraintIndex]
    const p2 = linePoints[i][labelConstraintIndex + 1]
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
  })

  const svgOffset = { x: 100, y: 100 }
  const containerPosition = {
    position: "absolute",
    left: -svgOffset.x,
    top: -svgOffset.y
  }

  return (
    <div>
      <div
        style={{
          pointerEvents: "none",
          ...containerPosition
        }}
      >
        <svg
          width={totalWidth + svgOffset.x}
          height={totalHeight + svgOffset.y + 50}
        >
          <defs>
            {arrows.map((arrow, i) => (
              <marker
                id={"arrowhead" + i}
                markerWidth="5"
                markerHeight="5"
                refX="0"
                refY="2.5"
                orient="auto"
              >
                <polygon
                  fill={arrow.color || "#000"}
                  points="0 0, 6 2.5, 0 5"
                />
              </marker>
            ))}
          </defs>
          {linePoints.map((lp, i) => (
            <polyline
              key={i}
              stroke={arrows[i].color || "#000"}
              fill="none"
              marker-end={`url(#arrowhead${i})`}
              stroke-width="2"
              points={lp
                .map(
                  ([x, y], i) =>
                    `${svgOffset.x + x},${svgOffset.y +
                      y -
                      (i === lp.length - 1
                        ? lp[i - 1][1] < y
                          ? 10
                          : -10
                        : 0)}`
                )
                .join(" ")}
            />
          ))}
          {showBoxBg &&
            Object.values(positions).map(p => (
              <rect
                x={p.offset.left + svgOffset.x}
                y={p.offset.top + svgOffset.y}
                width={p.offset.width}
                height={p.offset.height}
                stroke="rgba(0,0,0,0.5)"
                stroke-dasharray="10 5"
                fill="none"
              />
            ))}
        </svg>
      </div>
      {arrows.map((arrow, i) => (
        <ArrowLabel
          key={i}
          onClick={e => {
            e.stopPropagation()
            onClickArrow(arrow)
          }}
          style={{
            left: labelPositions[i][0],
            top: labelPositions[i][1] - 9,
            backgroundColor: arrow.color
          }}
        >
          {arrow.label}
        </ArrowLabel>
      ))}
    </div>
  )
}

export default RelationshipArrows
