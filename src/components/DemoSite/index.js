// @flow
import React, { useState } from "react"
import ReactDOM from "react-dom"
import Editor, { examples } from "./Editor"
import NLPAnnotator from "../NLPAnnotator"
import ErrorBoundaryDialog from "./ErrorBoundaryDialog.js"
import { parse as queryString } from "query-string"

function getInitialAnnotatorProps() {
  const { load } = queryString(window.location.search) || {}

  if (load) {
    try {
      return JSON.parse(window.atob(load))
    } catch (e) {
      console.error("Problem loading from load get parameter. Error parsing.")
    }
  }

  return examples["Custom"]()
}

export default () => {
  const [annotatorOpen, changeAnnotatorOpen] = useState(false)
  const [annotatorProps, changeAnnotatorProps] = useState(
    getInitialAnnotatorProps()
  )
  console.log({ annotatorProps })
  const [lastOutput, changeLastOutput] = useState()

  return (
    <div>
      {annotatorOpen ? (
        <ErrorBoundaryDialog
          onClose={() => {
            changeAnnotatorOpen(false)
          }}
        >
          <NLPAnnotator
            {...(annotatorProps: any)}
            onFinish={output => {
              changeLastOutput(output)
              changeAnnotatorOpen(false)
            }}
          />
        </ErrorBoundaryDialog>
      ) : (
        <Editor
          initialAnnotatorProps={annotatorProps}
          lastOutput={lastOutput}
          onOpenAnnotator={props => {
            window.history.pushState(
              window.document.title,
              window.document.title,
              window.location.origin +
                window.location.pathname +
                "?load=" +
                window.btoa(JSON.stringify(props, null, "  "))
            )
            changeAnnotatorProps(props)
            changeAnnotatorOpen(true)
          }}
        />
      )}
    </div>
  )
}
