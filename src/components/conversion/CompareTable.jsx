// specs/conversion.md §3.3 — desktop <table> (exact live inline CSS lives in conversion.css .cv-table),
// phone (<810) stacked cards.
function Check() {
  return <img className="cv-check" src="/assets/a5SDd3EboOJuKxw06cfwFqcDs.png" alt="" width="20" height="20" />
}

export default function CompareTable({ title, competitor, rows }) {
  return (
    <section className="cv-cmp">
      <div className="cv-cmp-title">
        <h2 className="cv-h2">{title}</h2>
      </div>

      <div className="cv-cmp-desktop">
        <table className="cv-table">
          <thead>
            <tr>
              <th aria-label="Feature" />
              <th className="is-siena">SIENA AI</th>
              <th>{competitor}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, siena, other]) => (
              <tr key={label}>
                <td className="cv-td-label">{label}</td>
                <td className="cv-td-siena">
                  <div className="cv-td-check">
                    <Check />
                    <span>{siena}</span>
                  </div>
                </td>
                <td className="cv-td-other">{other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cv-cmp-mobile">
        {rows.map(([label, siena, other]) => (
          <div key={label} className="cv-cmp-card">
            <span className="cv-cmp-card-pre" aria-hidden="true" />
            <p className="cv-cmp-card-label">{label}</p>
            <div className="cv-cmp-card-siena">
              <p className="cv-cmp-card-col">SIENA AI</p>
              <div className="cv-td-check">
                <Check />
                <span>{siena}</span>
              </div>
            </div>
            <div className="cv-cmp-card-other">
              <p className="cv-cmp-card-col">{competitor}</p>
              <p className="cv-cmp-card-text">{other}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
