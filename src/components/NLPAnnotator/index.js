// @flow

import React, { useState } from "react"

import type { NLPAnnotatorProps } from "../../types"
import SequenceAnnotator from "../SequenceAnnotator"
import DocumentLabeler from "../DocumentLabeler"
import Transcriber from "../Transcriber"
import colors from "../../colors"

const getInitialSequence = (doc: string) => {
  doc.match
}

export default function NLPAnnotator(props: NLPAnnotatorProps) {
  if (props.labels && (props: any).labels.some(l => !l.color)) {
    props = ({
      ...props,
      labels: (props: any).labels.map((l, i) => ({
        color: colors[i % colors.length],
        ...l
      }))
    }: any)
  }
  if (props.type === "label-sequence") {
    return <SequenceAnnotator {...props} />
  }
  if (props.type === "label-document") {
    return <DocumentLabeler {...props} />
  }
  if (props.type === "transcribe") {
    return <Transcriber {...props} />
  }
  return null
}
