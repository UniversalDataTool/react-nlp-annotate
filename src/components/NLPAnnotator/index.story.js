// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import NLPAnnotator from "./"

storiesOf("NLPAnnotator", module).add("Basic", () => <NLPAnnotator />)
