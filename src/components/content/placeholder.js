// Neutral lorem-ipsum filler. The spec records only structure / word counts for conversation
// transcripts, summaries and legal prose, so body copy is plainly placeholder text.
const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore ' +
  'magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
  'consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur ' +
  'excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'
).split(' ')

// Deterministic: same (count, seed) -> same text, so renders are stable.
export function lorem(count, seed = 0) {
  if (count <= 0) return ''
  const out = []
  for (let i = 0; i < count; i++) out.push(WORDS[(seed * 7 + i) % WORDS.length])
  const s = out.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

// Continues an existing sentence opening with filler up to `count` total words.
export function continueWith(opening, count, seed = 0) {
  const have = opening.trim().split(/\s+/).length
  const rest = lorem(Math.max(count - have, 0), seed)
  return rest ? `${opening} ${rest.charAt(0).toLowerCase()}${rest.slice(1)}` : opening
}
