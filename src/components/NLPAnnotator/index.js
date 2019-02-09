// @flow

import React, { useState } from "react"

import type { NLPAnnotatorProps } from "../../types"
import SequenceAnnotator from "../SequenceAnnotator"

const getInitialSequence = (doc: string) => {
  doc.match
}

export default function NLPAnnotator(props: NLPAnnotatorProps) {
  if (props.type === "label-sequence") {
    return <SequenceAnnotator {...props} />
  }
  return null
}
