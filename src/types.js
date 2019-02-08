// @flow

type LabelId = string

export type SequenceItem = { text: string, label?: LabelId, color?: string }
export type Label = {
  parent?: string,
  displayName?: string,
  color: string,
  id: string
}

export type LabelDocumentProps = {
  type: "label-document",
  labels: Array<Label>,
  document: string
}

export type SequenceAnnotatorProps = {
  type: "label-sequence",
  labels: Array<Label>,
  document: string
}

export type TranscriberProps = {
  type: "transcribe",
  audio: string,
  initialTranscriptionText?: string
}

export type NLPAnnotatorProps = SequenceAnnotatorProps | TranscriberProps

export type Output =
  | {
      outputType: "label-document",
      document: string,
      labels: Array<LabelId>
    }
  | {
      outputType: "label-sequence",
      document: string,
      sequence: Array<SequenceItem>
    }
  | {
      outputType: "transcribe",
      audio: string,
      initialTranscriptionText?: string,
      transcription: string
    }
