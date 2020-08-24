// @flow

const mergeSequence = (
  seq: Array<{ text: string, label?: string, color?: string }>
) => {
  const newSeq = []
  let current = [seq[0]]
  for (let i = 1; i < seq.length; i++) {
    if (current[0].label === seq[i].label) {
      current.push(seq[i])
    } else {
      newSeq.push({
        label: current[0].label,
        text: current.reduce((acc, c) => acc + c.text, ""),
        textId: current[0].textId
      })
      current = [seq[i]]
    }
  }
  newSeq.push({
    label: current[0].label,
    text: current.reduce((acc, c) => acc + c.text, ""),
    textId: current[0].textId
  })
  return newSeq
}

export default mergeSequence
