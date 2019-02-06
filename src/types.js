// @flow

type LabelId = string

export type SequenceItem = { text: string, label?: LabelId, color?: string }

export type Props =
  | {
      type: "label-document" | "label-sequence",
      labels?: Array<{
        parent?: string,
        displayName?: string,
        color?: string,
        id: string
      }>,
      document: string
    }
  | {
      type: "transcribe",
      audio: string,
      initialTranscriptionText?: string
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
