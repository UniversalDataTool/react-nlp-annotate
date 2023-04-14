// @flow

import React, { useRef } from "react"
import { styled } from "@mui/material/styles"
import { useMouse } from "react-use"

const Container = styled("div")({
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none"
})

export const ArrowToMouse = ({ startAt } = {}) => {
  const ref = useRef(null)
  let { elX: mx, elY: my } = useMouse(ref)
  let dx, dy
  if (mx === 0 && my === 0) {
    dx = 0
    dy = 0
    mx = startAt.left + startAt.width / 2
    my = startAt.top + startAt.height / 2
  } else {
    const a = mx - startAt.left
    const b = my - startAt.top
    const c = Math.sqrt(a * a + b * b)
    const sf = c < 100 ? (c / 100) ** 2 : 1
    dx = (a / c) * sf
    dy = (b / c) * sf
  }
  return (
    <Container ref={ref}>
      <svg
        width={Math.max(mx, startAt.left + startAt.width + 8)}
        height={Math.max(my, startAt.top + startAt.height + 8)}
      >
        <defs>
          <marker
            id={"arrowhead"}
            markerWidth="5"
            markerHeight="5"
            refX="0"
            refY="2.5"
            orient="auto"
          >
            <polygon fill={"rgba(255,0,0,0.75)"} points="0 0, 6 2.5, 0 5" />
          </marker>
        </defs>
        <rect
          x={startAt.left - 5}
          y={startAt.top - 5}
          width={startAt.width + 10}
          height={startAt.height + 10}
          stroke="rgba(255,0,0,0.75)"
          stroke-dasharray="10 5"
          fill="none"
        />
        <line
          x1={startAt.left + startAt.width / 2}
          y1={startAt.top + startAt.height / 2}
          x2={mx - dx * 30}
          y2={my - dy * 30}
          marker-end={`url(#arrowhead)`}
          stroke-width={3}
          stroke="rgba(255,0,0,0.75)"
          fill="none"
        />
      </svg>
    </Container>
  )
}

export default ArrowToMouse
