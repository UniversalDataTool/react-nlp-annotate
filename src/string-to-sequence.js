// @flow

const stringToSequence = (doc: string, sepRe: RegExp = /[a-zA-ZÀ-ÿ]+/g) => {
  if (typeof sepRe === "string") {
    sepRe = new RegExp(sepRe)
  }
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
