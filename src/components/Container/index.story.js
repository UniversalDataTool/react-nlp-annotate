// @flow

import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Container from "./"

storiesOf("Container", module).add("Basic", () => (
  <Container onClickHeaderItem={action("onClickHeaderItem")}>
    Some inner content
  </Container>
))
