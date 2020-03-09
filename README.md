  # React NLP Annotate

Interface for doing NLP tasks. [Check it out here](https://waoai.github.io/react-nlp-annotate/).

- Audio transcription
- Text Labeling (Entity, Classification)

![screenshot 1](https://user-images.githubusercontent.com/1910070/76181412-560efc00-6197-11ea-8eba-1f48768f5183.png)

![screenshot 2](https://user-images.githubusercontent.com/1910070/76181462-8d7da880-6197-11ea-908f-96d988a7efc8.png)

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
