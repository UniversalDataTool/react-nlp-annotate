// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Transcriber from "./"

storiesOf("Transcriber", module).add("Basic", () => (
  <Transcriber
    type="transcribe"
    audio="https://html5tutorial.info/media/vincent.mp3"
    initialTranscriptionText="Lorem ipsum dolor."
  />
))
