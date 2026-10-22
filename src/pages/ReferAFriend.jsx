import { Fragment } from 'react'
import Slide from '../components/testimonials/Slide.jsx'
import { TESTIMONIALS } from '../components/testimonials/data.js'
import CompanySlider from '../components/company/CompanySlider.jsx'
import CompanyCta from '../components/company/CompanyCta.jsx'
import { Field, StaticForm } from '../components/company/FormField.jsx'
import { XlgButton, FeatureItem } from '../components/company/shared.jsx'
import '../styles/company.css'

// specs/company.md "/refer-a-friend": Hero + referral form → criteria → testimonials (homepage data) → Main CTA.
const STEPS = [
  'Fill out the form with your friend\'s information',
  'We\'ll contact your friend. They attend a demo, you get $100',
  'When your friend becomes a customer, you get up to $10,000',
]

const CRITERIA = [
  { icon: 0xf847, title: 'Commerce connection', body: 'Your referral should be an ecommerce brand using Shopify.' },
  { icon: 0xe3f1, title: 'Decision-maker', body: 'Your referral should be a founder, CX leader, or executive responsible for driving AI implementation.' },
  { icon: 0xf652, title: 'Ticket volume threshold', body: 'Ideal referrals handle at least 3,000 customer interactions per month.', bodyClassName: 'rf-body-ink2' },
]

export default function ReferAFriend() {
  return (
    <>
      <section className="rf-hero mt-[40px] md:mt-0">
        <img className="rf-glow" src="/assets/QELfTLkuvZHSqcDqDFckc0OdzQ.webp" alt="" aria-hidden="true" />
        <div className="rf-row">
          <div className="rf-title">
            <h1 className="co-h1 co-appear-h1">
              Refer a <em>friend</em> to join Siena. Get $10,000.
            </h1>
            <ol className="rf-steps">
              {STEPS.map((s, i) => (
                <Fragment key={s}>
                  {i > 0 && (
                    <li className="rf-connector co-appear-d4" aria-hidden="true">
                      <img src="/svg/refer-a-friend-step-line.svg" alt="" />
                    </li>
                  )}
                  {/* live: steps 1-2 (row + connector) appear at 0.4s; step 3 only its text (number stays static) */}
                  <li className={`rf-step${i < 2 ? ' co-appear-d4' : ''}`}>
                    <span className="rf-step-num">{i + 1}</span>
                    <span className={`rf-step-text${i === 2 ? ' co-appear-d4' : ''}`}>{s}</span>
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>

          <div className="co-ring rf-ring co-appear-x">
            <div className="co-ring-inner">
              <StaticForm className="rf-form">
                <h2 className="co-form-header">Submit a referral</h2>
                <div className="rf-group">
                  <strong className="rf-group-label">Your informatioN</strong>
                  <Field label="Email address*" type="email" name="Email" placeholder="john.smith@example.com" required />
                </div>
                <div className="rf-group">
                  <strong className="rf-group-label">Referral information</strong>
                  <div className="co-form-row">
                    {/* "Full name*" is not actually required on live despite the asterisk */}
                    <Field label="Full name*" name="Full name" placeholder="John Smith" />
                    <Field label="Email address*" type="email" name="ReferralEmail" placeholder="john.smith@example.com" required />
                  </div>
                </div>
                <div className="co-form-submit">
                  <XlgButton type="submit" form>Submit</XlgButton>
                </div>
              </StaticForm>
            </div>
          </div>
        </div>
      </section>

      <section className="rf-criteria">
        <div className="rf-criteria-title">
          <p className="co-eyebrow">Terms and conditions.</p>
          <h2 className="co-h2 text-center">
            How do I know who to <em>refer?</em>
          </h2>
        </div>
        <div className="rf-criteria-row">
          {CRITERIA.map((c) => (
            <FeatureItem key={c.title} {...c} />
          ))}
        </div>
      </section>

      <CompanySlider
        variant="refer"
        items={TESTIMONIALS}
        renderSlide={(item, { key, ...props }) => <Slide key={key} data={item} {...props} />}
      />

      <CompanyCta variant="brands" phone="narrow" heading="Brands that win on CX run on Siena" />
    </>
  )
}
