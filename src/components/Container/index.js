// @flow

import React, { useMemo } from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Workspace from "react-material-workspace-layout/Workspace"

export default ({
  children,
  currentSampleIndex = 0,
  numberOfSamples = 1,
  titleContent,
  onClickHeaderItem
}: any) => {
  const headerItems = useMemo(
    () =>
      [
        currentSampleIndex > 0 && { name: "Prev" },
        numberOfSamples > currentSampleIndex + 1 && { name: "Next" },
        { name: "Done" }
      ].filter(Boolean),
    [currentSampleIndex, numberOfSamples]
  )
  return (
    <Workspace
      headerLeftSide={
        titleContent === undefined ? (
          <Box paddingLeft={2} fontWeight="bold">
            <Typography>
              Sample {currentSampleIndex + 1} / {numberOfSamples}
            </Typography>
          </Box>
        ) : (
          titleContent
        )
      }
      onClickHeaderItem={onClickHeaderItem}
      headerItems={headerItems}
      iconSidebarItems={[]}
      rightSidebarItems={[]}
    >
      <Box padding={2}>{children}</Box>
    </Workspace>
  )
}
