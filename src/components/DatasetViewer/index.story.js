// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DatasetViewer from "./"

storiesOf("DatasetViewer", module).add("Basic", () => <DatasetViewer />)
