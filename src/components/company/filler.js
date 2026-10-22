// Length-matched placeholder copy for third-party testimonial quotes and long prose
// (build instructions: don't copy long-form text verbatim; match length so layout heights hold).
const WORDS = 'placeholder testimonial copy describing how the team works with siena day to day and the results they see across support conversations automation quality and customer satisfaction over time'.split(' ')

export function filler(length, seed = 0) {
  let out = 'Placeholder quote:'
  let i = seed % WORDS.length
  while (out.length < length) {
    out += ' ' + WORDS[i % WORDS.length]
    i += 1
  }
  return out + '.'
}
