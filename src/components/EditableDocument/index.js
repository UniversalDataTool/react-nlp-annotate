// @flow

import React, { useState } from "react"
import CreatableSelect from "react-select/async-creatable"
import Spelling from "spelling"
import enDictionary from "spelling/dictionaries/en_US"
import chroma from "chroma-js"
import { green, yellow, red } from "@mui/material/colors"

const spellChecker = new Spelling(enDictionary)

const components = {}
const createOption = (label, color) => ({
  label,
  value: label + Math.random().toString(),
  color
})

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color || yellow[700])
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : color.alpha(0.05).css(),
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : color
            .darken()
            .darken()
            .css(),
      cursor: isDisabled ? "not-allowed" : "default"
    }
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: chroma(data.color)
      .darken()
      .darken()
      .css()
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: chroma(data.color)
      .darken()
      .darken()
      .css(),
    ":hover": {
      backgroundColor: data.color,
      color: "white"
    }
  })
}

export default function EditableDocument({
  initialText = "",
  onChange,
  lowerCaseMode = false,
  phraseBank = [],
  validator = () => []
}: {
  initialText?: string,
  validator?: string => Array<string>,
  onChange: string => any,
  phraseBank?: Array<string>,
  lowerCaseMode?: boolean
}) {
  const [inputValue, changeInputValue] = useState()
  const [value, changeValue] = useState(
    initialText
      ? [{ value: initialText, label: initialText, color: green[500] }]
      : []
  )
  const [validationErrors, changeValidationErrors] = useState([])

  const handleChange = v => {
    if (!v) v = []
    changeValue(v)
    const result = v
      .map(l => l.label.trim())
      .join(" ")
      .trim()
    try {
      changeValidationErrors(validator(result))
    } catch (e) {
      changeValidationErrors(["Error: Validator had error: " + e.toString()])
    }
    onChange(result)
  }
  const isInDictionary = text => {
    if (lowerCaseMode) text = text.trim().toLowerCase()
    const scRes = spellChecker.lookup(text)
    if (scRes.found || phraseBank.includes(text)) return true
    return false
  }

  const handleInputChange = v => changeInputValue(v)
  const handleKeyDown = ({ key }) => {
    if (!inputValue) return
    if (key === "Enter" || key === "Tab") {
      changeValue([
        ...(value || []),
        createOption(inputValue.trim(), yellow[700])
      ])
      changeInputValue("")
    } else if (key === " " && isInDictionary(inputValue.trim())) {
      changeValue([
        ...(value || []),
        createOption(inputValue.trim(), green[500])
      ])
      changeInputValue("")
    } else if (
      key === " " &&
      isInDictionary(inputValue.split(" ").slice(-1)[0])
    ) {
      changeValue([
        ...(value || []),
        createOption(
          inputValue
            .split(" ")
            .slice(0, -1)
            .join(" ")
            .trim(),
          yellow[700]
        ),
        createOption(inputValue.split(" ").slice(-1)[0], green[700])
      ])
      changeInputValue("")
    }
  }

  const loadOptions = async text => {
    let bestOption
    if (lowerCaseMode) text = text.toLowerCase()
    const scRes = spellChecker.lookup(text)
    if (scRes.found || phraseBank.includes(text))
      return [createOption(text, green[500])]

    const possiblePhrases = phraseBank.filter(p => p.startsWith(text))
    return [bestOption || createOption(text, yellow[700])]
      .concat(
        possiblePhrases
          .filter(p => p !== text)
          .map(p => createOption(p, green[500]))
      )
      .concat(
        scRes.suggestions
          .slice(0, 6)
          .map(({ word }) => createOption(word, green[500]))
      )
  }

  return (
    <div style={{ fontSize: 18 }}>
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Begin writing..."
        loadOptions={loadOptions}
        value={value}
        styles={colourStyles}
      />
      <div
        style={{
          fontSize: 14,
          height: 100,
          marginTop: 8,
          borderRadius: 2,
          padding: 8
        }}
      >
        {validationErrors.map(v => (
          <div
            style={{
              marginTop: 8,
              color: v.toLowerCase().includes("error:") ? red[800] : yellow[800]
            }}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}
