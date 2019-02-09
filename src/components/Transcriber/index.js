// @flow

import React from "react"
import EditableDocument from "../EditableDocument"
import type { TranscriberProps } from "../../types"

export default ({
  initialTranscriptionText,
  onChange,
  audio
}: TranscriberProps) => {
  return (
    <div>
      <div style={{ textAlign: "center", padding: 10 }}>
        <audio controlsList="nodownload" controls>
          <source src={audio} />
        </audio>
      </div>
      <div style={{ padding: 10 }}>
        <EditableDocument
          onChange={onChange}
          initialText={initialTranscriptionText}
        />
      </div>
    </div>
  )
}
