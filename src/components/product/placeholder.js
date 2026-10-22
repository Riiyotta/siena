// Length-matched placeholder copy. Used for third-party customer quotes that are not already in
// src/components/testimonials/data.js (per task brief); names, roles and logos stay real.
const WORDS = (
  'placeholder testimonial copy stands in for the customer quote that appears on the live page and keeps ' +
  'the same approximate length so the layout wraps to a comparable number of lines while the final ' +
  'approved wording is sourced from the customer and the marketing team before launch'
).split(' ')

export function ph(chars) {
  let out = ''
  let i = 0
  while (out.length < chars) {
    out += (out ? ' ' : '') + WORDS[i % WORDS.length]
    i++
  }
  return out.charAt(0).toUpperCase() + out.slice(1) + '.'
}
