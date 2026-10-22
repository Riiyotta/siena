import { useState } from 'react'
import { siteHref } from '../../routes.js'
import { STORIES, CATEGORIES } from './customersData.js'

// specs/company.md U2 — filter chips (native <select> on phone), 4-col card grid, Load more 20 → 36.
const INITIAL = 20

function StoryCard({ story }) {
  return (
    <a className="sg-card" href={siteHref(`/customer-stories/${story.slug}`)}>
      <div className="sg-card-inner">
        <div className="sg-logo-area">
          <img className="sg-logo" src={`/assets/${story.logo}`} alt="" loading="lazy" />
        </div>
        <div className="sg-body">
          <div className="sg-divider" />
          <div className="sg-meta">
            <div className="sg-tags">
              {story.tags.map((t) => (
                <span key={t} className="sg-tag">{t}</span>
              ))}
            </div>
            <h2 className="sg-title">{story.title}</h2>
          </div>
        </div>
      </div>
    </a>
  )
}

export default function StoryGrid() {
  const [category, setCategory] = useState('All')
  const [count, setCount] = useState(INITIAL)
  const all = category === 'All'
  const visible = all ? STORIES.slice(0, count) : STORIES.filter((s) => s.tags.includes(category))

  return (
    <section className="sg-section">
      <div className="sg-grid-wrap">
        <div className="sg-filter">
          <p className="sg-filter-label"><strong>Filter by:</strong></p>
          <div className="sg-chips" role="group" aria-label="Filter stories by category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`sg-chip${c === category ? ' is-active' : ''}`}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="sg-select-frame">
            <select className="sg-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter stories by category">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg className="sg-select-chevron" width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 6l4 4 4-4" stroke="#122023" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="sg-cards">
          {visible.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </div>

      {all && count < STORIES.length && (
        <button type="button" className="sg-load-more" onClick={() => setCount(STORIES.length)}>
          Load more
        </button>
      )}
    </section>
  )
}
