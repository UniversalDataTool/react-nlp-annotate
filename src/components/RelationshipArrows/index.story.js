// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import colors from "../../colors"

import RelationshipArrows from "./"

storiesOf("RelationshipArrows", module).add("Basic", () => (
  <div style={{ padding: 100 }}>
    <RelationshipArrows
      positions={{
        l0: {
          offset: { top: 68, left: 4, width: 54, height: 32 }
        },
        l1: {
          offset: { top: 68, left: 66, width: 62, height: 32 }
        },
        l2: {
          offset: { top: 68, left: 136, width: 56, height: 32 }
        },
        l3: {
          offset: { top: 68, left: 200, width: 13, height: 32 }
        },
        l4: {
          offset: { top: 68, left: 221, width: 41, height: 32 }
        },
        l5: {
          offset: { top: 68, left: 270, width: 54, height: 32 }
        },
        l6: {
          offset: { top: 168, left: 4, width: 17, height: 32 }
        },
        l7: {
          offset: { top: 168, left: 29, width: 83, height: 32 }
        },
        l8: {
          offset: { top: 168, left: 120, width: 16, height: 32 }
        },
        l9: {
          offset: { top: 168, left: 144, width: 60, height: 32 }
        },
        l10: {
          offset: { top: 168, left: 212, width: 71, height: 32 }
        },
        l11: {
          offset: { top: 268, left: 4, width: 100, height: 32 }
        },
        l12: {
          offset: { top: 268, left: 112, width: 31, height: 32 }
        },
        l13: {
          offset: { top: 268, left: 151, width: 104, height: 32 }
        }
      }}
      arrows={[
        { from: "l2", to: "l4", label: "R1" },
        { from: "l1", to: "l4", label: "R2" },
        { from: "l0", to: "l4", label: "R2" },
        { from: "l5", to: "l6", label: "R3" },
        { from: "l7", to: "l6", label: "R3" },
        { from: "l8", to: "l6", label: "R3" },
        { from: "l2", to: "l1", label: "R4" },
        { from: "l4", to: "l10", label: "R5" },
        { from: "l1", to: "l12", label: "R6" },
        { from: "l12", to: "l1", label: "R6" }
      ].map((a, i) => ({ ...a, color: colors[i % colors.length] }))}
    />
  </div>
))
