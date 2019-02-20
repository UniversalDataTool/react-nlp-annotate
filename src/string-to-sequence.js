// @flow

const stringToSequence = (doc: string) => {
  const sepRe = /[a-zA-Z]+/g
  let m
  let indices = [0]
  do {
    m = sepRe.exec(doc)
    if (m) {
      indices.push(m.index)
      indices.push(m.index + m[0].length)
    }
  } while (m)
  indices = indices.concat([doc.length])
  return indices
    .filter((_, i) => indices[i] !== indices[i + 1])
    .map((_, i) => ({
      text: doc.slice(indices[i], indices[i + 1])
    }))
    .filter(s => s.text.length > 0)
}

export default stringToSequence
