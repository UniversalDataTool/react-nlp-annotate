// @flow

import React, { useState } from "react"
import Button from "@mui/material/Button"
import { makeStyles } from "@mui/styles"
import Select from "react-select"
import Code from "react-syntax-highlighter"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import MonacoEditor from "react-monaco-editor"

const useStyles = makeStyles({
  editBar: {
    padding: 10,
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    "& .button": { margin: 5 }
  },
  select: { width: 240, fontSize: 14 },
  contentArea: {
    padding: 10
  },
  specificationArea: {
    padding: 10
  }
})

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("nlpCustomInput") || "{}")
  } catch (e) {
    return {}
  }
}

export const examples = {
  SimpleLabelSequence: () => ({
    type: "label-sequence",
    document: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra ipsum tristique ligula venenatis placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce mollis velit nec tellus sollicitudin aliquam. In velit erat, iaculis id consectetur et, tincidunt sit amet mauris. Quisque ultricies, purus eleifend congue malesuada, ipsum erat molestie dolor, in pellentesque lacus purus vel nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sed vestibulum magna. Quisque ut lorem imperdiet, aliquam velit nec, dictum felis.`,
    labels: [
      {
        id: "noun",
        displayName: "Noun"
      },
      {
        id: "proper-noun",
        displayName: "Proper Noun"
      }
    ]
  }),
  SimpleLabelDocument: () => ({
    type: "label-document",
    document: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra ipsum tristique ligula venenatis placerat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce mollis velit nec tellus sollicitudin aliquam. In velit erat, iaculis id consectetur et, tincidunt sit amet mauris. Quisque ultricies, purus eleifend congue malesuada, ipsum erat molestie dolor, in pellentesque lacus purus vel nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sed vestibulum magna. Quisque ut lorem imperdiet, aliquam velit nec, dictum felis.`,
    labels: [
      {
        id: "latin",
        displayName: "Latin"
      },
      {
        id: "english",
        displayName: "English"
      },
      {
        id: "german",
        displayName: "German"
      }
    ]
  }),
  Custom: () => loadSavedInput()
}

const Editor = ({
  initialAnnotatorProps,
  onOpenAnnotator,
  lastOutput
}: any) => {
  const c = useStyles()
  const [currentError, changeCurrentError] = useState()
  const [selectedExample, changeSelectedExample] = useState(
    window.localStorage.getItem("nlpCustomInput")
      ? "Custom"
      : "SimpleLabelSequence"
  )
  const [outputDialogOpen, changeOutputOpen] = useState(lastOutput)
  const [currentJSONValue, changeCurrentJSONValue] = useState(
    initialAnnotatorProps
      ? JSON.stringify(initialAnnotatorProps, null, "  ")
      : JSON.stringify(examples[selectedExample](), null, "  ")
  )
  return (
    <div>
      <div className={c.editBar}>
        <h3>React NLP Annotate</h3>
        <div style={{ flexGrow: 1 }} />
        <div>
          <div style={{ display: "inline-flex" }}>
            <Select
              className={c.select}
              value={{ label: selectedExample, value: selectedExample }}
              options={Object.keys(examples).map(s => ({
                label: s,
                value: s
              }))}
              onChange={selectedOption => {
                changeSelectedExample(selectedOption.value)

                changeCurrentJSONValue(
                  JSON.stringify(
                    selectedOption.value === "Custom"
                      ? loadSavedInput()
                      : examples[selectedOption.value](),
                    null,
                    "  "
                  )
                )
              }}
            />
          </div>
          <Button
            className="button"
            disabled={!lastOutput}
            onClick={() => changeOutputOpen(true)}
          >
            View Output
          </Button>
          <Button
            className="button"
            variant="outlined"
            disabled={Boolean(currentError)}
            onClick={() =>
              onOpenAnnotator(
                selectedExample === "Custom"
                  ? JSON.parse(currentJSONValue)
                  : examples[selectedExample]()
              )
            }
          >
            Open Annotator
          </Button>
        </div>
      </div>
      <div
        className={c.contentArea}
        style={
          currentError
            ? { border: "2px solid #f00" }
            : { border: "2px solid #fff" }
        }
      >
        <div>
          <MonacoEditor
            value={currentJSONValue}
            language="javascript"
            onChange={code => {
              try {
                window.localStorage.setItem(
                  "nlpCustomInput",
                  JSON.stringify(JSON.parse(code))
                )
                changeCurrentError(null)
              } catch (e) {
                changeCurrentError(e.toString())
              }
              changeCurrentJSONValue(code)
            }}
            width="100%"
            height="550px"
          />
        </div>
      </div>
      <div className={c.specificationArea}>
        <h2>React NLP Annotate Format</h2>
        <Code language="javascript">{`
// There are several types of annotators you can use...

export type LabelDocumentProps = {
  type: "label-document",
  labels: Array<Label>,
  multipleLabels?: boolean,
  initialLabels?: Array<string>,
  document: string,
  onChange: (Array<string> | string | null) => any
}

export type SequenceAnnotatorProps = {
  type: "label-sequence",
  labels: Array<Label>,
  initialSequence?: Array<SequenceItem>,
  document: string,
  onChange: (sequence: Array<SequenceItem>) => any
}

export type TranscriberProps = {
  type: "transcribe",
  audio: string,
  phraseBank?: Array<string>,
  validator?: string => Array<string>,
  initialTranscriptionText?: string,
  onChange: string => any
}

export type NLPAnnotatorProps = {
  ...
    | $Exact<SequenceAnnotatorProps>
    | $Exact<LabelDocumentProps>
    | $Exact<TranscriberProps>,
  onFinish?: string,
  onChange?: string
}
`}</Code>
      </div>
      <Dialog fullScreen open={outputDialogOpen}>
        <DialogTitle>React NLP Annotate Output</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <MonacoEditor
            value={JSON.stringify(lastOutput, null, "  ")}
            language="javascript"
            width="100%"
            height="550px"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeOutputOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Editor
