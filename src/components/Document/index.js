// @flow

import React, { useState } from "react"
import type { SequenceItem } from "../../types"

type Props = {
  sequence: Array<SequenceItem>,
  canModifySequence?: boolean,
  onChange: ({ sequence: Array<SequenceItem> }) => any
}

export default function Document({ sequence }: Props) {
  return (
    <div>
      {sequence.map((seq, i) => (
        <>
          <span
            style={
              seq.label
                ? {
                    display: "inline-block",
                    backgroundColor: seq.color || "#333",
                    color: "#fff",
                    padding: 4,
                    margin: 4,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 4
                  }
                : {
                    display: "inline-block",
                    color: "#333",
                    marginTop: 4,
                    marginBottom: 4,
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 2,
                    paddingRight: 2
                  }
            }
            key={i}
          >
            {seq.text}
          </span>
        </>
      ))}
    </div>
  )
}
