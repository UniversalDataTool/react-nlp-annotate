// @flow

import React, { useState, useEffect } from "react"

import type { NLPAnnotatorProps } from "../../types"
import SequenceAnnotator from "../SequenceAnnotator"
import DocumentLabeler from "../DocumentLabeler"
import Transcriber from "../Transcriber"
import colors from "../../colors"
import { green } from "@material-ui/core/colors"
import makeStyles from "@material-ui/styles/makeStyles"
import Container from "../Container"
import Button from "@material-ui/core/Button"
import useEventCallback from "use-event-callback"

const useStyles = makeStyles({
  finishButton: {
    "&&": {
      fontSize: 14,
      textTransform: "none",
      backgroundColor: green[500],
      padding: 10,
      color: "#fff",
      margin: 10,
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: green[700]
      }
    }
  }
})

const defaultValidator = () => []

export default function NLPAnnotator(props: NLPAnnotatorProps) {
  const validator = props.validator || defaultValidator
  const classes = useStyles()
  let [output, changeOutput] = useState(null)

  if (output === null && props.type === "transcribe") {
    output = props.initialTranscriptionText
  }
  if (output === null && props.type === "label-sequence") {
    output = props.initialSequence || [{ text: props.document }]
  }

  useEffect(() => {
    const eventFunc = e => {
      if (e.key === "Enter") {
        if (props.onFinish) props.onFinish(output)
      }
    }
    window.addEventListener("keydown", eventFunc)
    return () => {
      window.removeEventListener("keydown", eventFunc)
    }
  }, [props.onFinish])

  const onChange = (newOutput: any) => {
    if (props.onChange) props.onChange(newOutput)
    changeOutput(newOutput)
  }
  if (props.labels && (props: any).labels.some(l => !l.color)) {
    props = ({
      ...props,
      labels: (props: any).labels.map((l, i) => ({
        color: colors[i % colors.length],
        ...l
      }))
    }: any)
  }
  let finishButton = null
  if (props.onFinish) {
    finishButton = (
      <Button
        disabled={validator(output).some(msg =>
          msg.toLowerCase().includes("error:")
        )}
        onClick={() => {
          props.onFinish(output)
        }}
        className={classes.finishButton}
      >
        Complete (enter)
      </Button>
    )
  }

  const isPassingValidation = validator(output).some(msg =>
    msg.toLowerCase().includes("error")
  )

  const onFinish = useEventCallback(() => {
    if (!isPassingValidation) return
    props.onFinish(output)
  })

  let annotator = null
  switch (props.type) {
    case "label-sequence":
      annotator = <SequenceAnnotator {...props} onChange={onChange} />
      break
    case "label-document":
      annotator = <DocumentLabeler {...props} onChange={onChange} />
      break
    case "transcribe":
      annotator = <Transcriber {...props} onChange={onChange} />
      break
  }

  return <Container>{annotator}</Container>
}
