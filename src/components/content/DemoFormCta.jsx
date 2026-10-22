import '../../styles/content.css'

// T1.8 demo-request CTA, anchor #book-a-demo. Static look-alike: native HTML5 validation runs,
// but submit is prevented (no network).
const stop = (e) => e.preventDefault()

function TextField({ label, name, type = 'text', placeholder }) {
  return (
    <label className="ct-label">
      <strong className="ct-label-text">{label}</strong>
      <div className="ct-field">
        <input className="ct-input" name={name} type={type} placeholder={placeholder} required />
      </div>
    </label>
  )
}

function SelectField({ label, name, options }) {
  return (
    <label className="ct-label ct-label--select">
      <strong className="ct-label-text">{label}</strong>
      <div className="ct-select">
        <select name={name} required defaultValue="">
          <option value="" disabled>Select one…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <img className="ct-select-icon" src="/svg/insights-select-chevron.svg" alt="" aria-hidden="true" />
      </div>
    </label>
  )
}

const row = 'flex w-full flex-col gap-[24px] tablet:flex-row tablet:gap-[16px]'

export default function DemoFormCta() {
  return (
    <section id="book-a-demo" className="relative flex w-full flex-row items-center justify-center overflow-hidden px-[24px] py-[40px] tablet:px-0 tablet:py-[120px]">
      <img
        src="/assets/5VTp1YGCJLYo9Grib0Ouvyooeag.webp"
        alt=""
        className="absolute inset-0 block h-full w-full object-cover"
        style={{ objectPosition: '50.4% 58.2%' }}
      />
      <div className="relative flex w-full max-w-[790px] flex-col items-center gap-[32px] rounded-[24px] bg-hero-bg px-[16px] py-[40px] tablet:gap-[40px] tablet:rounded-[48px] tablet:p-[64px]">
        <form className="flex w-full flex-col items-start gap-[24px]" onSubmit={stop} noValidate={false}>
          <div className="ct-form-head">
            <h4 className="m-0 font-display-regular text-[24px] font-normal leading-[28.8px] text-black tablet:text-[40px] tablet:leading-[48px]">
              Book a personalized demo now
            </h4>
          </div>
          <div className={row}>
            <TextField label="Full name*" name="fullName" placeholder="John Smith" />
            <TextField label="Work email*" name="workEmail" type="email" placeholder="john.smith@business.com" />
          </div>
          <div className={row}>
            <TextField label="Company website*" name="business_website" placeholder="www.mywebsite.com" />
            <SelectField label="Help desk*" name="helpDesk" options={['Gorgias', 'Zendesk', 'Kustomer', 'Gladly', 'Intercom', 'Salesforce', 'Other']} />
          </div>
          <div className={row}>
            <SelectField label="Monthly average tickets*" name="ticketVolume" options={['<5,000', '5,000-10,000', '10,000-20,000', '20,000-30,000', 'Over 30,000']} />
          </div>
          <div className={row}>
            <label className="ct-label">
              <strong className="ct-label-text">Where did you hear about us?*</strong>
              <div className="ct-textarea-wrap">
                <textarea className="ct-textarea" name="attribution" placeholder="Write us something..." required />
              </div>
            </label>
          </div>
          <div className="flex w-full flex-row justify-end">
            <button type="submit" className="ct-btn ct-btn--form w-full tablet:w-auto">Submit</button>
          </div>
        </form>
      </div>
    </section>
  )
}
