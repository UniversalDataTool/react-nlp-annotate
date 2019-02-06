// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import LabelButton from "./"

storiesOf("LabelButton", module).add("Basic", () => <LabelButton />)
