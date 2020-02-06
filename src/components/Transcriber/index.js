// @flow

import React, { useState, useEffect } from "react"
import EditableDocument from "../EditableDocument"
import type { TranscriberProps } from "../../types"

export default ({
  initialTranscriptionText,
  onChange,
  audio,
  lowerCaseMode,
  phraseBank: phraseBankParam,
  validator
}: TranscriberProps) => {
  const [autoPlayStatus, changeAutoPlayStatus] = useState(
    window.localStorage.NLP_ANNOTATOR_AUTOPLAY === "true"
  )
  // TODO create hook for usePhraseBank
  const [phraseBank, changePhraseBank] = useState(undefined)
  useEffect(() => {
    async function loadPhraseBank() {
      if (typeof phraseBankParam === "string") {
        phraseBankParam = [phraseBankParam]
      }
      if (
        Array.isArray(phraseBankParam) &&
        phraseBankParam.every(
          p =>
            p.startsWith("http") && (p.endsWith(".txt") || p.endsWith(".csv"))
        )
      ) {
        let fullPhraseBank = []
        for (const url of phraseBankParam) {
          let found
          const saveName = `NLP_ANNOTATOR_PHRASE_BANK_${url}`
          if (window.localStorage[saveName]) {
            try {
              fullPhraseBank.push(...JSON.parse(window.localStorage[saveName]))
              found = true
            } catch (e) {}
          }
          if (!found) {
            const urlPhrases = (await fetch(url).then(res => res.text())).split(
              "\n"
            )
            window.localStorage[saveName] = JSON.stringify(urlPhrases)
            fullPhraseBank.push(...urlPhrases)
          }
        }
        if (lowerCaseMode) {
          fullPhraseBank = fullPhraseBank.map(a => a.toLowerCase())
        }
        changePhraseBank(fullPhraseBank)
      } else if (Array.isArray(phraseBankParam)) {
        changePhraseBank(phraseBankParam)
      }
    }
    loadPhraseBank()
    return () => {}
  }, [phraseBankParam])

  return (
    <div>
      <div style={{ textAlign: "center", padding: 10 }}>
        <audio
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
