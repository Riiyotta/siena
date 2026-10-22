import UnderlineTitle from '../components/company/UnderlineTitle.jsx'
import { StaticForm } from '../components/company/FormField.jsx'
import { XlgButton } from '../components/company/shared.jsx'
import '../styles/company.css'

// specs/company.md "/events": title → events list (CMS empty → empty state) → newsletter signup. No Main CTA.
export default function Events() {
  return (
    <>
      <div className="ev-page mt-[40px] md:mt-0">
        <UnderlineTitle
          variant="events"
          sub="Meet the operators at the forefront of AI in customer experience and leave with ideas you can use right away."
        >
          Upcoming <em>Events</em>
        </UnderlineTitle>

        <div className="ev-list-wrap">
          <div className="ev-list">
            <div className="ev-empty">
              <h4 className="co-h4 ev-empty-h4">Check later to discover Siena's latest events</h4>
            </div>
          </div>
        </div>
      </div>

      <section className="ev-news">
        <img className="ev-news-bg" src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp" alt="" aria-hidden="true" />
        <div className="ev-news-card">
          <StaticForm className="ev-news-form">
            <h2 className="co-h2 text-center">Be the first to know what's happening</h2>
            <div className="ev-news-row">
              <label className="ev-news-field">
                <span className="sr-only">Email</span>
                <div className="co-input-wrap">
                  <input className="co-input" type="email" name="Email" placeholder="john.smith@example.com" required />
                </div>
              </label>
              <XlgButton type="submit" form>Sign me up!</XlgButton>
            </div>
          </StaticForm>
        </div>
      </section>
    </>
  )
}
