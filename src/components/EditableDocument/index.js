// @flow

import React from "react"

export default function EditableDocument({
  initialText = "",
  onChange
}: {
  initialText?: string,
  onChange: string => any
}) {
  return (
    <div>
      <textarea
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: 300,
          fontSize: 18,
          padding: 16,
          color: "#666",
          boxSizing: "border-box"
        }}
        defaultValue={initialText}
      />
    </div>
  )
}
