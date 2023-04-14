// @flow

import React, { useEffect, useState } from "react"
import { makeStyles } from "@mui/styles"
import { parse as queryString } from "query-string"
import Button from "@mui/material/Button"
import axios from "axios"
import NLPAnnotator from "../NLPAnnotator"
import set from "lodash/set"
import cloneDeep from "lodash/cloneDeep"
import download from "downloadjs"

const useStyles = makeStyles({
  header: {
    display: "flex",
    padding: 10,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    borderBottom: "1px solid #ccc"
  },
  button: {
    marginLeft: 10,
    marginRight: 10
  },
  content: {
    padding: 10
  },
  warning: {
    fontSize: 11,
    color: "#f00",
    padding: 10,
    textAlign: "center"
  }
})

export default () => {
  const c = useStyles()
  const [samples, changeSamples] = useState([])
  const [sampleIndex, changeSampleIndex] = useState(0)
  const [{ loadUrl, outputName = "dataset" }, changeMetaInfo] = useState({})
  useEffect(() => {
    async function loadData() {
      const { load_url: loadUrl, output_name: outputName } =
        queryString(window.location.search) || {}

      changeMetaInfo({ loadUrl, outputName })

      if (loadUrl) {
        const { data } = await axios.get(loadUrl)
        changeSamples(data)
      }
    }
    loadData()
    return () => {}
  }, [])

  return (
    <div>
      <div className={c.header}>
        <div>
          <div>
            Sample #{sampleIndex + 1} / {samples.length}
          </div>
          <div>
            <form method="GET">
              <input name="load_url" defaultValue={loadUrl} />
              <button>load</button>
            </form>
          </div>
        </div>
        <div style={{ flexGrow: 1 }} />
        <Button
          className={c.button}
          onClick={() => {
            // TODO
            download(
              JSON.stringify(samples),
              outputName + ".json",
              "application/json"
            )
          }}
        >
          Download
        </Button>
        <Button
          className={c.button}
          onClick={() =>
            changeSampleIndex(
              (sampleIndex - 1 + samples.length) % samples.length
            )
          }
        >
          Prev Sample
        </Button>
        <Button
          className={c.button}
          variant="outlined"
          onClick={() => changeSampleIndex((sampleIndex + 1) % samples.length)}
        >
          Next Sample (enter)
        </Button>
      </div>
      <div className={c.warning}>
        This page will not save your progress on refresh.
      </div>
      {!loadUrl && <div className={c.warning}>load_url must be specified</div>}
      {samples.length > 0 && (
        <div className={c.content}>
          <NLPAnnotator
            key={sampleIndex}
            {...samples[sampleIndex]}
            onChange={answer => {
              const { type, multiple } = samples[sampleIndex]
              const prop =
                type === "label-document" && multiple
                  ? "initialLabels"
                  : type === "label-document" && !multiple
                  ? "initialLabel"
                  : type === "label-sequence"
                  ? "initialSequence"
                  : type === "transcribe"
                  ? "initialTranscriptionText"
                  : null
              console.log(set(cloneDeep(samples), [sampleIndex, prop], answer))
              changeSamples(
                set(cloneDeep(samples), [sampleIndex, prop], answer)
              )
            }}
          />
        </div>
      )}
    </div>
  )
}
