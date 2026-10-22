import HTicker from '../components/company/HTicker.jsx'
import { Field, StaticForm } from '../components/company/FormField.jsx'
import { XlgButton, FaIcon, FOUR_POINT_STAR } from '../components/company/shared.jsx'
import '../styles/company.css'

// specs/company.md "/community": hero with "Request an invite" form + logo ticker. No Main CTA.
const SIZES = [
  [176, 32], [159, 32], [209, 32], [167, 32], [119, 38], [111, 40],
  [120, 38], [91, 44], [241, 24], [99, 44], [161, 32], [207, 38], [156, 38], [71, 38], [112, 38], [150, 24],
  [152, 30], [188, 40], [154, 44], [126, 38], [178, 30], [103, 30], [189, 38], [86, 44], [112, 44], [144, 30],
  [82, 44], [121, 30], [107, 38],
]
const LOGOS = SIZES.map(([w, h], i) => ({ src: `/svg/community-logo-${String(i).padStart(2, '0')}.svg`, w, h }))

const BULLETS = ['Connect with like-minded individuals', 'Get early access & insights into the future of CX', 'Stay up to date with private events']

const FIELDS = [
  [
    { label: 'Full name*', name: 'Full name', placeholder: 'John Smith' },
    { label: 'Work email*', type: 'email', name: 'workEmail', placeholder: 'john.smith@example.com' },
  ],
  [
    { label: 'Phone number*', type: 'tel', name: 'phoneNumber', placeholder: '+ 1 555 555 55-55' },
    { label: 'Company*', name: 'company', placeholder: 'Acme Corp' },
  ],
  [
    { label: 'Website*', name: 'website', placeholder: 'www.mywebsite.com' },
    { label: 'Role*', name: 'role', placeholder: 'CEO' },
  ],
]

export default function Community() {
  return (
    <section className="cm-hero mt-[40px] md:mt-0">
      <img className="cm-glow" src="/assets/LhQ0hZskcxCtirPSSxXE4hUU0yo.webp" alt="" aria-hidden="true" />
      <div className="cm-row">
        <div className="cm-title">
          <div className="cm-text">
            <h1 className="co-h1 co-appear-h1">Join our private community on Slack</h1>
            <p className="co-sub cm-sub co-appear-d3">
              Get the juice on our latest developments, chat with fellow users, and join a group of fellow
              enthusiasts who share your passion for AI and CX.
            </p>
          </div>
          <ul className="cm-bullets">
            {BULLETS.map((b) => (
              <li key={b} className="cm-bullet">
                <span className="cm-bullet-icon">
                  <FaIcon code={FOUR_POINT_STAR} />
                </span>
                <span className="cm-bullet-text">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="co-ring cm-ring co-appear-x">
          <div className="co-ring-inner">
            <StaticForm className="cm-form">
              <h2 className="co-form-header">Request an invite</h2>
              <div className="cm-fields">
                {FIELDS.map((row, i) => (
                  <div key={i} className="co-form-row">
                    {row.map((f) => (
                      <Field key={f.name} required {...f} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="co-form-submit">
                <XlgButton type="submit" form>Apply to join</XlgButton>
              </div>
            </StaticForm>
          </div>
        </div>
      </div>

      <HTicker logos={LOGOS} className="cm-ticker" />
    </section>
  )
}
