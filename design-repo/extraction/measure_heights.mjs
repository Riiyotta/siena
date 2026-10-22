#!/usr/bin/env node
/**
 * Measure real rendered section heights of the clone at 1440px and (re)write the
 * `sectionHeights` block of extraction/measured-values.json.
 *
 * This is an EVIDENCE tool, not a verifier: it needs the built clone served over HTTP and a
 * Playwright install, neither of which ships with design-repo/. extraction/wrapper_gate.py
 * is the verifier; it only reads the numbers this script recorded (and degrades to checking
 * the recorded numbers when no clone is beside the repo).
 *
 *   # from the clone project root (parent of design-repo/):
 *   npm ci && npx vite build --outDir <scratch-dir> && npx vite preview --outDir <scratch-dir> --port 5474
 *   PLAYWRIGHT_MODULE=<path-or-name of the playwright entry> \
 *     node design-repo/extraction/measure_heights.mjs --base http://localhost:5474
 *   node design-repo/extraction/measure_heights.mjs --dump-blocks [--routes /a,/b]   # print the leaf blocks per route (to author probes)
 *
 * Input:  extraction/height-probes.json  (route -> ordered template nodes -> leaf block indices)
 * Output: extraction/measured-values.json -> sectionHeights.routes[route].nodes[] with
 *         {section, variant, heightPx, topPx, inFlow, blocks[], h1Count}
 *
 * How a "leaf block" is found (so the numbers are reproducible, not eyeballed): walk <main>;
 * a child that is not itself a <section> but contains one is a wrapper and is recursed into;
 * every other in-flow child is a leaf measured by its own bounding box. Wrappers named in
 * height-probes.json "wrappers" (an article, a legal page, a card index) are PARTITIONED by
 * their children: each child owns the extent from its top to the next child's top, so the
 * wrapper's own padding is attributed to the first/last part instead of being lost.
 * Optional per-route "splits" ({inside, boundaries:[{selector,textRegex?}], mergePreamble?}) cut
 * one long leaf at real content boundaries (chapter H2s, numbered legal headings).
 * Fixed/absolute/display:none leaves have no in-flow height.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const MV = join(HERE, 'measured-values.json')
const PROBES = join(HERE, 'height-probes.json')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d }
const BASE = arg('--base', 'http://localhost:5474')
const DUMP = process.argv.includes('--dump-blocks')
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const probes = JSON.parse(readFileSync(PROBES, 'utf8'))
const routes = DUMP && arg('--routes') ? arg('--routes').split(',') : Object.keys(probes.routes)

// Executed inside the page. Returns {docHeight, leaves[], footer, h1s[]}.
function inPage({ wrappers, splits }) {
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).filter((c) => !/[\[\]:/]/.test(c)).slice(0, 2).join('.') : '')
  const top = (el) => el.getBoundingClientRect().top + window.scrollY
  const bottom = (el) => el.getBoundingClientRect().bottom + window.scrollY
  const live = (el) => {
    if (['SCRIPT', 'STYLE', 'TEMPLATE'].includes(el.tagName)) return false
    const cs = getComputedStyle(el)
    return cs.display !== 'none' && cs.position !== 'fixed' && cs.position !== 'absolute'
  }
  const text = (el) => (el.innerText || '').replace(/\s+/g, ' ').slice(0, 48)
  const out = []
  const isWrapper = (el) => wrappers.some((w) => el.matches(w))
  function walk(el) {
    for (const c of el.children) {
      if (!live(c)) continue
      if (isWrapper(c)) {
        const kids = [...c.children].filter(live).filter((k) => k.getBoundingClientRect().height > 0)
        kids.forEach((k, i) => {
          const a = i === 0 ? top(c) : top(k)
          const b = i === kids.length - 1 ? bottom(c) : top(kids[i + 1])
          out.push({ el: k, desc: desc(c) + ' > ' + desc(k), top: a, bottom: b, txt: text(k) })
        })
      } else if (c.tagName !== 'SECTION' && c.querySelector('section')) {
        walk(c)
      } else if (c.getBoundingClientRect().height > 0) {
        out.push({ el: c, desc: desc(c), top: top(c), bottom: bottom(c), txt: text(c) })
      }
    }
  }
  const main = document.querySelector('main')
  walk(main)
  let leaves = out
  for (const sp of splits || []) {
    const next = []
    for (const lf of leaves) {
      if (!lf.el.matches(sp.inside)) { next.push(lf); continue }
      const marks = []
      for (const bd of sp.boundaries) {
        const re = bd.textRegex ? new RegExp(bd.textRegex) : null
        for (const m of lf.el.querySelectorAll(bd.selector)) if (!re || re.test(m.textContent.trim())) marks.push(top(m))
      }
      const cuts = [...new Set(marks.map((m) => Math.round(m)))].sort((a, b) => a - b)
      const starts = [lf.top, ...cuts.filter((c) => c > lf.top + 1)]
      if (sp.mergePreamble && cuts.length && cuts[0] - lf.top > 1) starts.splice(1, 1)
      starts.forEach((s, i) => next.push({ el: lf.el, desc: lf.desc + ' ~part' + i, top: s, bottom: i === starts.length - 1 ? lf.bottom : starts[i + 1], txt: lf.txt }))
    }
    leaves = next
  }
  const gf = [...document.querySelectorAll('footer')].find((f) => !main.contains(f))
  const res = leaves.map((l) => ({ desc: l.desc, top: Math.round(l.top), h: Math.round(l.bottom - l.top), txt: l.txt }))
  const gfRes = gf ? { desc: 'footer(global)', top: Math.round(top(gf)), h: Math.round(bottom(gf) - top(gf)), txt: text(gf) } : null
  const h1s = [...document.querySelectorAll('h1')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => Math.round(top(h)))
  return { docHeight: document.documentElement.scrollHeight, leaves: res, footer: gfRes, h1s }
}

const browser = await chromium.launch()
const result = {}
for (const route of routes) {
  const cfg = probes.routes[route] || {}
  const page = await browser.newPage({ viewport: probes.viewport })
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const h0 = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h0; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50) }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)
  result[route] = await page.evaluate(inPage, { wrappers: probes.wrappers, splits: cfg.splits || [] })
  await page.close()
}
await browser.close()

if (DUMP) {
  for (const [route, d] of Object.entries(result)) {
    console.log(`${route}  doc=${d.docHeight}  h1@${JSON.stringify(d.h1s)}`)
    d.leaves.forEach((l, i) => console.log(`  [${i}] top=${l.top} h=${l.h}  ${l.desc.slice(0, 60)} | ${l.txt}`))
    if (d.footer) console.log(`  [footer] top=${d.footer.top} h=${d.footer.h}`)
  }
  process.exit(0)
}

const mv = JSON.parse(readFileSync(MV, 'utf8'))
const outRoutes = {}
for (const route of Object.keys(probes.routes).sort()) {
  const cfg = probes.routes[route]
  const d = result[route]
  const nodes = []
  for (const [section, variant, blocks, opts = {}] of cfg.nodes) {
    const idx = []
    for (const b of blocks) {
      if (typeof b === 'string' && /^\d+-\d+$/.test(b)) { const [a, z] = b.split('-').map(Number); for (let i = a; i <= z; i++) idx.push(i) } else idx.push(b)
    }
    const pick = (i) => (i === 'footer' ? d.footer : d.leaves[i])
    const parts = opts.each ? idx.map((i) => [i]) : [idx]
    for (const part of parts) {
      const ls = part.map(pick)
      if (ls.some((l) => !l)) throw new Error(`${route}: ${section} references a block that does not exist (${part})`)
      const inFlow = ls.length > 0
      const h = ls.reduce((a, l) => a + l.h, 0)
      const lo = inFlow ? Math.min(...ls.map((l) => l.top)) : null
      const h1Count = d.h1s.filter((y) => ls.some((l) => y >= l.top && y < l.top + l.h)).length
      const rec = { section, variant, heightPx: h, topPx: lo, inFlow, blocks: ls.map((l) => l.desc.slice(0, 60)), h1Count }
      if (opts.note) rec.note = opts.note
      nodes.push(rec)
    }
  }
  const inFlowHeightPx = nodes.reduce((a, n) => a + n.heightPx, 0)
  outRoutes[route] = { documentHeightPx: d.docHeight, inFlowHeightPx, unattributedPx: d.docHeight - inFlowHeightPx, h1Total: d.h1s.length, nodes }
}
mv.sectionHeights = {
  ...(mv.sectionHeights || {}),
  viewportPx: probes.viewport.width,
  tool: 'extraction/measure_heights.mjs + extraction/height-probes.json (Playwright, Chromium, full-page scroll warm-up, 1440x900)',
  routes: outRoutes,
}
writeFileSync(MV, JSON.stringify(mv, null, 2) + '\n')
console.log(`wrote sectionHeights for ${Object.keys(outRoutes).length} routes`)
