// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Transcriber from "./"

const externalWordBank =
  "https://s3.amazonaws.com/jobstorage.workaround.online/phrase-banks/Belize_FrequentListings_Transcription+-+FrequentListings.csv"

storiesOf("Transcriber", module)
  .add("Basic", () => (
    <Transcriber
      onChange={action("onChange")}
      type="transcribe"
      audio="https://html5tutorial.info/media/vincent.mp3"
      initialTranscriptionText="Lorem ipsum dolor."
    />
  ))
  .add("Validator & Phrase Bank", () => (
    <Transcriber
      onChange={action("onChange")}
      type="transcribe"
      audio="https://html5tutorial.info/media/vincent.mp3"
      phraseBank={["[unintelligible]", "san ignacio"]}
      validator={s => {
        const errors = []
        if (s !== s.toLowerCase())
          errors.push("Error: The entire transcription should be lower case")
        if (s.length < 10)
          errors.push("Error: The transcription should be longer")
        if (s.match(/[\(\),'"]/g))
          errors.push(
            "Warning: The transcription should not include any punctuation except [ or ], and stop letters (a. b. c.)."
          )
        if (s.includes("[unintelligible]"))
          errors.push(
            "Warning: Use [unintelligible] only when the words absolutely cannot be understood. Most of the time you should remove [unintelligible] and take your best guess!"
          )
        return errors
      }}
      initialTranscriptionText="Lorem ipsum dolor."
    />
  ))
  .add("External Phrase Bank", () => (
    <Transcriber
      onChange={action("onChange")}
      type="transcribe"
      audio="https://html5tutorial.info/media/vincent.mp3"
      phraseBank={externalWordBank}
      validator={s => {
        const errors = []
        if (s !== s.toLowerCase())
          errors.push("Error: The entire transcription should be lower case")
        if (s.length < 10)
          errors.push("Error: The transcription should be longer")
        if (s.match(/[\(\),'"]/g))
          errors.push(
            "Warning: The transcription should not include any punctuation except [ or ], and stop letters (a. b. c.)."
          )
        if (s.includes("[unintelligible]"))
          errors.push(
            "Warning: Use [unintelligible] only when the words absolutely cannot be understood. Most of the time you should remove [unintelligible] and take your best guess!"
          )
        return errors
      }}
      initialTranscriptionText="Lorem ipsum dolor."
    />
  ))
