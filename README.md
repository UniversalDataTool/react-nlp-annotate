  # React NLP Annotate

Interface for doing NLP tasks. [Check it out here](https://waoai.github.io/react-nlp-annotate/).

- Audio transcription
- Text Labeling (Entity, Classification)

## Installation

`npm install @material-ui/core chroma-js spelling react-nlp-annotate`

## Usage

```javascript
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"

const MyComponent = () => (
  <NLPAnnotator
    type="label-document"
    labels={[
      {
        "id": "gryffindor",
        "displayName": "Gryffindor",
        "description": "Daring, strong nerve and chivalry."
      },
      {
        "id": "slytherin",
        "displayName": "Slytherin",
        "description": "Cunning and ambitious. Possibly dark wizard."
      }
    ]}
    multipleLabels={false}
    document="Harry"
    onChange={(classification) => {
      console.log("Harry is a " + classification)
    }}
  />
)
```
