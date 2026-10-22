import { useLayoutEffect, useRef, useState } from 'react'

// specs/company.md C5 — static copy of the Ashby component's built-in fallback list
// (live fetch is CORS-blocked on siena.cx, so visitors always see this + the status note).
const DEPARTMENTS = [
  {
    name: 'Engineering',
    roles: [
      ['Engineering Manager, Channels & Platform', 'Remote - Europe', 'd978919a-c34f-4465-96f2-66b8277df894'],
      ['Senior Fullstack Engineer', 'Argentina', '91e5e63a-7b02-4176-8b8f-0747042d756f'],
      ['Software Engineer, Platform Experience', 'Argentina', '9b020e8d-d953-4e52-b13e-f20397cc9199'],
    ],
  },
  {
    name: 'Product',
    roles: [
      ['Product Manager, Agent Platform', 'London', 'aa0c3428-680c-4e89-9bbd-ec6330272c20'],
      ['Product Specialist', 'Remote - Europe', '1216b030-76e0-443e-a7a7-7e826d3b3960'],
    ],
  },
  {
    name: 'GTM',
    roles: [
      ['Head of Product Education & Community', 'Toronto', 'f73532d2-5adf-4e81-8644-4c850ff808df'],
      ['Senior Solutions Engineer', 'Austin', 'c5430e14-d8bd-4e9a-b36e-4648306dad54'],
    ],
  },
  {
    name: 'Account Management',
    roles: [
      ['Director, Strategic Accounts', 'New York', '4c2561b7-4dd6-40ba-8fca-6452df7d5a9a'],
      ['Strategic Account Manager', 'New York', '6335ebaf-54e2-49ae-bc50-4a686de55d9e'],
      ['Strategic Account Manager - London', 'London', 'd593e639-c56e-49d8-937d-29da7dc88a2f'],
    ],
  },
  {
    name: 'Operations',
    roles: [['Senior Talent Partner (FTC)', 'London', 'ff35146a-5d1c-4da9-8c3f-b32bdfaa41d2']],
  },
  {
    name: 'Marketing',
    roles: [
      ['Founding Content Strategist', 'United Kingdom', '0ac30866-9135-4313-a5b0-54bbc87ccef8'],
      ['Founding Creative Director', 'London', '29c3eb4b-e0cd-4f42-9d17-959c69bebca4'],
    ],
  },
]
const TOTAL = DEPARTMENTS.reduce((n, d) => n + d.roles.length, 0) // 13

function Chevron() {
  return (
    <svg className="rl-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// height 0 <-> content height, `transition: height 240ms` (default ease).
function Panel({ open, id, children }) {
  const ref = useRef(null)
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    setHeight(open ? ref.current.scrollHeight : 0)
  }, [open])
  return (
    <div id={id} className="rl-panel" style={{ height }} aria-hidden={!open} inert={open ? undefined : ''}>
      <div ref={ref}>{children}</div>
    </div>
  )
}

export default function RolesList() {
  const [openIndex, setOpenIndex] = useState(-1)
  return (
    <div className="rl">
      <div className="rl-header">
        <h2 className="rl-h2">Explore our open roles</h2>
        <span className="rl-pill">{TOTAL}</span>
      </div>
      <p className="rl-note" role="status">
        We couldn’t reach our job board, so this list may be out of date.{' '}
        <a href="https://jobs.ashbyhq.com/siena" target="_blank" rel="noopener noreferrer">
          See all current roles on Ashby
        </a>
      </p>
      <div className="rl-list">
        {DEPARTMENTS.map((d, i) => {
          const open = openIndex === i
          const panelId = `rl-panel-${i}`
          return (
            <div key={d.name} className="rl-dept">
              <button
                type="button"
                className="rl-toggle"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : i)}
              >
                <span className="rl-dept-name">{d.name}</span>
                <span className="rl-pill">{d.roles.length}</span>
                <Chevron />
              </button>
              <Panel open={open} id={panelId}>
                {d.roles.map(([title, location, id]) => (
                  <a key={id} className="rl-role" href={`https://jobs.ashbyhq.com/siena/${id}`} target="_blank" rel="noopener noreferrer">
                    <span className="rl-role-title">{title}</span>
                    <span className="rl-role-loc">{location}</span>
                  </a>
                ))}
              </Panel>
            </div>
          )
        })}
      </div>
    </div>
  )
}
