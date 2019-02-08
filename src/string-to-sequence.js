// @flow

const stringToSequence = (doc: string) => {
  const sepRe = /[a-zA-Z]+/g
  let m
  let indices = []
  do {
    m = sepRe.exec(doc)
    if (m) {
      indices.push(m.index)
      indices.push(m.index + m[0].length)
    }
  } while (m)
  indices = indices.concat([doc.length])
  return indices
    .slice(0, -1)
    .filter((_, i) => indices[i] !== indices[i + 1])
    .map((_, i) => ({
      text: doc.slice(indices[i], indices[i + 1])
    }))
}

export default stringToSequence
