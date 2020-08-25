// @flow

type ReactNode = any
type LabelId = string
type TextId = string

export type SequenceItem = {
  text: string,
  label?: LabelId,
  color?: string,
  textId?: TextId
}
export type Label = {
  parent?: string,
  displayName?: string,
  description?: string,
  color: string,
  id: string
}

export type Relationship = {
  from: TextId,
  to: TextId,
  label: LabelId,
  color?: string
}

export type LabelDocumentProps = {
  type: "label-document",
  hotkeysEnabled?: boolean,
  labels: Array<Label>,
  multipleLabels?: boolean,
  document: string,
  initialLabels?: Array<string>,
  onChange: (Array<string> | string | null) => any
}

export type SequenceAnnotatorProps = {
  type: "label-sequence",
  hotkeysEnabled?: boolean,
  separatorRegex?: RegExp,
  labels: Array<Label>,
  initialSequence?: Array<SequenceItem>,
  document: string,
  onChange: (sequence: Array<SequenceItem>) => any
}

export type RelationshipAnnotatorProps = {
  type: "label-relationships",
  hotkeysEnabled?: boolean,
  separatorRegex?: RegExp,
  entityLabels?: Array<Label>,
  relationshipLabels?: Array<Label>,
  initialSequence?: Array<SequenceItem>,
  initialRelationships?: Array<Relationship>,
  document: string,
  onChange: ({
    sequence: Array<SequenceItem>,
    relationships: Array<Relationship>
  }) => any
}

export type TranscriberProps = {
  type: "transcribe",
  hotkeysEnabled?: boolean,
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
    | $Exact<TranscriberProps>
    | $Exact<RelationshipAnnotatorProps>,
  onNext?: Function,
  onPrev?: Function,
  titleContent?: string | ReactNode,
  onFinish?: string,
  onChange?: string
}

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
  | {
      outputType: "label-relationships",
      document: string,
      sequence: Array<SequenceItem>,
      relationships: Array<Relationship>
    }
