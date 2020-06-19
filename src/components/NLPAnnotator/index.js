// @flow

import React, { useState, useEffect, useMemo } from "react"

import type { NLPAnnotatorProps } from "../../types"
import SequenceAnnotator from "../SequenceAnnotator"
import DocumentLabeler from "../DocumentLabeler"
import Transcriber from "../Transcriber"
import colors from "../../colors"
import Container from "../Container"
import useEventCallback from "use-event-callback"

const defaultValidator = () => []

export default function NLPAnnotator(props: NLPAnnotatorProps) {
  const validator = props.validator || defaultValidator
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
  }, [props.onFinish, output])

  const onChange = (newOutput: any) => {
    if (props.onChange) props.onChange(newOutput)
    changeOutput(newOutput)
  }

  let labels = useMemo(() => {
    let labels = props.labels || []
    if (!labels.some(l => !l.color)) {
      labels = labels.map((l, i) => ({
        ...l,
        color: colors[i % colors.length]
      }))
    }
    return labels
  }, [props.labels])

  const isPassingValidation = !validator(output).some(msg =>
    msg.toLowerCase().includes("error")
  )

  console.log({ output })
  const onFinish = useEventCallback(() => {
    if (!isPassingValidation) return
    console.log("onFinish", output)
    props.onFinish(output)
  })

  const onClickHeaderItem = useEventCallback(({ name }) => {
    switch (name) {
      case "Done":
        onFinish(output)
        return
      default:
        return
    }
  })

  let annotator
  switch (props.type) {
    case "label-sequence":
      annotator = (
        <SequenceAnnotator {...props} labels={labels} onChange={onChange} />
      )
      break
    case "label-document":
      annotator = (
        <DocumentLabeler {...props} labels={labels} onChange={onChange} />
      )
      break
    case "transcribe":
      annotator = <Transcriber {...props} onChange={onChange} />
      break
    default:
      annotator = null
  }

  return (
    <Container
      titleContent={props.titleContent}
      onNext={props.onNext}
      onPrev={props.onPrev}
      onClickHeaderItem={onClickHeaderItem}
    >
      <div>{annotator}</div>
    </Container>
  )
}
