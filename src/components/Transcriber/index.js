// @flow

import React, { useState } from "react"
import EditableDocument from "../EditableDocument"
import type { TranscriberProps } from "../../types"

export default ({
  initialTranscriptionText,
  onChange,
  audio,
  phraseBank,
  validator
}: TranscriberProps) => {
  const [autoPlayStatus, changeAutoPlayStatus] = useState(
    window.localStorage.NLP_ANNOTATOR_AUTOPLAY === "true"
  )
  return (
    <div>
      <div style={{ textAlign: "center", padding: 10 }}>
        <audio
          preload
          autoPlay={autoPlayStatus}
          loop
          controlsList="nodownload"
          controls
        >
          <source src={audio} />
        </audio>
        <span style={{ fontSize: 12 }}>
          Autoplay:{" "}
          <input
            checked={autoPlayStatus}
            type="checkbox"
            onChange={() => {
              window.localStorage.NLP_ANNOTATOR_AUTOPLAY = JSON.stringify(
                window.localStorage.NLP_ANNOTATOR_AUTOPLAY !== "true"
              )
              changeAutoPlayStatus(
                JSON.parse(window.localStorage.NLP_ANNOTATOR_AUTOPLAY)
              )
            }}
          />
        </span>
      </div>
      <div style={{ padding: 10 }}>
        <EditableDocument
          phraseBank={phraseBank}
          validator={validator}
          onChange={onChange}
          initialText={initialTranscriptionText}
        />
      </div>
    </div>
  )
}
