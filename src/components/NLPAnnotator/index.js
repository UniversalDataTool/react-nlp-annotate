// @flow

import React, { useState, useLayoutEffect } from "react"

import type { NLPAnnotatorProps } from "../../types"
import SequenceAnnotator from "../SequenceAnnotator"
import DocumentLabeler from "../DocumentLabeler"
import Transcriber from "../Transcriber"
import colors from "../../colors"
import { green } from "@material-ui/core/colors"
import makeStyles from "@material-ui/styles/makeStyles"
import Container from "../Container"
import Button from "@material-ui/core/Button"

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

export default function NLPAnnotator(props: NLPAnnotatorProps) {
  const classes = useStyles()
  let [output, changeOutput] = useState(null)

  useLayoutEffect(() => {
    const eventFunc = e => {
      if (e.key === "Enter") {
        if (props.onFinish) props.onFinish(output)
      }
    }
    window.addEventListener("keydown", eventFunc)
    return () => {
      window.removeEventListener("keydown", eventFunc)
    }
  })

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
    if (output === null && props.type === "transcribe") {
      output = props.initialTranscriptionText
    }
    if (output === null && props.type === "label-sequence") {
      output = [{ text: props.document }]
    }
    finishButton = (
      <Button
        disabled={
          props.validator &&
          (props: any)
            .validator(output)
            .some(msg => msg.toLowerCase().includes("error:"))
        }
        onClick={() => {
          props.onFinish(output)
        }}
        className={classes.finishButton}
      >
        Complete (enter)
      </Button>
    )
  }
  if (props.type === "label-sequence") {
    return (
      <Container>
        <SequenceAnnotator {...props} onChange={onChange} />
        <div style={{ textAlign: "right" }}>{finishButton}</div>
      </Container>
    )
  }
  if (props.type === "label-document") {
    return (
      <Container>
        <DocumentLabeler {...props} onChange={onChange} />
        <div style={{ textAlign: "right" }}>{finishButton}</div>
      </Container>
    )
  }
  if (props.type === "transcribe") {
    return (
      <Container>
        <Transcriber {...props} onChange={onChange} />
        <div style={{ textAlign: "right" }}>{finishButton}</div>
      </Container>
    )
  }
  return null
}
